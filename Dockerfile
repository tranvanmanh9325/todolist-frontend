# ---- Build stage ----
FROM node:lts-alpine AS build

# Cập nhật Alpine để vá lỗ hổng bảo mật
RUN apk update && apk upgrade

WORKDIR /app

# Copy và cài dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy toàn bộ source code
COPY . .

# Build project
RUN npm run build


# ---- Serve stage ----
FROM nginx:mainline-alpine

# Cập nhật Alpine để vá lỗ hổng bảo mật
RUN apk update && apk upgrade

# Xóa config mặc định của nginx để tránh conflict
RUN rm /etc/nginx/conf.d/default.conf

# Copy build React sang nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy file cấu hình nginx tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mặc định Nginx sẽ chạy bằng root (không cần USER)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]