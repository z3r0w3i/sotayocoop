import 'package:flutter/material.dart';
import 'diary_screen.dart';
import 'ai_chat_screen.dart';
import 'map_screen.dart';
import 'traceability_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0F0D), // Dark slate
      appBar: AppBar(
        backgroundColor: const Color(0xFF121915),
        elevation: 0,
        title: Row(
          children: [
            const Icon(Icons.menu_book, color: Color(0xFF10B981)),
            const SizedBox(width: 8),
            const Text(
              'Sổ Tay Số Nông Dân',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_active, color: Colors.amber),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome & Location Card
              _buildFarmerHeader(),
              const SizedBox(height: 20),

              // Weather & Disease Alerts Row
              const Text(
                'Cảnh Báo Khu Vực Đăk Đoa',
                style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              _buildAlertsRow(),
              const SizedBox(height: 20),

              // Navigation Grid Menu
              const Text(
                'Chức Năng Chính',
                style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              _buildMenuGrid(context),
              const SizedBox(height: 25),

              // Agricultural Price Feed
              const Text(
                'Bảng Giá Nông Sản Gia Lai',
                style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              _buildPriceFeed(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFarmerHeader() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF121915),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF10B981).withOpacity(0.2)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: const Color(0xFF10B981),
            child: const Icon(Icons.person, color: Color(0xFF0A0F0D), size: 30),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Chào bà con, Nguyễn Văn An',
                  style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 4),
                Text(
                  'Xã Nam Yang, huyện Đăk Đoa',
                  style: TextStyle(color: Color(0xFF9CA3AF), fontSize: 13),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              'Online',
              style: TextStyle(color: Color(0xFF10B981), fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAlertsRow() {
    return Row(
      children: [
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF2A1B1B), // Dark reddish
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.red.withOpacity(0.3)),
            ),
            child: Row(
              children: const [
                Icon(Icons.wb_sunny_outlined, color: Colors.redAccent, size: 28),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Dự báo: Gió mạnh đợt lốc xoáy',
                    style: TextStyle(color: Colors.white, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF2B2516), // Dark amberish
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.amber.withOpacity(0.3)),
            ),
            child: Row(
              children: const [
                Icon(Icons.bug_report_outlined, color: Colors.amber, size: 28),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Bệnh rỉ sắt cà phê lan rộng',
                    style: TextStyle(color: Colors.white, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMenuGrid(BuildContext context) {
    final List<Map<String, dynamic>> menuItems = [
      {'title': 'Nhật ký điện tử', 'icon': Icons.edit_calendar, 'color': const Color(0xFF10B981), 'screen': const DiaryScreen(cropId: 1)},
      {'title': 'Vẽ thửa đất GIS', 'icon': Icons.map_outlined, 'color': const Color(0xFF3B82F6), 'screen': const MapScreen()},
      {'title': 'AI Tư vấn dịch bệnh', 'icon': Icons.online_prediction, 'color': Colors.purpleAccent, 'screen': const AiChatScreen()},
      {'title': 'Truy xuất nguồn gốc', 'icon': Icons.qr_code_scanner, 'color': Colors.orangeAccent, 'screen': const TraceabilityScreen()},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.4,
      ),
      itemCount: menuItems.length,
      itemBuilder: (context, index) {
        final item = menuItems[index];
        return GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => item['screen']),
            );
          },
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF121915),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: item['color'].withOpacity(0.15)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(item['icon'], color: item['color'], size: 30),
                Text(
                  item['title'],
                  style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildPriceFeed() {
    final List<Map<String, dynamic>> priceData = [
      {'name': 'Cà phê Robusta', 'price': '124,500 đ/kg', 'change': '▲ +1.5%'},
      {'name': 'Hồ tiêu Đăk Đoa', 'price': '156,000 đ/kg', 'change': '▲ +0.8%'},
      {'name': 'Sầu riêng Ri6', 'price': '82,000 đ/kg', 'change': '▼ -2.1%'},
    ];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF121915),
        borderRadius: BorderRadius.circular(16),
      ),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: priceData.length,
        separatorBuilder: (context, index) => const Divider(color: Color(0xFF1A231E)),
        itemBuilder: (context, index) {
          final p = priceData[index];
          final isUp = p['change'].contains('▲');
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(p['name'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500)),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(p['price'], style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
                    const SizedBox(height: 2),
                    Text(
                      p['change'],
                      style: TextStyle(
                        color: isUp ? Colors.emeraldAccent : Colors.redAccent,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
// Stub classes to make compilation reference work
class MapScreen extends StatelessWidget { const MapScreen({Key? key}) : super(key: key); @override Widget build(BuildContext context) => Scaffold(body: Center(child: Text("Map"))); }
class TraceabilityScreen extends StatelessWidget { const TraceabilityScreen({Key? key}) : super(key: key); @override Widget build(BuildContext context) => Scaffold(body: Center(child: Text("Traceability"))); }
