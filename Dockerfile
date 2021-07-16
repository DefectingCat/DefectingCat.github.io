FROM node:current-alpine as builder
WORKDIR /root
COPY ./ ./
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
        && apk update \
        && apk upgrade \
        && npm install \
        && npm run dev

FROM nginx:alpine
COPY --from=builder /root/public/ /usr/share/nginx/html
