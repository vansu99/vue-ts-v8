# 构建阶段
FROM node:lts-alpine AS build-stage
WORKDIR /app

# 定义一个参数，用于设置环境变量
ARG API_DOMAIN

# 将参数值设置为环境变量，这样应用构建时可以使用它
ENV VITE_FASTAPI_DOMAIN="https://plankton-app-hfdpj.ondigitalocean.app/"

COPY package.json yarn.lock ./
COPY . .
RUN yarn install
RUN yarn build

# 运行阶段
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
