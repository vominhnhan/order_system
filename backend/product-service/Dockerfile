# Sử dụng image Node.js chính thức
FROM node:22.3.0

# Thiết lập thư mục làm việc trong container
WORKDIR /home/app

# Tạo thư mục "images" để lưu ảnh upload
RUN mkdir -p images

# Copy package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các gói npm
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

RUN npx prisma generate

# Expose cổng mà ứng dụng sử dụng
EXPOSE ${PORT}

# Lệnh khởi chạy ứng dụng
CMD ["npm", "run", "start"]
