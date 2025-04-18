# 🧾 Phân hệ Quản lý Đơn Hàng của Thực Khách
Hệ thống quản lý nhà hàng sử dụng Node.js và Express.js, phục vụ cho nghiệp vụ gọi món, xử lý đơn hàng và truyền thông tin đến bếp qua RabbitMQ.

---

## 🚀 Công nghệ sử dụng

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [RabbitMQ](https://www.rabbitmq.com/) – để gửi đơn hàng đến bếp (chef-service)
- [JWT](https://jwt.io/) – xác thực và phân quyền
- [Docker](https://www.docker.com/) – deploy RabbitMQ và MySQL

---

## 📦 Cấu trúc dự án
![image](https://github.com/user-attachments/assets/35c37ce9-1153-4902-a432-09de645f1778)

## 🔧 Cài đặt & chạy local
### 1. Clone project:
```
git clone https://github.com/vominhnhan/order_system.git
cd order_system
```
### 2. Cài đặt dependencies và database cho từng service:
#### Di chuyển vào thư mục service cụ thể:
```
cd <service>
```
#### Cài đặt dependencies cho service:
```
npm install
```
#### Tạo file .env cho từng service:
```
PORT=your_port
DATABASE_URL="mysql://your_username:your_password@localhost:3306/your_db"
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
ACCESS_TOKEN_SECRET="your_access_token_secret"
ACCESS_TOKEN_EXPIRES_IN=1d
```
#### Cài đặt database:
```
npx prisma migrate dev --name init
npx prisma generate
```
### 3. Chạy dự án
#### Backend
```
npm run dev
```
#### Frontend
```
Mở file login.html -> Open with Live Server
```
