class LocationService {
  // Trích xuất tọa độ GPS hiện tại của điện thoại
  Future<Map<String, double>> getCurrentLocation() async {
    // Trong môi trường thật, ta gọi Geolocator.getCurrentPosition()
    // Ở đây mock tọa độ vùng trồng tại Đăk Đoa, Gia Lai
    await Future.delayed(const Duration(milliseconds: 600));
    return {
      'latitude': 14.0125,
      'longitude': 108.1256,
    };
  }

  // Tạo chuỗi WKT Point từ tọa độ để lưu vào PostGIS
  String toWktPoint(double lon, double lat) {
    return 'POINT($lon $lat)';
  }
}
