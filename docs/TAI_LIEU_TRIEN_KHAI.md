# TÀI LIỆU TRIỂN KHAI HỆ THỐNG "SỔ TAY SỐ NÔNG DÂN"

Tài liệu này hướng dẫn cách cài đặt, cấu hình và triển khai hệ thống Sổ Tay Số Nông Dân trên môi trường phát triển cục bộ (Local Development) và môi trường sản xuất (Production K8s).

---

## 1. Yêu cầu hệ thống tối thiểu

- **Môi trường cục bộ**:
  - Docker & Docker Compose v2.0+
  - Node.js v20.x
  - Flutter SDK 3.x
- **Môi trường Production (Kubernetes)**:
  - Cụm Kubernetes cluster v1.25+
  - Helm v3.x
  - Nginx Ingress Controller

---

## 2. Triển khai cục bộ bằng Docker Compose

Được khuyến nghị cho lập trình viên để chạy thử nghiệm đầy đủ các dịch vụ mà không cần cài đặt lẻ tẻ.

### Các bước thực hiện:

1. **Clone mã nguồn và truy cập thư mục DevOps**:
   ```bash
   cd sotayocoop/devops
   ```

2. **Cấu hình biến môi trường**:
   Tạo file `.env` nằm cùng thư mục với `docker-compose.yml` và nhập khóa API của Gemini:
   ```env
   GEMINI_API_KEY=
   ```

3. **Khởi chạy container**:
   ```bash
   docker compose up -d
   ```
   Lệnh này sẽ khởi động 6 container:
   - **Database (5432)**: Tự động chạy file `schema.sql` và nạp dữ liệu mẫu `seed.sql`.
   - **Keycloak (8080)**: Cổng đăng nhập & quản lý phân quyền.
   - **MinIO (9000 & 9001)**: Lưu trữ ảnh chụp nhật ký của nông dân.
   - **Ollama (11434)**: Mô hình AI cục bộ dự phòng.
   - **Backend NestJS (3000)**: API lõi phục vụ Web & Mobile.
   - **Web Dashboard (80)**: Cổng thông tin cho lãnh đạo và HTX.

4. **Kiểm tra trạng thái**:
   ```bash
   docker compose ps
   ```

---

## 3. Triển khai lên cụm Kubernetes (Production)

Hệ thống hỗ trợ deploy lên K8s bằng các tệp manifest tĩnh hoặc Helm Chart tùy thuộc vào quy trình quản trị hạ tầng.

### Lựa chọn A: Triển khai bằng manifest tĩnh (`kubectl`)

1. **Truy cập thư mục k8s**:
   ```bash
   cd devops/k8s
   ```

2. **Khởi tạo Namespace**:
   ```bash
   kubectl apply -f namespace.yaml
   ```

3. **Tạo Secrets chứa khóa API**:
   ```bash
   kubectl create secret generic ai-secrets \
     --from-literal=gemini-api-key="KHOA_API_GEMINI" \
     -n sotayocoop
   ```

4. **Cài đặt Database & PostGIS**:
   ```bash
   kubectl apply -f postgres-postgis.yaml
   ```

5. **Cài đặt Backend & Web Dashboard**:
   ```bash
   kubectl apply -f backend.yaml
   kubectl apply -f frontend.yaml
   ```

6. **Cấu hình định tuyến Ingress (Nginx)**:
   ```bash
   kubectl apply -f ingress.yaml
   ```

### Lựa chọn B: Triển khai tự động bằng Helm Chart (Khuyến nghị cho CI/CD)

1. **Truy cập thư mục Helm**:
   ```bash
   cd devops/helm
   ```

2. **Cài đặt / Cập nhật ứng dụng**:
   ```bash
   helm upgrade --install sotayocoop ./sotayocoop \
     --namespace sotayocoop \
     --create-namespace \
     --set postgresql.password="MatKhauDatabase" \
     --set ingress.host="example.com"
   ```

> [!TIP]
> Chi tiết cách thiết lập, các biến môi trường cần cấu hình và quy trình vận hành pipeline tự động qua GitLab CI/CD được trình bày tại [HUONG_DAN_CICD.md](./HUONG_DAN_CICD.md).

---

## 4. Biên dịch và cấu hình Flutter Mobile App

Ứng dụng Flutter cần kết nối tới IP/Domain của Backend API.

1. **Cấu hình Endpoint**:
   Mở file `mobile-app/lib/services/api_service.dart` và chỉnh sửa biến `baseUrl` trỏ đến địa chỉ Backend thật:
   ```dart
   static const String baseUrl = 'https://example.com/api';
   ```

2. **Chạy ứng dụng chế độ Debug**:
   ```bash
   cd mobile-app
   flutter pub get
   flutter run
   ```

3. **Biên dịch bộ cài đặt Android (APK)**:
   ```bash
   flutter build apk --release
   ```
   Tệp APK đầu ra sẽ nằm tại `build/app/outputs/flutter-apk/app-release.apk`.
