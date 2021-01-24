## Nginx 与反代

在很久以前，曾今尝试过将自己当时的小破站[所有的服务都使用 Docker 来部署](https://www.defectink.com/defect/docker-container-all.html)，在未来迁移也会更加方便。也就是那时，正真的用上了 Docker。

不过这次水的部分不同，没想到过直接把小破站迁移到了 Hexo。这次准备搭建一些其他的服务，而有些东西对于 SSL 的配置很是复杂，并且多个应用在一起端口也不方便分配。于是就想到了使用 Nginx 来做反代。

## Nginx 的安装与配置

### 修改配置文件

## 使用 certbot 获取证书

### 为 Nginx 配置 SSL

### 自动续期