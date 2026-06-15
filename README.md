# SỔ TAY SỐ NÔNG DÂN

Dự án **Sổ Tay Số Nông Dân** là giải pháp chuyển đổi số toàn diện trong nông nghiệp, giúp số hóa nhật ký canh tác của hộ nông dân, vẽ thửa đất bản đồ số GIS (PostGIS), kết nối chợ nông sản, truy xuất nguồn gốc qua mã QR, quản lý hồ sơ OCOP và tích hợp trợ lý ảo AI hỗ trợ tư vấn dịch bệnh.

---

## 📂 Cấu trúc mã nguồn dự án

Thư mục chính của dự án bao gồm:
*   [backend](./backend): API Core viết bằng **NestJS (Node.js)** kết nối cơ sở dữ liệu PostgreSQL/PostGIS và tích hợp trợ lý AI (Gemini / Ollama).
*   [web-dashboard](./web-dashboard): Giao diện quản trị, xem bản đồ số, duyệt hồ sơ OCOP bằng **Next.js**.
*   [mobile-app](./mobile-app): Ứng dụng di động chạy trên Android/iOS dành cho nông dân được phát triển bằng **Flutter**.
*   [database](./database): Chứa file định nghĩa cấu trúc cơ sở dữ liệu (`schema.sql`) và dữ liệu mẫu (`seed.sql`).
*   [devops](./devops): Cấu hình chạy Docker Compose cục bộ và tài nguyên deploy Kubernetes (Manifests & Helm Chart).
*   [docs](./docs): Thư mục lưu trữ toàn bộ tài liệu hướng dẫn vận hành, triển khai dự án.

---

## 📖 Hướng dẫn chi tiết & Tài liệu kỹ thuật

Dưới đây là các tài liệu hướng dẫn kỹ thuật chi tiết dành cho nhà phát triển và vận hành hệ thống:

1.  **[Tài liệu Triển khai Hệ thống](./docs/TAI_LIEU_TRIEN_KHAI.md)**:
    *   Yêu cầu hệ thống tối thiểu.
    *   Hướng dẫn chạy thử nghiệm local bằng **Docker Compose**.
    *   Quy trình cài đặt lên môi trường Kubernetes bằng tệp Manifest hoặc **Helm Chart**.
    *   Hướng dẫn build bộ cài đặt ứng dụng Flutter Mobile.

2.  **[Hướng dẫn Vận hành & Sử dụng](./docs/TAI_LIEU_VAN_HANH.md)**:
    *   Cẩm nang dành cho nông dân: ghi nhật ký, vẽ thửa đất, sử dụng trợ lý AI nông nghiệp.
    *   Cẩm nang dành cho HTX: quản lý sản phẩm OCOP, đăng tin chợ nông sản.
    *   Cẩm nang dành cho Lãnh đạo/Cán bộ nông nghiệp: quản lý bản đồ GIS và phê duyệt OCOP.

3.  **[Hướng dẫn Cấu hình & Vận hành CI/CD Pipeline](./docs/HUONG_DAN_CICD.md)**:
    *   Tìm hiểu kiến trúc pipeline 3 stages: Test -> Build -> Deploy.
    *   Cách cấu hình các biến môi trường bí mật (`kubeconfig`, `PROD_DB_PASSWORD`) trên GitLab.
    *   Cách theo dõi log build và khắc phục sự cố / rollback phiên bản.
