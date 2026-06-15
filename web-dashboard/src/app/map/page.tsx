'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Import động không SSR để tương thích với Leaflet
const AgriMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%', minHeight: '600px', backgroundColor: 'var(--bg-secondary)', 
      borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid var(--border-color)', color: 'var(--text-muted)'
    }}>
      Đang tải bản đồ số nông nghiệp Gia Lai...
    </div>
  )
});

export default function MapPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: 'calc(100vh - 80px)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Bản Đồ Số Vùng Trồng Nông Nghiệp</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Giám sát ranh giới tọa độ GPS thửa đất canh tác và liên kết các hợp tác xã thu mua
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', flex: 1, minHeight: 0 }}>
        {/* Map Container */}
        <div className="glass-panel" style={{ padding: '10px', height: '100%' }}>
          <AgriMap />
        </div>

        {/* Control & Layers Panel */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3>Điều Khiển Bản Đồ</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Lớp dữ liệu hiển thị
            </span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent-primary)' }} />
              <span>Ranh giới thửa đất (PostGIS)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent-primary)' }} />
              <span>Điểm định vị Hộ nông dân</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent-primary)' }} />
              <span>Hợp tác xã & Trạm thu mua</span>
            </label>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Thông tin chú giải màu
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#10b981', borderRadius: '4px', opacity: 0.7 }} />
              <span>Cà phê Robusta</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#fbbf24', borderRadius: '4px', opacity: 0.7 }} />
              <span>Sầu riêng Ri6</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#3b82f6', borderRadius: '4px', opacity: 0.7 }} />
              <span>Hồ tiêu</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '10px', border: '1px dashed var(--border-color)' }}>
            <p style={{ fontSize: '0.8rem', lineHeight: '1.4', color: 'var(--text-muted)' }}>
              Mẹo: Click trực tiếp vào các đa giác vùng trồng hoặc trạm đánh dấu để xem chi tiết thông tin chủ sở hữu, diện tích và giống canh tác.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
