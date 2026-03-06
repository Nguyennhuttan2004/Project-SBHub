# Hệ Thống Đặt Sân Cầu Lông (SmashBook)

Một ứng dụng web full-stack được xây dựng với MERN stack (MongoDB, Express, React, Node.js) cho phép người dùng dễ dàng tìm kiếm, đặt lịch và quản lý sân cầu lông.

## Các Tính Năng Chính
- **Xác thực người dùng**: Đăng nhập và Đăng ký bảo mật mạnh mẽ sử dụng JWT và bcrypt.
- **Tìm kiếm sân**: Xem danh sách các sân và trạng thái trống với giao diện tương thích (responsive).
- **Hệ thống đặt lịch**: Lịch đặt sân động, trực quan hỗ trợ chọn các khung giờ.
- **Trang quản trị (Admin Dashboard)**: Quản lý danh sách sân và xem tổng quan các lượt đặt.
- **Phân quyền truy cập**: Phân chia giao diện riêng biệt theo vai trò cho Người dùng (User) và Quản trị viên (Admin).

## Công Nghệ Sử Dụng
### Frontend
- React 18 + Vite
- TailwindCSS v4
- React Router DOM v6
- Axios

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)

## Hướng Dẫn Cài Đặt

### Yêu Cầu Cần Thiết
- Node.js (phiên bản v18 trở lên)
- Chuỗi kết nối MongoDB (Local hoặc Atlas)

### Các Bước Cài Đặt
1. Clone (tải) repository về máy.
2. Cài đặt các thư viện cho Backend:
   ```bash
   cd server
   npm install
   ```
3. Cài đặt các thư viện cho Frontend:
   ```bash
   cd client
   npm install
   ```
4. Cập nhật cấu hình môi trường: Tạo và cấu hình tệp `server/.env` với biến `MONGO_URI` và `JWT_SECRET` của bạn.

### Chạy Dự Án (Local)
Để chạy dự án, hãy mở hai cửa sổ terminal riêng biệt.

**Terminal 1 (Server Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Client Frontend):**
```bash
cd client
npm run dev
```

Truy cập `http://localhost:5173` trên trình duyệt của bạn để sử dụng ứng dụng.
