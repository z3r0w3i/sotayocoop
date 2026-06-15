# HƯỚNG DẪN VẬN HÀNH & SỬ DỤNG HỆ THỐNG "SỔ TAY SỐ NÔNG DÂN"

Tài liệu này hướng dẫn chi tiết các tác vụ nghiệp vụ hàng ngày cho ba nhóm đối tượng sử dụng chính: **Hộ nông dân**, **Quản trị viên Hợp tác xã (HTX)**, và **Lãnh đạo xã/phường**.

---

## 1. Hướng dẫn dành cho Nông dân (Mobile App Flutter)

Ứng dụng di động giúp nông dân số hóa nhật ký sản xuất ngay tại đồng ruộng, làm việc ngoại tuyến (Offline) khi mất mạng và tư vấn dịch bệnh bằng AI.

### 1.1 Ghi Nhật Ký Điện Tử (Module 3)
1. Mở ứng dụng, chọn **Nhật ký điện tử**.
2. Chọn loại hoạt động mong muốn: `Bón phân`, `Tưới nước`, `Phun thuốc`, hoặc `Thu hoạch`.
3. Nhập ghi chú chi tiết (ví dụ: bón 500g phân NPK đầu trâu cho mỗi gốc).
4. Nhấp vào biểu tượng **Định vị GPS** để ghim tọa độ PostGIS hiện tại của gốc cây trồng.
5. Nhấp vào **Ảnh/Video** để chụp ảnh lá, thân hoặc hiện trạng vườn.
6. Nhấp **Lưu ghi nhận**.
   * *Lưu ý*: Nếu điện thoại không có sóng 3G/4G, ứng dụng sẽ hiện thanh thông báo màu vàng `Đang ngoại tuyến`. Nhật ký sẽ được lưu tạm cục bộ trong bộ nhớ SQLite/Hive và tự động đẩy lên hệ thống khi điện thoại có kết nối Internet trở lại.

### 1.2 Vẽ thửa đất canh tác (Module 2)
1. Truy cập **Vẽ thửa đất GIS**.
2. Đi bộ xung quanh ranh giới rẫy của mình và nhấn **Thêm điểm tọa độ** tại mỗi góc ranh giới.
3. Nhấn **Hoàn thành đa giác** để tạo ranh giới bản đồ số PostGIS. Hệ thống sẽ tự động tính toán diện tích đất (ha) và lưu trữ.

### 1.3 Sử dụng Trợ lý AI Nông nghiệp (Module 11)
1. Chọn **AI Tư vấn dịch bệnh**.
2. Gửi câu hỏi bằng giọng nói hoặc nhập văn bản gửi câu hỏi cho AI (Ví dụ: *"Cà phê bị vàng lá mùa mưa bón phân gì?"*).
3. Đính kèm ảnh lá cây bị sâu bệnh để AI chẩn đoán tên bệnh, mức độ nguy hiểm và đưa ra giải pháp thuốc bảo vệ thực vật phù hợp.

---

## 2. Hướng dẫn dành cho Hợp tác xã & Doanh nghiệp (Web Portal / Mobile)

HTX đóng vai trò theo dõi chất lượng, sản lượng thành viên và liên kết tiêu thụ sản phẩm OCOP.

### 2.1 Đăng ký sản phẩm OCOP (Module 13)
1. Đăng nhập cổng thông tin, chọn **Hồ sơ OCOP**.
2. Nhấn **Đăng ký sản phẩm OCOP mới**.
3. Điền thông tin: Tên sản phẩm nông sản, mô tả quy trình chế biến, đính kèm chứng nhận chất lượng (VietGAP, GlobalGAP) và chọn huyện.
4. Gửi hồ sơ để chờ cán bộ nông nghiệp và UBND xã thẩm định đánh giá số sao.

### 2.2 Đăng bán nông sản trên Chợ số (Module 10)
1. Chọn menu **Chợ nông sản**.
2. Nhấn **Đăng sản phẩm**. Điền thông tin giá cả, sản lượng sẵn có, hình ảnh và gắn nhãn sản phẩm OCOP (nếu có).
3. Quản lý trạng thái đơn đặt hàng từ các doanh nghiệp thu mua lớn.

---

## 3. Hướng dẫn dành cho Lãnh đạo và Cán bộ Nông nghiệp (Web Dashboard)

Cổng Dashboard giúp lãnh đạo theo dõi số liệu vĩ mô và định hướng sản xuất tại địa phương.

### 3.1 Theo dõi Dashboard thống kê tổng quan
1. Truy cập trang chủ **Tổng quan**.
2. Theo dõi các chỉ số quan trọng cập nhật thời gian thực:
   - Tổng số hộ dân đã chuyển đổi số.
   - Diện tích đất trồng đã số hóa ranh giới bản đồ.
   - Biểu đồ sản lượng thu hoạch theo mùa vụ đối với Cà phê, Tiêu, Sầu riêng.
   - Bảng thống kê chi phí đầu vào và doanh thu để ước tính tỷ suất lợi nhuận nông nghiệp địa bàn.

### 3.2 Quản lý bản đồ số vùng trồng (GIS)
1. Truy cập trang **Bản đồ số vùng trồng**.
2. Chọn hiển thị các lớp dữ liệu: Ranh giới thửa đất, vị trí định vị nhà nông hộ, hoặc vị trí các trạm HTX.
3. Click vào bất kỳ đa giác nào trên bản đồ để xem chi tiết rẫy đó thuộc về hộ nào, trồng cây giống gì, và lịch sử nhật ký phun thuốc gần nhất của thửa đất đó.

### 3.3 Thẩm định xếp hạng sao OCOP
1. Truy cập trang **Hồ sơ OCOP**.
2. Xem các hồ sơ đăng ký OCOP mới của bà con nông dân.
3. Nhấp **Duyệt & Gắn sao**. Chọn đánh giá số sao (3 sao, 4 sao hoặc 5 sao), ghi ý kiến thẩm định và phê duyệt hồ sơ để đồng bộ xếp hạng sao ra thị trường.
