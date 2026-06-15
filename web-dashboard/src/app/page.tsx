'use client';

import React, { useState, useEffect } from 'react';
import { Users, Crop, Landmark, BadgePercent, ShieldAlert, ThermometerSun, AlertCircle, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_farmers: 1250,
    total_area_ha: 4850.5,
    financials: {
      total_costs: 12800000000,
      total_revenue: 37300000000,
      net_profit: 24500000000
    },
    ocop: {
      total_products: 15,
      average_stars: 4.5
    }
  });

  const recentDiaries = [
    { id: 1, farmer: 'Nguyễn Văn An', crop: 'Cà phê Robusta', activity: 'Bón phân NPK', location: 'Nam Yang, Đăk Đoa', date: '15/06/2026 08:30', status: 'Thành công' },
    { id: 2, farmer: 'Lê Thị Bình', crop: 'Sầu riêng Ri6', activity: 'Thu hoạch đợt 1', location: 'Xã Dun, Chư Sê', date: '15/06/2026 08:00', status: 'Thành công' },
    { id: 3, farmer: 'Nguyễn Văn Bảy', crop: 'Hồ tiêu', activity: 'Phun thuốc phòng nấm', location: 'Chư Prông', date: '14/06/2026 15:45', status: 'Cảnh báo' },
  ];

  const activeAlerts = [
    { type: 'Weather', title: 'Mưa lớn & Lũ quét', desc: 'Các huyện phía đông Gia Lai đề phòng sạt lở', severity: 'Critical' },
    { type: 'Disease', title: 'Rỉ sắt trên Cà phê', desc: 'Bùng phát cục bộ tại huyện Đăk Đoa', severity: 'Warning' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Tổng Quan Nông Nghiệp Gia Lai</h1>
          <p style={{ color: 'var(--text-muted)' }}>Cập nhật tự động lúc: 15/06/2026 11:50</p>
        </div>
        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderColor: 'var(--accent-primary)' }}>
          <Sparkles color="var(--accent-primary)" size={16} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hệ thống chuyển đổi số đang hoạt động</span>
        </div>
      </header>

      {/* Grid Stats */}
      <section className="grid-stats">
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-title">Nông hộ đăng ký</span>
            <Users color="var(--accent-primary)" size={24} />
          </div>
          <span className="stat-value">{stats.total_farmers.toLocaleString('vi-VN')}</span>
          <span className="stat-desc">▲ +12% so với tháng trước</span>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-title">Diện tích số hóa</span>
            <Crop color="var(--accent-primary)" size={24} />
          </div>
          <span className="stat-value">{stats.total_area_ha.toLocaleString('vi-VN')} ha</span>
          <span className="stat-desc">Bản đồ số GIS hoạt động</span>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-title">Sản phẩm OCOP</span>
            <Landmark color="var(--accent-primary)" size={24} />
          </div>
          <span className="stat-value">{stats.ocop.total_products} SP</span>
          <span className="stat-desc">Đánh giá trung bình: {stats.ocop.average_stars} ★</span>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-title">Ước tính lợi nhuận</span>
            <BadgePercent color="var(--accent-primary)" size={24} />
          </div>
          <span className="stat-value">{(stats.financials.net_profit / 1e9).toFixed(1)} Tỷđ</span>
          <span className="stat-desc">Doanh thu: {(stats.financials.total_revenue / 1e9).toFixed(1)} Tỷđ</span>
        </div>
      </section>

      {/* Charts Section */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        {/* Production Bar Chart */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '24px' }}>Sản Lượng Nông Sản Thu Hoạch (Tấn)</h3>
          <div className="chart-container">
            <div className="bar-wrapper">
              <span className="bar-val">1,500</span>
              <div className="bar" style={{ height: '180px' }}></div>
              <span className="bar-label">Cà phê</span>
            </div>
            <div className="bar-wrapper">
              <span className="bar-val">450</span>
              <div className="bar" style={{ height: '70px' }}></div>
              <span className="bar-label">Hồ tiêu</span>
            </div>
            <div className="bar-wrapper">
              <span className="bar-val">820</span>
              <div className="bar" style={{ height: '120px' }}></div>
              <span className="bar-label">Sầu riêng</span>
            </div>
            <div className="bar-wrapper">
              <span className="bar-val">120</span>
              <div className="bar" style={{ height: '30px' }}></div>
              <span className="bar-label">Mắc ca</span>
            </div>
            <div className="bar-wrapper">
              <span className="bar-val">310</span>
              <div className="bar" style={{ height: '55px' }}></div>
              <span className="bar-label">Mật ong & Khác</span>
            </div>
          </div>
        </div>

        {/* Cost Structure Breakdown */}
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3>Cơ Cấu Chi Phí Sản Xuất</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Phân bón & Thuốc BVTV</span>
                <strong>42%</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', backgroundColor: 'var(--accent-primary)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Nhân công lao động</span>
                <strong>28%</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '28%', height: '100%', backgroundColor: 'var(--accent-primary)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Giống cây trồng/Vật nuôi</span>
                <strong>18%</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '18%', height: '100%', backgroundColor: 'var(--accent-primary)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Máy móc & Nhiên liệu</span>
                <strong>12%</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '12%', height: '100%', backgroundColor: 'var(--accent-primary)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alerts and Log Journals */}
      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Recent Diaries table */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3>Nhật Ký Điện Tử Gần Đây</h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Nông hộ</th>
                <th>Cây trồng</th>
                <th>Hoạt động</th>
                <th>Vị trí</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentDiaries.map((d) => (
                <tr key={d.id}>
                  <td>{d.farmer}</td>
                  <td>{d.crop}</td>
                  <td>{d.activity}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{d.location}</td>
                  <td>{d.date}</td>
                  <td>
                    <span className={`badge ${d.status === 'Thành công' ? 'badge-success' : 'badge-warning'}`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alerts Center */}
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3>Cảnh Báo Đang Hoạt Động</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeAlerts.map((a, i) => (
              <div key={i} style={{ 
                padding: '16px', borderRadius: '12px', borderLeft: '4px solid', 
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderColor: a.severity === 'Critical' ? '#f87171' : '#fbbf24'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {a.severity === 'Critical' ? <ShieldAlert color="#f87171" size={18} /> : <ThermometerSun color="#fbbf24" size={18} />}
                  <h4 style={{ fontSize: '0.9rem', color: a.severity === 'Critical' ? '#f87171' : '#fbbf24' }}>
                    {a.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
