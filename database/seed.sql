-- 1. Insert Users (Keycloak mock accounts)
INSERT INTO users (id, username, email, full_name, role) VALUES
('usr_01', 'farmer_an', 'an.nguyen@gmail.com', 'Nguyễn Văn An', 'farmer'),
('usr_02', 'farmer_binh', 'binh.le@gmail.com', 'Lê Thị Bình', 'farmer'),
('usr_03', 'htx_dakdoa', 'htx.dakdoa@gmail.com', 'Hợp Tác Xã Nông Nghiệp Đăk Đoa', 'htx'),
('usr_04', 'staff_nam', 'nam.tran@gialai.gov.vn', 'Trần Hoài Nam', 'staff'),
('usr_05', 'leader_quan', 'quan.nguyen@gialai.gov.vn', 'Nguyễn Văn Quân', 'leader');

-- 2. Insert Farmer Profiles
INSERT INTO farmer_profiles (user_id, cccd, phone, address, commune, district, gps_home, production_scale) VALUES
('usr_01', '064092000123', '0912345678', 'Thôn 3, Xã Nam Yang', 'Nam Yang', 'Đăk Đoa', ST_GeomFromText('POINT(108.1256 14.0125)', 4326), 'Canh tác 2.5 ha Cà phê xen canh Hồ tiêu'),
('usr_02', '064095000456', '0987654321', 'Thôn 4, Xã Dun', 'Xã Dun', 'Chư Sê', ST_GeomFromText('POINT(108.0125 13.6543)', 4326), 'Canh tác 1.8 ha Sầu riêng và Mắc ca');

-- 3. Insert Lands (Polygons in Gia Lai)
INSERT INTO lands (farmer_id, name, area, land_type, boundary) VALUES
(1, 'Thửa đất Cà phê Nam Yang', 15000.00, 'Đất đỏ Bazan', ST_GeomFromText('POLYGON((108.125 14.012, 108.127 14.012, 108.127 14.014, 108.125 14.014, 108.125 14.012))', 4326)),
(1, 'Thửa đất Hồ tiêu Đăk Đoa', 10000.00, 'Đất đỏ Bazan', ST_GeomFromText('POLYGON((108.128 14.011, 108.130 14.011, 108.130 14.013, 108.128 14.013, 108.128 14.011))', 4326)),
(2, 'Vườn Sầu riêng Chư Sê', 18000.00, 'Đất đỏ Bazan cổ', ST_GeomFromText('POLYGON((108.012 13.654, 108.014 13.654, 108.014 13.656, 108.012 13.656, 108.012 13.654))', 4326));

-- 4. Insert Crops
INSERT INTO crops (land_id, name, variety, area, quantity, start_date, status) VALUES
(1, 'Cà phê Robusta', 'TR4', 1.5, 1200, '2023-05-15', 'active'),
(2, 'Hồ tiêu', 'Lộc Ninh', 1.0, 800, '2022-06-20', 'active'),
(3, 'Sầu riêng', 'Ri6', 1.8, 400, '2021-04-10', 'active');

-- 5. Insert Diaries
INSERT INTO diaries (crop_id, activity_type, activity_date, notes, gps_location, media_urls, created_by) VALUES
(1, 'Bón phân', '2026-05-10 08:30:00+07', 'Bón phân NPK Đầu Trâu mùa mưa, liều lượng 0.5kg/gốc', ST_GeomFromText('POINT(108.1255 14.0123)', 4326), ARRAY['https://minio.gialai.gov.vn/sotayocoop/media/bon_phan_cf_1.jpg'], 'usr_01'),
(1, 'Tưới nước', '2026-05-12 07:00:00+07', 'Tưới đẫt phun mưa gốc ngày nắng nóng', ST_GeomFromText('POINT(108.1256 14.0124)', 4326), NULL, 'usr_01'),
(3, 'Phun thuốc', '2026-05-15 09:00:00+07', 'Phun thuốc phòng trừ nấm nứt thân xì mủ', ST_GeomFromText('POINT(108.0123 13.6545)', 4326), ARRAY['https://minio.gialai.gov.vn/sotayocoop/media/phun_thuoc_sr.jpg'], 'usr_02'),
(3, 'Thu hoạch', '2026-06-10 08:00:00+07', 'Thu hoạch sầu riêng đợt 1', ST_GeomFromText('POINT(108.0124 13.6544)', 4326), ARRAY['https://minio.gialai.gov.vn/sotayocoop/media/thu_hoach_sr.jpg'], 'usr_02');

-- 6. Insert Costs
INSERT INTO costs (crop_id, cost_type, amount, description, quantity, unit, expense_date) VALUES
(1, 'Phân bón', 5000000.00, 'Mua 5 bao phân NPK Đầu Trâu', 5.00, 'bao', '2026-05-08'),
(1, 'Nhân công', 2000000.00, 'Thuê nhân công bón phân', 4.00, 'công', '2026-05-10'),
(3, 'Thuốc BVTV', 3500000.00, 'Thuốc trị nấm Phytophthora', 10.00, 'chai', '2026-05-14'),
(3, 'Nhân công', 3000000.00, 'Thuê nhân công thu hoạch', 6.00, 'công', '2026-06-10');

-- 7. Insert Harvests
INSERT INTO harvests (crop_id, quantity, unit, quality, price_per_kg, buyer, harvest_date) VALUES
(3, 4500.00, 'kg', 'Xuất khẩu Loại A', 85000.00, 'Công ty XNK Trái cây Vina', '2026-06-10');

-- 8. Insert Traceability
INSERT INTO traceability (crop_id, brand_name, certificates, status) VALUES
(3, 'Sầu riêng Gia Lai Hữu Cơ', ARRAY['VietGAP', 'Mã vùng trồng xuất khẩu'], 'active');

-- 9. Insert Prices (Price trend Gia Lai)
INSERT INTO prices (crop_name, price_date, price_min, price_max, source) VALUES
('Cà phê Robusta', '2026-06-12', 120000.00, 122000.00, 'Sở Công Thương Gia Lai'),
('Cà phê Robusta', '2026-06-13', 121000.00, 123000.00, 'Sở Công Thương Gia Lai'),
('Cà phê Robusta', '2026-06-14', 122000.00, 124000.00, 'Sở Công Thương Gia Lai'),
('Cà phê Robusta', '2026-06-15', 123500.00, 125000.00, 'Sở Công Thương Gia Lai'),
('Hồ tiêu', '2026-06-15', 155000.00, 157000.00, 'Sở Nông nghiệp Gia Lai'),
('Sầu riêng Ri6', '2026-06-15', 75000.00, 88000.00, 'Hiệp hội Nông sản Đăk Đoa'),
('Mắc ca', '2026-06-15', 80000.00, 95000.00, 'Sở Công Thương Gia Lai');

-- 10. Insert Weather Alerts
INSERT INTO weather_alerts (alert_type, description, severity, boundary, start_date, end_date) VALUES
('Mưa lớn', 'Dự báo mưa lớn diện rộng tại các huyện phía đông Gia Lai nguy cơ lũ quét cục bộ', 'Warning', ST_GeomFromText('POLYGON((108.100 13.900, 108.400 13.900, 108.400 14.300, 108.100 14.300, 108.100 13.900))', 4326), '2026-06-15 12:00:00+07', '2026-06-17 12:00:00+07'),
('Gió mạnh', 'Gió lốc cục bộ nguy cơ gãy đổ cây sầu riêng tại Chư Sê', 'Critical', ST_GeomFromText('POLYGON((107.900 13.500, 108.200 13.500, 108.200 13.800, 107.900 13.800, 107.900 13.500))', 4326), '2026-06-15 14:00:00+07', '2026-06-15 22:00:00+07');

-- 11. Insert Disease Alerts
INSERT INTO disease_alerts (target_type, target_name, disease_name, description, prevention_measures, boundary) VALUES
('Cây trồng', 'Cà phê', 'Bệnh rỉ sắt', 'Ghi nhận bùng phát bệnh rỉ sắt tại khu vực Đăk Đoa do thời tiết chuyển mùa ẩm thấp', 'Cắt tỉa cành thông thoáng, phun thuốc gốc đồng phòng ngừa diện rộng', ST_GeomFromText('POLYGON((108.100 13.900, 108.300 13.900, 108.300 14.200, 108.100 14.200, 108.100 13.900))', 4326)),
('Cây trồng', 'Sầu riêng', 'Thối rễ xì mủ', 'Nấm Phytophthora gây hại sầu riêng lây lan tại vùng Chư Prông', 'Thoát nước tốt cho vườn, quét vôi hoặc bôi hoạt chất Metalaxyl trực tiếp lên vết nứt gốc', ST_GeomFromText('POLYGON((107.800 13.600, 108.000 13.600, 108.000 13.900, 107.800 13.900, 107.800 13.600))', 4326));

-- 12. Insert Market Products
INSERT INTO market_products (owner_id, title, description, price, unit, quantity, is_ocop, ocop_stars, media_urls, status) VALUES
('usr_01', 'Cà phê Robusta Đăk Đoa chất lượng cao', 'Cà phê sạch thu hái chín tay chín 95%, sấy nhà kính', 135000.00, 'kg', 500.00, true, 4, ARRAY['https://minio.gialai.gov.vn/sotayocoop/media/market_coffee.jpg'], 'approved'),
('usr_02', 'Sầu riêng Ri6 Chư Sê chuẩn VietGAP', 'Sầu riêng chín cây tự nhiên, không nhúng thuốc, quả từ 2.5-4kg cơm vàng hạt lép', 90000.00, 'kg', 2000.00, false, NULL, ARRAY['https://minio.gialai.gov.vn/sotayocoop/media/market_durian.jpg'], 'approved');

-- 13. Insert OCOP Profiles
INSERT INTO ocop_profiles (owner_id, product_name, description, district, category, status, stars_awarded, certificate_url) VALUES
('usr_01', 'Cà phê Robusta Đặc sản Nam Yang', 'Cà phê nhân chế biến ướt chất lượng cao huyện Đăk Đoa', 'Đăk Đoa', 'Thực phẩm', 'approved', 4, 'https://minio.gialai.gov.vn/sotayocoop/ocop/cert_cf_nam_yang.pdf'),
('usr_03', 'Mật ong hoa hoa dã quỳ Chư Sê', 'Mật ong rừng tự nhiên thu hoạch vụ đông xuân', 'Chư Sê', 'Thực phẩm', 'approved', 5, 'https://minio.gialai.gov.vn/sotayocoop/ocop/cert_mat_ong_da_quy.pdf');

-- 14. Insert Knowledge Docs
INSERT INTO knowledge_docs (title, crop_type, content, pdf_url, video_url) VALUES
('Kỹ thuật trồng và chăm sóc Cà phê Robusta đạt chuẩn xuất khẩu', 'Cà phê', 'Tài liệu hướng dẫn chi tiết cách chọn giống, bón phân hợp lý theo mùa mưa nắng, cắt tỉa cành tạo tán hiệu quả và thu hoạch quả chín.', 'https://minio.gialai.gov.vn/sotayocoop/docs/ky_thuat_ca_phe.pdf', 'https://youtube.com/watch?v=mock_video_cf'),
('Phòng trừ bệnh xì mủ thối rễ trên cây Sầu riêng vào đầu mùa mưa', 'Sầu riêng', 'Phân tích nguyên nhân nấm bệnh Phytophthora, các dấu hiệu nhận biết sớm trên thân lá rễ và quy trình xử lý sinh học/hóa học kết hợp.', 'https://minio.gialai.gov.vn/sotayocoop/docs/phong_benh_sau_rieng.pdf', 'https://youtube.com/watch?v=mock_video_sr');
