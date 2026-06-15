'use client';

import React, { useState } from 'react';
import { Award, Check, X, Search, Filter, AlertCircle } from 'lucide-react';

interface OcopProfile {
  id: number;
  product_name: string;
  farmer_name: string;
  district: string;
  category: string;
  status: 'submitted' | 'reviewing' | 'approved' | 'rejected';
  stars_awarded: number | null;
  created_at: string;
}

export default function OcopPage() {
  const [profiles, setProfiles] = useState<OcopProfile[]>([
    { id: 1, product_name: 'Cà phê Robusta Đặc sản Nam Yang', farmer_name: 'Hợp Tác Xã Đăk Đoa', district: 'Đăk Đoa', category: 'Thực phẩm', status: 'approved', stars_awarded: 4, created_at: '12/05/2026' },
    { id: 2, product_name: 'Mật ong hoa hoa dã quỳ Chư Sê', farmer_name: 'Hộ nông dân Lê Thị Bình', district: 'Chư Sê', category: 'Thảo dược', status: 'approved', stars_awarded: 5, created_at: '18/05/2026' },
    { id: 3, product_name: 'Mắc ca sấy nứt vỏ Kbang', farmer_name: 'Tổ hợp tác Kbang Maca', district: 'Kbang', category: 'Thực phẩm', status: 'submitted', stars_awarded: null, created_at: '10/06/2026' },
    { id: 4, product_name: 'Rượu cần Ama Yông Pleiku', farmer_name: 'Cơ sở sản xuất Ama Yông', district: 'Pleiku', category: 'Đồ uống', status: 'reviewing', stars_awarded: null, created_at: '14/06/2026' },
  ]);

  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [selectedProfile, setSelectedProfile] = useState<OcopProfile | null>(null);
  const [stars, setStars] = useState<number>(4);
  const [notes, setNotes] = useState<string>('');

  const handleApprove = (profile: OcopProfile) => {
    setSelectedProfile(profile);
    setStars(4);
    setNotes('Sản phẩm đạt đầy đủ tiêu chuẩn chất lượng sản xuất vệ sinh an toàn thực phẩm, bao bì thiết kế chuyên nghiệp, có truy xuất nguồn gốc rõ ràng.');
  };

  const submitApproval = () => {
    if (!selectedProfile) return;
    setProfiles(prev => prev.map(p => {
      if (p.id === selectedProfile.id) {
        return { ...p, status: 'approved', stars_awarded: stars };
      }
      return p;
    }));
    setSelectedProfile(null);
  };

  const handleReject = (id: number) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: 'rejected', stars_awarded: null };
      }
      return p;
    }));
  };

  const filteredProfiles = profiles.filter(p => 
    filterDistrict === 'all' ? true : p.district === filterDistrict
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Hồ Sơ OCOP & Đăng Ký Đánh Giá</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Duyệt hồ sơ đăng ký OCOP của hộ nông dân và hợp tác xã, đánh giá xếp hạng sao nông sản Gia Lai
          </p>
        </div>
      </header>

      {/* Filter bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm, chủ sở hữu..." 
            style={{ 
              backgroundColor: 'transparent', border: 'none', color: '#fff', 
              fontSize: '0.9rem', width: '100%', outline: 'none' 
            }} 
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Huyện:</span>
          </div>
          <select 
            value={filterDistrict} 
            onChange={(e) => setFilterDistrict(e.target.value)}
            style={{ 
              backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', 
              color: '#fff', padding: '6px 12px', borderRadius: '8px', outline: 'none' 
            }}
          >
            <option value="all">Tất cả huyện</option>
            <option value="Đăk Đoa">Đăk Đoa</option>
            <option value="Chư Sê">Chư Sê</option>
            <option value="Kbang">Kbang</option>
            <option value="Pleiku">Pleiku</option>
          </select>
        </div>
      </div>

      {/* Table List */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="custom-table" style={{ marginTop: 0 }}>
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Chủ sở hữu</th>
              <th>Huyện</th>
              <th>Danh mục</th>
              <th>Ngày đăng ký</th>
              <th>Xếp hạng sao</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.product_name}</td>
                <td>{p.farmer_name}</td>
                <td>{p.district}</td>
                <td style={{ color: 'var(--text-muted)' }}>{p.category}</td>
                <td>{p.created_at}</td>
                <td>
                  {p.stars_awarded ? (
                    <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      {Array.from({ length: p.stars_awarded }).map((_, i) => (
                        <Award key={i} size={14} fill="#fbbf24" />
                      ))}
                      <span style={{ fontSize: '0.8rem', marginLeft: '4px' }}>{p.stars_awarded} Sao</span>
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Chưa đánh giá</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${
                    p.status === 'approved' ? 'badge-success' : 
                    p.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                  }`}>
                    {p.status === 'approved' ? 'Đã duyệt' : 
                     p.status === 'rejected' ? 'Từ chối' : 
                     p.status === 'reviewing' ? 'Đang thẩm định' : 'Mới nộp'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {p.status !== 'approved' && p.status !== 'rejected' ? (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleApprove(p)}
                        style={{ 
                          backgroundColor: 'var(--accent-primary)', color: '#000', border: 'none',
                          padding: '6px 10px', borderRadius: '6px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600
                        }}
                      >
                        <Check size={14} /> Duyệt & Gắn sao
                      </button>
                      <button 
                        onClick={() => handleReject(p.id)}
                        style={{ 
                          backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)',
                          padding: '6px 10px', borderRadius: '6px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem'
                        }}
                      >
                        <X size={14} /> Từ chối
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Hoàn tất</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedProfile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '500px', padding: '32px', backgroundColor: 'var(--bg-secondary)' }}>
            <h3 style={{ marginBottom: '16px' }}>Thẩm Định Hồ Sơ OCOP</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
              Đang đánh giá sản phẩm: <strong>{selectedProfile.product_name}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Xếp hạng số sao OCOP:
                </label>
                <select 
                  value={stars}
                  onChange={(e) => setStars(parseInt(e.target.value))}
                  style={{
                    width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff'
                  }}
                >
                  <option value={3}>3 Sao</option>
                  <option value={4}>4 Sao (Khuyến nghị)</option>
                  <option value={5}>5 Sao (Xuất sắc)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Ý kiến thẩm định:
                </label>
                <textarea 
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff',
                    outline: 'none', resize: 'none', fontFamily: 'inherit', fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  onClick={() => setSelectedProfile(null)}
                  style={{ 
                    backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: '#fff',
                    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' 
                  }}
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={submitApproval}
                  style={{ 
                    backgroundColor: 'var(--accent-primary)', border: 'none', color: '#000',
                    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
                  }}
                >
                  Phê duyệt chính thức
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
