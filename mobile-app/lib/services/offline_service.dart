import 'dart:async';
import 'api_service.dart';

class OfflineService {
  final ApiService _apiService;
  
  // Hộp chứa dữ liệu ngoại tuyến (giả lập lưu trữ bằng Hive)
  final List<Map<String, dynamic>> _offlineDiaryQueue = [];
  bool _isOnline = true;

  OfflineService(this._apiService);

  // Ghi nhận trạng thái kết nối mạng thay đổi
  void updateConnectionStatus(bool online) {
    _isOnline = online;
    if (_isOnline && _offlineDiaryQueue.isNotEmpty) {
      syncOfflineData();
    }
  }

  // Lưu tạm nhật ký canh tác khi offline
  Future<void> saveDiaryOffline(Map<String, dynamic> diaryData) async {
    _offlineDiaryQueue.add(diaryData);
    print('Lưu nhật ký ngoại tuyến thành công. Chờ kết nối lại mạng để đồng bộ.');
  }

  // Đồng bộ toàn bộ dữ liệu ngoại tuyến lên Backend NestJS
  Future<void> syncOfflineData() async {
    if (!_isOnline || _offlineDiaryQueue.isEmpty) return;

    print('Đang phát hiện có kết nối mạng. Tiến hành đồng bộ ${_offlineDiaryQueue.length} nhật ký...');
    final List<Map<String, dynamic>> successfullySynced = [];

    for (var diary in _offlineDiaryQueue) {
      try {
        await _apiService.post('/diaries', diary);
        successfullySynced.add(diary);
      } catch (e) {
        print('Lỗi đồng bộ bản ghi nhật ký: ${e.toString()}');
      }
    }

    // Xóa các bản ghi đã đồng bộ thành công khỏi hàng đợi
    for (var item in successfullySynced) {
      _offlineDiaryQueue.remove(item);
    }
    print('Đồng bộ hoàn tất. Còn lại ${_offlineDiaryQueue.length} bản ghi chưa được gửi.');
  }

  List<Map<String, dynamic>> getPendingSyncDiaries() {
    return _offlineDiaryQueue;
  }
}
