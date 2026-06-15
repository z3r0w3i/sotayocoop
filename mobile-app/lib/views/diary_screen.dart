import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/diary_provider.dart';
import '../services/location_service.dart';

class DiaryScreen extends StatefulWidget {
  final int cropId;
  const DiaryScreen({Key? key, required this.cropId}) : super(key: key);

  @override
  State<DiaryScreen> createState() => _DiaryScreenState();
}

class _DiaryScreenState extends State<DiaryScreen> {
  final _notesController = TextEditingController();
  String _selectedActivity = 'Bón phân';
  String? _gpsText;
  bool _offlineMode = false;

  final List<String> _activities = ['Gieo trồng', 'Bón phân', 'Tưới nước', 'Phun thuốc', 'Thu hoạch'];
  final LocationService _locationService = LocationService();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<DiaryProvider>(context, listen: false).fetchDiaries(widget.cropId);
    });
  }

  Future<void> _checkInGPS() async {
    try {
      final loc = await _locationService.getCurrentLocation();
      setState(() {
        _gpsText = 'POINT(${loc['longitude']} ${loc['latitude']})';
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Check-in tọa độ GPS thành công!')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Không thể lấy GPS. Vui lòng bật định vị.')),
      );
    }
  }

  void _submitDiary() {
    if (_notesController.text.trim().isEmpty) return;

    final diaryProvider = Provider.of<DiaryProvider>(context, listen: false);
    diaryProvider.addDiaryEntry(
      cropId: widget.cropId,
      activityType: _selectedActivity,
      notes: _notesController.text,
      wktLocation: _gpsText,
      mediaUrls: ['https://minio.gialai.gov.vn/sotayocoop/media/user_upload_1.jpg'],
    );

    _notesController.clear();
    setState(() {
      _gpsText = null;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          diaryProvider.isOnline
              ? 'Đã tải nhật ký lên máy chủ!'
              : 'Ứng dụng đang ngoại tuyến. Nhật ký đã lưu tạm trong bộ nhớ máy.',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final diaryProvider = Provider.of<DiaryProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF0A0F0D),
      appBar: AppBar(
        backgroundColor: const Color(0xFF121915),
        title: const Text('Nhật Ký Điện Tử Canh Tác'),
        actions: [
          Switch(
            value: diaryProvider.isOnline,
            activeColor: const Color(0xFF10B981),
            onChanged: (val) {
              diaryProvider.setOnlineStatus(val);
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Banner Cảnh báo Offline
          if (!diaryProvider.isOnline)
            Container(
              width: double.infinity,
              color: Colors.amber.withOpacity(0.9),
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              child: Row(
                children: const [
                  Icon(Icons.wifi_off, color: Colors.black, size: 16),
                  SizedBox(width: 8),
                  Text(
                    'Đang ngoại tuyến. Dữ liệu ghi sẽ tự đồng bộ khi có mạng.',
                    style: TextStyle(color: Colors.black, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),

          // Khung ghi nhật ký mới
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF121915),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF10B981).withOpacity(0.1)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Thêm hoạt động mới',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      DropdownButton<String>(
                        dropdownColor: const Color(0xFF121915),
                        value: _selectedActivity,
                        style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold),
                        underline: Container(),
                        items: _activities.map((act) {
                          return DropdownMenuItem(value: act, child: Text(act));
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) {
                            setState(() {
                              _selectedActivity = val;
                            });
                          }
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _notesController,
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                    maxLines: 3,
                    decoration: InputDecoration(
                      hintText: 'Nhập chi tiết hoạt động bón phân, tưới nước, liều lượng sử dụng...',
                      hintStyle: const TextStyle(color: Color(0xFF4B5563), fontSize: 13),
                      filled: true,
                      fillColor: const Color(0xFF0A0F0D),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.gps_fixed, color: Color(0xFF10B981)),
                            onPressed: _checkInGPS,
                          ),
                          Text(
                            _gpsText != null ? 'Đã ghim vị trí' : 'Định vị GPS',
                            style: const TextStyle(color: Colors.white70, fontSize: 12),
                          ),
                          const SizedBox(width: 16),
                          IconButton(
                            icon: const Icon(Icons.add_a_photo, color: Colors.orangeAccent),
                            onPressed: () {},
                          ),
                          const Text(
                            'Ảnh/Video',
                            style: const TextStyle(color: Colors.white70, fontSize: 12),
                          ),
                        ],
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF10B981),
                          foregroundColor: const Color(0xFF0a0f0d),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: _submitDiary,
                        child: const Text('Lưu ghi nhận', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          const Divider(color: Color(0xFF1F2937)),

          // Lịch sử ghi nhận
          Expanded(
            child: diaryProvider.isLoading
                ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: diaryProvider.diaries.length,
                    itemBuilder: (context, index) {
                      final item = diaryProvider.diaries[index];
                      final bool isOfflinePending = item['id'] == null;
                      return Card(
                        color: const Color(0xFF121915),
                        margin: const EdgeInsets.bottom(12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(
                            color: isOfflinePending ? Colors.amber.withOpacity(0.3) : const Color(0xFF10B981).withOpacity(0.05),
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF10B981).withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      item['activity_type'] ?? 'Không rõ',
                                      style: const TextStyle(color: Color(0xFF10B981), fontSize: 12, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  if (isOfflinePending)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: Colors.amber.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: const Text('Chờ đồng bộ', style: TextStyle(color: Colors.amber, fontSize: 10)),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(
                                item['notes'] ?? '',
                                style: const TextStyle(color: Colors.white, fontSize: 13),
                              ),
                              const SizedBox(height: 10),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.location_on_outlined, color: Colors.white54, size: 14),
                                      const SizedBox(width: 4),
                                      Text(
                                        item['gps_location'] != null ? 'Có tọa độ PostGIS' : 'Không ghim GPS',
                                        style: const TextStyle(color: Colors.white54, fontSize: 11),
                                      ),
                                    ],
                                  ),
                                  Text(
                                    item['activity_date'] ?? 'Gần đây',
                                    style: const TextStyle(color: Colors.white30, fontSize: 11),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
