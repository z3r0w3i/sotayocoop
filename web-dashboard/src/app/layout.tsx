import React from 'react';
import './globals.css';
import { LayoutDashboard, Map, Award, TrendingUp, AlertTriangle, BookOpen, Settings, User } from 'lucide-react';

export const metadata = {
  title: 'Sổ Tay Số Nông Dân Gia Lai - Cổng Thông Tin Lãnh Đạo',
  description: 'Hệ thống quản lý, giám sát và thống kê nông nghiệp số tỉnh Gia Lai',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="brand">
              <BookOpen size={28} />
              <span>GIA LAI AGRI-PORTAL</span>
            </div>
            
            <nav style={{ flex: 1 }}>
              <ul className="menu-list">
                <li>
                  <a href="/" className="menu-item active">
                    <LayoutDashboard size={20} />
                    <span>Tổng quan</span>
                  </a>
                </li>
                <li>
                  <a href="/map" className="menu-item">
                    <Map size={20} />
                    <span>Bản đồ số vùng trồng</span>
                  </a>
                </li>
                <li>
                  <a href="/ocop" className="menu-item">
                    <Award size={20} />
                    <span>Hồ sơ OCOP</span>
                  </a>
                </li>
                <li>
                  <a href="/prices" className="menu-item">
                    <TrendingUp size={20} />
                    <span>Giá cả nông sản</span>
                  </a>
                </li>
              </ul>
            </nav>

            <div className="menu-list" style={{ borderTop: '1px solid rgba(16, 185, 129, 0.1)', paddingTop: '20px' }}>
              <a href="#" className="menu-item">
                <Settings size={20} />
                <span>Cài đặt hệ thống</span>
              </a>
              <div className="menu-item" style={{ marginTop: '10px', gap: '8px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', 
                  backgroundColor: 'var(--accent-primary)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', color: '#000'
                }}>
                  <User size={16} />
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Nguyễn V. Quân</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Lãnh đạo xã</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
