import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://localhost:3000/api'; // Trỏ vào NestJS IP/Domain
  String? _token;

  void setToken(String token) {
    _token = token;
  }

  Map<String, String> _getHeaders() {
    return {
      'Content-Type': 'application/json',
      if (_token != null) 'Authorization': 'Bearer $_token',
    };
  }

  // GET Request
  async Future<dynamic> get(String endpoint) async {
    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: _getHeaders(),
    );
    return _parseResponse(response);
  }

  // POST Request
  async Future<dynamic> post(String endpoint, Map<String, dynamic> body) async {
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: _getHeaders(),
      body: jsonEncode(body),
    );
    return _parseResponse(response);
  }

  // POST Multi-part for AI Image disease diagnosis
  async Future<dynamic> uploadImage(String endpoint, List<int> imageBytes, String filename) async {
    final request = http.MultipartRequest('POST', Uri.parse('$baseUrl$endpoint'));
    if (_token != null) {
      request.headers['Authorization'] = 'Bearer $_token';
    }
    
    final file = http.MultipartFile.fromBytes(
      'image', 
      imageBytes,
      filename: filename,
    );
    request.files.add(file);
    
    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);
    return _parseResponse(response);
  }

  dynamic _parseResponse(http.Response response) {
    final int statusCode = response.statusCode;
    if (statusCode >= 200 && statusCode < 300) {
      return jsonDecode(utf8.decode(response.bodyBytes));
    } else {
      throw Exception('HTTP Error: $statusCode - ${response.body}');
    }
  }
}
