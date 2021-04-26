FROM node:15.0.1-alpine as builder
WORKDIR /root
COPY ./ ./
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
        && apk update \
        && apk upgrade \
        && apk add --no-cache yarn \
        && yarn install \
        && yarn dev

FROM nginx:alpine
COPY --from=builder /root/public/ /usr/share/nginx/html
