FROM alpine:latest as builder
WORKDIR /root
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
        && apk update \
        && apk upgrade \
        && apk add --no-cache git make build-base \
        && git clone --branch master --single-branch https://gitee.com/mirrors/vlmcsd.git \
        && cd vlmcsd/  \
        && make

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /root/vlmcsd/bin/vlmcsd /usr/bin/vlmcsd
EXPOSE 1688/tcp
CMD [ "/usr/bin/vlmcsd", "-D", "-d" ]