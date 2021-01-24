```bash
docker pull nginx:alpine
docker run --rm nginx:alpine cat /etc/nginx/nginx.conf > nginx.conf
docker run --rm nginx:alpine cat /etc/nginx/conf.d/default.conf > default.conf
```