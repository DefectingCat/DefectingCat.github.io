## Nginx 与反代

在很久以前，曾今尝试过将自己当时的小破站[所有的服务都使用 Docker 来部署](https://www.defectink.com/defect/docker-container-all.html)，在未来迁移也会更加方便。也就是那时，正真的用上了 Docker。

不过这次水的部分不同，没想到过直接把小破站迁移到了 Hexo。这次准备搭建一些其他的服务，而有些东西对于 SSL 的配置很是复杂，并且多个应用在一起端口也不方便分配。于是就想到了使用 Nginx 来做反代。

## 使用 certbot 获取证书

certbot 可以使用 webroot 模式来验证域名，在启动时添加参数`--webroot`即可。

而 certbot 的 challenge 根目录则映射出来，交给解析了对应域名的 Nginx。同时证书目录也需要映射出来，再证书申请完成后也交给 Nginx。

```dockerfile
volumes:
  - ./certbot/conf:/etc/letsencrypt
  - ./certbot/www:/var/www/certbot
```

certbot 也可以同时为多个域名申请证书，只需要在后面继续添加`-d`参数即可。

certbot 默认是交互模式，由于需要在 Docker 中使用，可以使用`--non-interactive`来关闭交互模式。

```dockerfile
command: certonly --webroot -w /var/www/certbot -d git.defectink.com --non-interactive --agree-tos -m xfy@xfy.plus
```

## Nginx 的配置

安装已是不在话下的事情，主要还是优雅的获取配置文件。

```bash
docker run --rm nginx:alpine cat /etc/nginx/nginx.conf > nginx.conf
```

```bash
docker run --rm nginx:alpine cat /etc/nginx/conf.d/ > conf.d/
```

### 响应 challenge

在 certbot 映射出来对应的证书和 webroot 目录后，Nginx 也需要映射到自己的容器内：

```dockerfile
volumes:
  - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
  - ./nginx/conf.d/:/etc/nginx/conf.d:ro
  - ./certbot/conf:/etc/letsencrypt
  - ./certbot/www:/var/www/certbot
```

为了使用 certbot 的 webroot 模式，Nginx 需要在其默认的配置文件上添加对应 challenge 相应的配置。

这里在`conf.d`目录内新建了一个`gitea.conf`的配置文件，默认情况下`nginx.conf`会导入`conf.d`内的配置文件：`include /etc/nginx/conf.d/*.conf;`

```nginx
location /.well-known/acme-challenge/ {
    root /var/www/certbot;
}
```

现在的目录结构：

```
.
├── certbot
│   ├── conf
│   └── www
├── docker-compose.yml
├── gitea
│   ├── git
│   ├── gitea
│   └── ssh
├── nginx
│   ├── conf.d
│   │   ├── default.conf
│   │   └── gitea.conf
│   └── nginx.conf
├── vlmcsd
│   └── Dockerfile
└──docker-compose.yml
```

### 为 Nginx 配置 SSL

在配置 certbot 时就将其证书目录映射到宿主机了，同时也在 Nginx 中映射到容器内了，接下来要做的就是在配置文件中添加证书。

Nginx 需要再添加一个 server 字段，并使用 443 端口。证书在`ssl_certificate`填上对应映射的目录。

```nginx
server {
    listen 443 ssl http2;
    server_name git.defectink.com;

    ssl_certificate /etc/letsencrypt/live/git.defectink.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/git.defectink.com/privkey.pem;
}
```

同时也可以在 80 端口内添加一个 301 跳转到 443：

```nginx
location / {
    return 301 https://$host$request_uri;
}   
```

### 反代

```nginx
location / {
    set $upstream "site_upstream";

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-Port $server_port;
    proxy_set_header X-Real-Scheme $scheme;
    proxy_set_header X-NginX-Proxy true;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Ssl on;
    
    proxy_pass   http://gitea:3000;
}
```

### 自动续期

letsencrypt 获取免费的证书很是方便，但是必须要三个月续期一次。