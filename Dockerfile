FROM node:current-alpine as builder
WORKDIR /root
COPY ./ ./
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
        && apk update \
        && apk upgrade \
        && yarn config set registry https://registry.npm.taobao.org \
        && yarn \
        && yarn dev

FROM nginx:alpine
VOLUME ["/etc/localtime","/etc/localtime"]
COPY --from=builder /root/public/ /usr/share/nginx/html
