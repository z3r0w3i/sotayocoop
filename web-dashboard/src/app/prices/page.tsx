'use client';

import React, { useState } from 'react';
import { TrendingUp, Plus, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

interface PriceItem {
  crop_name: string;
  price_min: number;
  price_max: number;
  change: string; // up, down, unchanged
  percent: string;
  source: string;
}

export default function PricesPage() {
  const [prices, setPrices] = useState<PriceItem[]>([
    { crop_name: 'Cà phê Robusta', price_min: 123500, price_max: 125000, change: 'up', percent: '+1.2%', source: 'Sở Công Thương Gia Lai' },
    { crop_name: 'Hồ tiêu', price_min: 155000, price_max: 157000, change: 'up', percent: '+0.8%', source: 'Sở Nông nghiệp Gia Lai' },
    { crop_name: 'Sầu riêng Ri6', price_min: 75000, price_max: 88000, change: 'down', percent: '-2.4%', source: 'Hiệp hội Nông sản Đăk Đoa' },
    { crop_name: 'Mắc ca', price_min: 80000, price_max: 95000, change: 'unchanged', percent: '0%', source: 'Sở Công Thương Gia Lai' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [cropName, setCropName] = useState('Cà phê Robusta');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleUpdatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!minPrice || !maxPrice) return;

    setPrices(prev => prev.map(p => {
      if (p.crop_name === cropName) {
        return {
          ...p,
          price_min: parseFloat(minPrice),
          price_max: parseFloat(maxPrice),
          change: parseFloat(minPrice) > p.price_min ? 'up' : 'down',
          percent: (((parseFloat(minPrice) - p.price_min) / p.price_min) * 100).toFixed(1) + '%',
        };
      }
      return p;
    }));

    setMinPrice('');
    setMaxPrice('');
    setShowForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Bảng Giá Nông Sản Hôm Nay</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Giám sát biến động giá cả cà phê, hồ tiêu, sầu riêng, mắc ca trên địa bàn tỉnh Gia Lai
          </p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: 'var(--accent-primary)', color: '#000', border: 'none',
            padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
          }}
        >
          <Plus size={16} /> Cập nhật giá mới
        </button>
      </header>

      {/* Grid Prices cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {prices.map((p, i) => (
          <div key={i} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1.1rem' }}>{p.crop_name}</h4>
              <div style={{ 
                padding: '6px', borderRadius: '50%', 
                backgroundColor: p.change === 'up' ? 'rgba(16,185,129,0.1)' : p.change === 'down' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                color: p.change === 'up' ? '#10b981' : p.change === 'down' ? '#f87171' : '#9ca3af'
              }}>
                {p.change === 'up' ? <ArrowUpRight size={18} /> : p.change === 'down' ? <ArrowDownRight size={18} /> : <RefreshCw size={18} />}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mức giá giao dịch:</p>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                {(p.price_min / 1000).toFixed(0)}k - {(p.price_max / 1000).toFixed(0)}k <span style={{ fontSize: '1rem' }}>đ/kg</span>
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-muted)' }}>
                <span>Biến động: <strong style={{ color: p.change === 'up' ? '#34d399' : p.change === 'down' ? '#f87171' : '#9ca3af' }}>{p.percent}</strong></span>
                <span>Nguồn: {p.source}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* SVG Price Chart */}
      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '24px' }}>Biểu Đồ Xu Hướng Giá Cà Phê Robusta (30 ngày gần nhất)</h3>
          <div style={{ height: '260px', width: '100%', position: 'relative' }}>
            {/* Visual SVG Trend line */}
            <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Grid lines */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(16,185,129,0.05)" strokeDasharray="4" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(16,185,129,0.05)" strokeDasharray="4" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(16,185,129,0.05)" strokeDasharray="4" />
              
              {/* Area under curve */}
              <path 
                d="M0 160 L100 150 L200 130 L300 140 L400 90 L500 75 L600 40 L600 200 L0 200 Z" 
                fill="url(#grad)" 
                opacity="0.1" 
              />
              
              {/* Trend Line */}
              <path 
                d="M0 160 Q 50 155, 100 150 T 200 130 T 300 140 T 400 90 T 500 75 T 600 40" 
                fill="none" 
                stroke="var(--accent-primary)" 
                strokeWidth="3" 
                strokeLinecap="round"
              />

              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-primary)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* Data points */}
              <circle cx="200" cy="130" r="5" fill="#000" stroke="var(--accent-primary)" strokeWidth="2" />
              <circle cx="400" cy="90" r="5" fill="#000" stroke="var(--accent-primary)" strokeWidth="2" />
              <circle cx="600" cy="40" r="6" fill="var(--accent-primary)" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>15/05</span>
              <span>25/05</span>
              <span>04/06</span>
              <span>15/06 (Hôm nay)</span>
            </div>
          </div>
        </div>

        {/* Update Price Form */}
        {showForm ? (
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '16px' }}>Cập Nhật Giá</h3>
            <form onSubmit={handleUpdatePrice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Nông sản cần cập nhật:
                </label>
                <select 
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  style={{
                    width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff'
                  }}
                >
                  <option value="Cà phê Robusta">Cà phê Robusta</option>
                  <option value="Hồ tiêu">Hồ tiêu</option>
                  <option value="Sầu riêng Ri6">Sầu riêng Ri6</option>
                  <option value="Mắc ca">Mắc ca</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Giá sàn giao dịch (đ/kg):
                </label>
                <input 
                  type="number"
                  placeholder="Ví dụ: 124000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{
                    width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Giá trần giao dịch (đ/kg):
                </label>
                <input 
                  type="number"
                  placeholder="Ví dụ: 126000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{
                    width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ 
                    backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: '#fff',
                    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' 
                  }}
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  style={{ 
                    backgroundColor: 'var(--accent-primary)', border: 'none', color: '#000',
                    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
                  }}
                >
                  Lưu cập nhật
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Bản Tin Nhận Định Thị Trường</h3>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
              <p style={{ marginBottom: '12px' }}>
                - <strong>Giá Cà phê:</strong> Robusta liên tục lập đỉnh mới do nguồn cung toàn cầu khan hiếm. Các vùng trồng Đăk Đoa, Chư Prông đang tăng cường xuất bán hàng trữ kho.
              </p>
              <p style={{ marginBottom: '12px' }}>
                - <strong>Sầu riêng:</strong> Giá có xu hướng giảm nhẹ do đang bước vào chính vụ thu hoạch rộ tại các tỉnh Tây Nguyên.
              </p>
              <p>
                - <strong>Hồ tiêu:</strong> Giữ vững sắc xanh tăng nhẹ nhờ nhu cầu từ thị trường Trung Quốc và Mỹ cải thiện rõ rệt.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
