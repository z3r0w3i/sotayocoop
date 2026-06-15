import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/offline_service.dart';

class DiaryProvider extends ChangeNotifier {
  final ApiService _apiService;
  final OfflineService _offlineService;

  List<dynamic> _diaries = [];
  bool _isLoading = false;
  bool _isOnline = true;

  DiaryProvider(this._apiService, this._offlineService);

  List<dynamic> get diaries => _diaries;
  bool get isLoading => _isLoading;
  bool get isOnline => _isOnline;

  // Cập nhật trạng thái mạng của ứng dụng
  void setOnlineStatus(bool online) {
    _isOnline = online;
    _offlineService.updateConnectionStatus(online);
    notifyListeners();
  }

  // Tải danh sách nhật ký
  Future<void> fetchDiaries(int cropId) async {
    _isLoading = true;
    notifyListeners();

    try {
      if (_isOnline) {
        final data = await _apiService.get('/diaries?crop_id=$cropId');
        _diaries = data;
      } else {
        // Nếu offline, chỉ hiển thị hàng đợi offline tạm thời
        _diaries = _offlineService.getPendingSyncDiaries();
      }
    } catch (e) {
      print('Lỗi lấy nhật ký: ${e.toString()}');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Thêm mới một dòng nhật ký (hỗ trợ lưu offline)
  Future<void> addDiaryEntry({
    required int cropId,
    required String activityType,
    required String notes,
    required String? wktLocation,
    required List<String> mediaUrls,
  }) async {
    final Map<String, dynamic> diaryData = {
      'crop_id': cropId,
      'activity_type': activityType,
      'notes': notes,
      'gps_location': wktLocation,
      'media_urls': mediaUrls,
    };

    if (_isOnline) {
      _isLoading = true;
      notifyListeners();
      try {
        await _apiService.post('/diaries', diaryData);
        // Tải lại dữ liệu mới
        await fetchDiaries(cropId);
      } catch (e) {
        print('Lỗi bưu điện nhật ký online: $e. Lưu tạm offline.');
        await _offlineService.saveDiaryOffline(diaryData);
      } finally {
        _isLoading = false;
        notifyListeners();
      }
    } else {
      // Offline mode
      await _offlineService.saveDiaryOffline(diaryData);
      _diaries = [..._offlineService.getPendingSyncDiaries(), ..._diaries];
      notifyListeners();
    }
  }
}
