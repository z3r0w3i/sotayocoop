-- Kích hoạt extension PostGIS để quản trị dữ liệu không gian
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Bảng User (Đồng bộ từ Keycloak hoặc lưu trữ nội bộ)
CREATE TABLE users (
    id VARCHAR(100) PRIMARY KEY, -- Keycloak User ID
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'farmer', -- farmer, htx, staff, admin, leader
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Hồ sơ Nông hộ
CREATE TABLE farmer_profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
    cccd VARCHAR(20) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    commune VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    province VARCHAR(100) DEFAULT 'Gia Lai',
    gps_home GEOMETRY(Point, 4326), -- Tọa độ GPS nhà ở
    production_scale TEXT, -- Mô tả quy mô sản xuất
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Thửa đất
CREATE TABLE lands (
    id SERIAL PRIMARY KEY,
    farmer_id INT REFERENCES farmer_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- Tên thửa đất (ví dụ: Rẫy Cà phê Đăk Đoa 1)
    area DECIMAL(10, 2) NOT NULL, -- Diện tích tính theo mét vuông hoặc ha
    land_type VARCHAR(100) NOT NULL, -- Đất đỏ bazan, đất cát, đất sét...
    boundary GEOMETRY(Polygon, 4326), -- Đa giác ranh giới thửa đất (PostGIS)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng Vụ mùa/Cây trồng/Vật nuôi
CREATE TABLE crops (
    id SERIAL PRIMARY KEY,
    land_id INT REFERENCES lands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- Tên cây trồng/vật nuôi (Cà phê Robusta, Tiêu, Sầu riêng, Heo, Bò)
    variety VARCHAR(100), -- Giống (Ví dụ: TR4, giống ghép...)
    area DECIMAL(10, 2), -- Diện tích canh tác cây này (ha)
    quantity INT, -- Số lượng gốc cây hoặc con vật nuôi
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active', -- active, harvested, destroyed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng Nhật ký điện tử canh tác
CREATE TABLE diaries (
    id SERIAL PRIMARY KEY,
    crop_id INT REFERENCES crops(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL, -- Gieo trồng, Bón phân, Phun thuốc, Tưới nước, Thu hoạch...
    activity_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    gps_location GEOMETRY(Point, 4326), -- Tọa độ GPS khi check-in làm việc
    media_urls TEXT[], -- Danh sách URL ảnh/video đính kèm lưu trên MinIO
    created_by VARCHAR(100) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Bảng Quản lý chi phí
CREATE TABLE costs (
    id SERIAL PRIMARY KEY,
    crop_id INT REFERENCES crops(id) ON DELETE CASCADE,
    cost_type VARCHAR(100) NOT NULL, -- Giống, Phân bón, Thuốc BVTV, Nhân công, Máy móc, Khác
    amount DECIMAL(15, 2) NOT NULL, -- Số tiền chi trả (VND)
    description TEXT,
    quantity DECIMAL(10, 2),
    unit VARCHAR(50),
    expense_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bảng Quản lý thu hoạch
CREATE TABLE harvests (
    id SERIAL PRIMARY KEY,
    crop_id INT REFERENCES crops(id) ON DELETE CASCADE,
    quantity DECIMAL(12, 2) NOT NULL, -- Sản lượng (tấn, tạ, kg)
    unit VARCHAR(50) NOT NULL DEFAULT 'kg',
    quality VARCHAR(100), -- Loại 1, Loại 2, Xuất khẩu...
    price_per_kg DECIMAL(12, 2) NOT NULL, -- Giá bán trên mỗi kg (VND)
    total_revenue DECIMAL(15, 2) GENERATED ALWAYS AS (quantity * price_per_kg) STORED,
    buyer VARCHAR(255), -- Đơn vị thu mua / thương lái
    harvest_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Bảng Truy xuất nguồn gốc (QR Code)
CREATE TABLE traceability (
    id SERIAL PRIMARY KEY,
    crop_id INT REFERENCES crops(id) ON DELETE CASCADE,
    qr_code_uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    brand_name VARCHAR(255) NOT NULL,
    certificates TEXT[], -- Đường dẫn PDF hoặc tên chứng nhận (OCOP, VietGAP, GlobalGAP)
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Bảng Giá nông sản (Cập nhật hàng ngày)
CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL, -- Cà phê Robusta, Hồ tiêu, Sầu riêng Ri6, Mắc ca
    price_date DATE NOT NULL DEFAULT CURRENT_DATE,
    price_min DECIMAL(10, 2) NOT NULL,
    price_max DECIMAL(10, 2) NOT NULL,
    source VARCHAR(255) DEFAULT 'Sở Công Thương Gia Lai',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_prices_crop_date ON prices(crop_name, price_date);

-- 10. Bảng Cảnh báo thời tiết hại nông nghiệp
CREATE TABLE weather_alerts (
    id SERIAL PRIMARY KEY,
    alert_type VARCHAR(100) NOT NULL, -- Mưa lớn, Hạn hán, Sương muối, Gió mạnh, Lũ quét
    description TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL, -- Info, Warning, Critical
    boundary GEOMETRY(Polygon, 4326), -- Khu vực chịu ảnh hưởng (Xã, Huyện...)
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Bảng Cảnh báo dịch bệnh
CREATE TABLE disease_alerts (
    id SERIAL PRIMARY KEY,
    target_type VARCHAR(100) NOT NULL, -- Cây trồng / Vật nuôi
    target_name VARCHAR(100) NOT NULL, -- Cà phê, Sầu riêng, Bò, Heo...
    disease_name VARCHAR(255) NOT NULL, -- Rỉ sắt, Sâu đục thân, Lở mồm long móng, Tả lợn châu Phi
    description TEXT NOT NULL,
    prevention_measures TEXT, -- Các biện pháp phòng trừ
    boundary GEOMETRY(Polygon, 4326), -- Khu vực bùng phát dịch bệnh
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Bảng Chợ Nông sản & OCOP
CREATE TABLE market_products (
    id SERIAL PRIMARY KEY,
    owner_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL, -- kg, hộp, chai, tấn
    quantity DECIMAL(10, 2) NOT NULL,
    is_ocop BOOLEAN DEFAULT FALSE,
    ocop_stars INT CHECK (ocop_stars BETWEEN 1 AND 5),
    media_urls TEXT[],
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, sold, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Hồ sơ Đăng ký và kết nối OCOP
CREATE TABLE ocop_profiles (
    id SERIAL PRIMARY KEY,
    owner_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    district VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Thực phẩm, Đồ uống, Thảo dược, Thủ công mỹ nghệ...
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, reviewing, approved, rejected
    stars_awarded INT,
    certificate_url TEXT,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Thư viện tri thức nông nghiệp
CREATE TABLE knowledge_docs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    pdf_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo các Index GIS và Tìm kiếm nhanh
CREATE INDEX idx_lands_boundary ON lands USING GIST(boundary);
CREATE INDEX idx_farmer_location ON farmer_profiles USING GIST(gps_home);
CREATE INDEX idx_diaries_location ON diaries USING GIST(gps_location);
CREATE INDEX idx_weather_boundary ON weather_alerts USING GIST(boundary);
CREATE INDEX idx_disease_boundary ON disease_alerts USING GIST(boundary);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_crops_status ON crops(status);
CREATE INDEX idx_market_ocop ON market_products(is_ocop);
