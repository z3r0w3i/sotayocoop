'use client';

import React, { useEffect } from 'react';

export default function MapComponent() {
  useEffect(() => {
    // Chỉ chạy trong trình duyệt
    if (typeof window === 'undefined') return;

    // Load Leaflet dynamically to avoid SSR error
    import('leaflet').then((L) => {
      // Khởi tạo bản đồ Gia Lai (tọa độ Pleiku)
      const map = L.map('agri-map').setView([13.9822, 108.0062], 10);

      // Thêm lớp bản đồ OpenStreetMap nền tối phù hợp aesthetics hệ thống
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Định nghĩa các vùng trồng mẫu (Polygons)
      const dakDoaCoffee = L.polygon([
        [14.012, 108.125],
        [14.012, 108.129],
        [14.016, 108.129],
        [14.016, 108.125]
      ], {
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.35,
        weight: 2
      }).addTo(map);

      dakDoaCoffee.bindPopup(`
        <div style="color: #1f2937; font-family: sans-serif; font-size: 0.85rem; padding: 4px;">
          <h4 style="margin-bottom: 4px; color: #10b981;">Rẫy Cà phê Robusta Đăk Đoa</h4>
          <p><b>Chủ hộ:</b> Nguyễn Văn An</p>
          <p><b>Diện tích:</b> 1.5 ha (Đất đỏ Bazan)</p>
          <p><b>Giống cây:</b> TR4 (Gieo trồng 2023)</p>
          <p><b>Trạng thái:</b> Đang sinh trưởng tốt</p>
        </div>
      `);

      const chuSeDurian = L.polygon([
        [13.654, 108.012],
        [13.654, 108.016],
        [13.658, 108.016],
        [13.658, 108.012]
      ], {
        color: '#fbbf24',
        fillColor: '#fbbf24',
        fillOpacity: 0.35,
        weight: 2
      }).addTo(map);

      chuSeDurian.bindPopup(`
        <div style="color: #1f2937; font-family: sans-serif; font-size: 0.85rem; padding: 4px;">
          <h4 style="margin-bottom: 4px; color: #d97706;">Vườn Sầu riêng Chư Sê</h4>
          <p><b>Chủ hộ:</b> Lê Thị Bình</p>
          <p><b>Diện tích:</b> 1.8 ha</p>
          <p><b>Giống cây:</b> Ri6 (Đang vụ thu hoạch)</p>
          <p><b>Chất lượng:</b> VietGAP đạt chuẩn xuất khẩu</p>
        </div>
      `);

      // Các điểm thu mua và hợp tác xã nông sản
      const cooperatives = [
        { name: 'HTX Nông Nghiệp Đăk Đoa', lat: 14.0205, lon: 108.1340, desc: 'Điểm thu gom cà phê & tiêu sạch' },
        { name: 'Hội Nông Dân Chư Sê', lat: 13.6590, lon: 108.0210, desc: 'Trung tâm kỹ thuật & thu mua sầu riêng' },
        { name: 'Tổng kho Mắc ca Pleiku', lat: 13.9780, lon: 108.0120, desc: 'Sở KHCN hỗ trợ đóng gói nhãn hiệu' }
      ];

      cooperatives.forEach((coop) => {
        const marker = L.marker([coop.lat, coop.lon]).addTo(map);
        marker.bindPopup(`
          <div style="color: #1f2937; font-family: sans-serif; font-size: 0.85rem; padding: 4px;">
            <h4 style="margin-bottom: 2px; color: #0284c7;">${coop.name}</h4>
            <p>${coop.desc}</p>
          </div>
        `);
      });

      // Cleanup function
      return () => {
        map.remove();
      };
    });
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Thư viện Leaflet CSS được thêm động qua link CDN */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div id="agri-map" style={{ width: '100%', height: '100%', borderRadius: '16px' }} />
    </div>
  );
}
