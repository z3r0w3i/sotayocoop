import 'package:flutter/material.dart';

class AiChatScreen extends StatefulWidget {
  const AiChatScreen({Key? key}) : super(key: key);

  @override
  State<AiChatScreen> createState() => _AiChatScreenState();
}

class _AiChatScreenState extends State<AiChatScreen> {
  final List<Map<String, dynamic>> _messages = [
    {
      'is_user': false,
      'text': 'Chào bà con! Tôi là Trợ lý AI Nông nghiệp Gia Lai. Bà con có thể đặt câu hỏi về chăm sóc cây trồng (cà phê, hồ tiêu, sầu riêng) hoặc chụp ảnh lá cây bị sâu bệnh để tôi chẩn đoán giúp nhé.',
      'type': 'text'
    }
  ];

  final _textController = TextEditingController();
  bool _isTyping = false;

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;
    _textController.clear();
    
    setState(() {
      _messages.add({'is_user': true, 'text': text, 'type': 'text'});
      _isTyping = true;
    });

    // Simulate AI response delay
    Future.delayed(const Duration(seconds: 1, milliseconds: 500), () {
      String reply = 'Tôi xin ghi nhận câu hỏi. ';
      if (text.toLowerCase().contains('cà phê') || text.toLowerCase().contains('tưới')) {
        reply = 'Đối với cà phê Robusta mùa khô tại Gia Lai, bà con nên tưới đợt 1 khoảng 200-240 lít/gốc để kích thích bung hoa đồng loạt. Tránh tưới quá sớm hoa sẽ nở nghẹn.';
      } else if (text.toLowerCase().contains('sầu riêng') || text.toLowerCase().contains('phân')) {
        reply = 'Sầu riêng Ri6 giai đoạn nuôi trái cần bổ sung phân Kali trắng (K2SO4) để giúp quả ngọt cơm vàng, hạn chế sượng trái. Bà con tránh bón phân đạm quá nhiều lúc này.';
      } else {
        reply = 'Theo tài liệu khuyến nông Gia Lai, bà con hãy chú ý làm rãnh thoát nước nhanh cho rẫy vào đầu mùa mưa để tránh úng cổ rễ sinh ra nấm Phytophthora gây thối rễ.';
      }

      setState(() {
        _messages.add({'is_user': false, 'text': reply, 'type': 'text'});
        _isTyping = false;
      });
    });
  }

  // Chụp ảnh sâu bệnh để chẩn đoán
  void _diagnoseImage() {
    setState(() {
      _messages.add({
        'is_user': true,
        'text': 'Đã tải lên ảnh lá sầu riêng bị vàng đốm',
        'type': 'image'
      });
      _isTyping = true;
    });

    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _messages.add({
          'is_user': false,
          'text': 'Chẩn đoán AI (Độ tin cậy: 92%):\n\n'
                  '- Bệnh phát hiện: Nứt thân xì mủ (Phytophthora palmivora).\n'
                  '- Mức độ: Trung bình.\n'
                  '- Triệu chứng: Vết nứt trên vỏ chảy nhựa đục, lá vàng úa.\n'
                  '- Giải pháp xử lý: Cạo nhẹ vết loét, bôi hoạt chất Metalaxyl trực tiếp lên. Thoát nước tốt gốc, quét vôi trắng thân cây từ 1m trở xuống.',
          'type': 'diagnosis'
        });
        _isTyping = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0F0D),
      appBar: AppBar(
        backgroundColor: const Color(0xFF121915),
        title: const Text('Trợ Lý AI Nông Nghiệp'),
      ),
      body: Column(
        children: [
          // Chat messages list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['is_user'];
                final isDiagnosis = msg['type'] == 'diagnosis';

                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    maxWidth: MediaQuery.of(context).size.width * 0.8,
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isUser
                          ? const Color(0xFF10B981)
                          : (isDiagnosis ? const Color(0xFF2B2516) : const Color(0xFF121915)),
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(12),
                        topRight: const Radius.circular(12),
                        bottomLeft: Radius.circular(isUser ? 12 : 0),
                        bottomRight: Radius.circular(isUser ? 0 : 12),
                      ),
                      border: Border.all(
                        color: isDiagnosis
                            ? Colors.amber.withOpacity(0.3)
                            : Colors.transparent,
                      ),
                    ),
                    child: Text(
                      msg['text'],
                      style: TextStyle(
                        color: isUser ? const Color(0xFF0A0F0D) : Colors.white,
                        fontSize: 13.5,
                        height: 1.4,
                        fontWeight: isUser ? FontWeight.w600 : FontWeight.normal,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          if (_isTyping)
            const Padding(
              padding: EdgeInsets.all(12.0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'AI đang phân tích...',
                  style: TextStyle(color: Color(0xFF10B981), fontSize: 11, fontStyle: FontStyle.italic),
                ),
              ),
            ),

          // Message input bar
          Container(
            padding: const EdgeInsets.all(12),
            color: const Color(0xFF121915),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.add_a_photo, color: Colors.orangeAccent),
                  onPressed: _diagnoseImage,
                ),
                Expanded(
                  child: TextField(
                    controller: _textController,
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'Nhập câu hỏi kỹ thuật canh tác...',
                      hintStyle: const TextStyle(color: Color(0xFF4B5563), fontSize: 13),
                      filled: true,
                      fillColor: const Color(0xFF0A0F0D),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    onSubmitted: _sendMessage,
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: const Color(0xFF10B981),
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Color(0xFF0A0F0D), size: 18),
                    onPressed: () => _sendMessage(_textController.text),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
