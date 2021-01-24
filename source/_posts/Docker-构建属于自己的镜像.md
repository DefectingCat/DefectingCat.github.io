---
title: Docker-构建属于自己的镜像
date: 2019-11-29 09:30:33
tags: Linux
categories: 实践
url: docker-build-own-image
index_img: /images/Docker-构建属于自己的镜像/logo.webp
---

以前一直在使用别人构建好的镜像来使用Docker容器，在一次想搭建一个完整的Web环境时，发现使用过多容器非常难以管理。并且容器之间的交互通信变的困难。当然，也可以使用Docker Compose来捆绑多个镜像运行；不过对于运行服务较少的来说，使用Dockerfile来构建成一个镜像也是件好事。

## 需求

首先，在构建一个镜像之前，需要先明白这个镜像将会包含哪些东西，运行哪些服务。目前主要是想在当前机器上跑一个hexo的blog。当然可以部署在Github，以前还写过一篇关于部署在Github的[水文](https://www.defectink.com/defect/set-up-the-hexo-blog.html)。不过现在的想法是Github放一份，在本地服务器上也跑一个Server。

当然跑一个hexo是一件很简单的事情，使用Docker来部署也是为了想体验一下写`Dockerfile`。目前有两个思路：

1. 把node.js和hexo都部署在当前的宿主机，用Docker的Web服务器来跑宿主机生成的静态文件。

   > 但是这样的话就不需要用到Dockerfile了，直接pull一个http服务的镜像就好了。

2. 只在宿主机上使用Git来和Github同步文件，每次的生成和运行Web服务都放在Docker容器里。

   > 目前打算尝试的一种方式，可以在每次写完文章后使用Docker构建，并且也可以尝试Dockerfile了。

具体需要什么使用软件，完全看自己的需求，需要用到什么，就安装什么。就像在当前的宿主机上安装软件一样。只不过是使用Dockerfile来构建时安装的而已。

## 构建自己的镜像

好在还可以使用Dockerfile来基于其他的镜像来构建属于自己的镜像。可以在其他的系统基础镜像上来在构建时就安装自己需要的软件服务等，这样就可以构建一个自己需要的镜像了。

### 使用基础镜像

构建时使用的第一个命令是`FROM`命令。它会指定一个用于构建的基础镜像。这样就可以在基础镜像中使用自己喜欢的发行版，也解决了继承其他 Docker 镜像的途径 。

创建一个目录，或者`clone`一个hexo博客等，在目录内编写一个` Dockerfile `。

```dockerfile
#test
  
FROM alpine:latest
MAINTAINER Defectink <i@defect.ink>
```

这里选择的是alpine系统作为基础镜像，主要原因是alpine是个超级轻量的系统，对于最为基础镜像可以有效的减少构建后镜像的大小。

除此之外，还有个`MAINTAINER`命令，它是用来著名当前Dockerfile的作者的。Docker支持`#`作为注释，使用起来很方便。

### 第一次的构建

编写了一个最基本的` Dockerfile `之后，就是运行第一次的构建测试了。使用`Docker`加上`build`来构建指定的` Dockerfile `为镜像。添加`-t`参数来为构建后的镜像指定一个tag标签，也就是之后的镜像(REPOSITORY)名。最后命令指定的目录是包含刚刚写好的` Dockerfile `文件的目录，被称作为“构建目录”。

当前系统下没有基础镜像alpine的话，在第一次运行时docker也会进行下载。

```bash
# docker build -t blog /data/github/DefectingCat.github.io/                                          
Sending build context to Docker daemon     64kB
Step 1/2 : FROM alpine:latest
latest: Pulling from library/alpine
89d9c30c1d48: Pull complete 
Digest: sha256:c19173c5ada610a5989151111163d28a67368362762534d8a8121ce95cf2bd5a
Status: Downloaded newer image for alpine:latest
 ---> 965ea09ff2eb
Step 2/2 : MAINTAINER Defectink <i@defect.ink>
 ---> Running in d572ac48c8f8
Removing intermediate container d572ac48c8f8
 ---> b8296646acaa
Successfully built b8296646acaa
Successfully tagged blog:latest
```

第一次的镜像构建已经完成了，虽然什么都没有进行定制，但已经迈出了第一步。

### 安装软件

迈出第一步之后，就可以开始考虑定制属于自己的镜像了。使用`docker images`可以查看当前系统下的docker镜像。也能看到刚刚所构建的第一个镜像。

```bash
# docker images                                                                                      
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
blog                latest              b8296646acaa        19 minutes ago      5.55MB
alpine              latest              965ea09ff2eb        5 weeks ago         5.55MB
```

既然是定制属于自己的镜像，那么肯定是需要安装所需求的软件的。这里我想构建一个运行hexo的镜像，所以至少需要3款软件：

* apache
* node.js
* hexo

使用`RUN`命令来在基础镜像上执行命令，像是安装软件等操作。由于alpine默认时区不是国内，还可以顺便修改下时区。可以使用`RUN`来一次安装完所有需要的软件，不需要分开执行。

使用alpine的另个原因就是在它本身体积小的情况下，它安装软件还可以使用`--no-cache`来减少缓存。

在容器内使用npm来安装hexo时会出现一个`uid:0`的问题，npm会有生命周期，某个包会有生命周期来执行一些东西，安全起见会自动降级导致没有权限执行一些操作，通过``--unsafe-perm`参数来解锁该限制。

```dockerfile
#install
RUN apk update \
        && apk upgrade \
        && apk add --no-cache \
        apache2 \
        nodejs \
        npm \
        tzdata \
        && cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
        && rm -rf /var/cache/apk/* \
        && mkdir -p /data/DefectingCat.github.io \
        && npm config set unsafe-perm true \
        && npm install -g hexo
```

因为是基于一个操作系统上构建的镜像，所以在构建完成后可以使用Docker来运行一个“伪终端”，让我们可以直接在终端内进行一些修改和查看。值得注意的是，在“伪终端”里进行的操作只是在当前容器内的，不会被写入镜像。当前被关闭后，任何操作将不复存在。

在构建完后可以使用“伪终端”进入系统内查看一些信息，测试软件能否正常工作等。

```bash
docker run -it --rm blog
```

关于这里的一些参数：

* `-i`即使没有附加也保持STDIN 打开。

* `-t`分配一个伪终端。
* `--rm`在退出后立刻删除容器。

### 缓存

```bash
# docker build -t blog /data/github/DefectingCat.github.io/                                          
Sending build context to Docker daemon     64kB
Step 1/5 : FROM alpine:latest
 ---> 965ea09ff2eb
Step 2/5 : MAINTAINER Defectink <i@defect.ink>
 ---> Using cache
 ---> 92cd04f91315
```

在构建的时候可以在某一步(Step)下看到`Using cache`。 当 Docker 构建镜像时，它不仅仅构建一个单独的镜像；事实上，在构建过程中，它会构建许多镜像。 

输出信息中的每一步(Step)，Docker都在创建一个新的镜像。同时它还打印了镜像ID：` ---> 92cd04f91315`。这样的好处在于，我们修改`Dockerfile`后重新构建镜像时，那些没有被修改的部分可以将上次构建的镜像当作缓存，加快构建的速度。

但是这也会有些小问题，Docker是根据`Dockerfile`来判断构建时的变化的。但如果需要执行更新软件等操作，而`Dockerfile`内的命令是没有变化时，Docker会继续使用以前的缓存，导致旧的软件还是被安装了。

所有在执行某些必要的操作时，不使用缓存也是极有好处的。在构建镜像时，**使用`--no-cache=True`即可**。

`RUN`命令推荐使用一条命令完成尽可能多的操作，` Dockerfile `中的每个命令都会被分为构建镜像的一步来执行，这样可以减少构建时的步数(Step)。Docker 镜像类似于洋葱。它们都有很多层。为了修改内层，则需要将外面的层都删掉。

### 第一次的运行

将所有的软件都安装、测试完后，就可以构建能够第一次运行的镜像了。在此之前，还需要配置需要运行的软件，例如使用hexo生成静态文件，启动apache等。

```dockerfile
COPY DefectingCat.github.io /data/DefectingCat.github.io
WORKDIR /data/DefectingCat.github.io
RUN hexo g \
        && cp -a public/* /var/www/localhost/htdocs

EXPOSE 80 443
CMD ["/usr/sbin/httpd","-f","/etc/apache2/httpd.conf","-DFOREGROUND"]
```

* `COPY`将宿主机上的文件复制进容器内的目录。在安装软件时就已经使用`RUN`来创建过需要的目录了。
* `WORKDIR`切换工作的目录，和`cd`类似；切换后`RUN`等命令都会在当前目录下工作。
* `EXPOSE`暴露需要使用到的端口。
* `CMD`和`RUN`类似，通常用于来启动容器服务。

关于`CMD`：

`CMD`只能存在一条，根据运行的软件，它将占据最后容器输出的终端。因为容器并不像虚拟化或者物理机那样，可以使用守护进程；容器本身就是一个进程，容器内没有后台服务的概念。正确的做法是使用`CMD`直接执行可执行文件，并且要求以前台形式运行。

当前的操作很简单，就是复制宿主机上git克隆下来的文件到容器的制定文件夹，然后使用`hexo`来生成静态文件，最后复制到`apache`的工作目录下。

到这里就可以来运行一个一次性的容器测试一下我们的服务是否运行正常了。如果上述都没有任何问题的话，现在打开浏览器就应该能看到hexo的blog了🎉。

```bash
docker run -p 80:80 --rm blog
```

到目前为止，Dockerfile应该是这样的：

```dockerfile
FROM alpine:latest
MAINTAINER Defectink <i@defect.ink>

#install
RUN apk update \
        && apk upgrade \
        && apk add --no-cache \
        apache2 \
        nodejs \
        npm \
        tzdata \
        && cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
        && rm -rf /var/cache/apk/* \
        && mkdir -p /data/DefectingCat.github.io \
        && npm config set unsafe-perm true \
        && npm install -g hexo

COPY DefectingCat.github.io /data/DefectingCat.github.io
WORKDIR /data/DefectingCat.github.io
RUN hexo g \
        && cp -a public/* /var/www/localhost/htdocs

EXPOSE 80 443
CMD ["/usr/sbin/httpd","-f","/etc/apache2/httpd.conf","-DFOREGROUND"]
```

安装了一些必要的软件，同时也尽量的减少了镜像构建后的大小。

## HTTPS

现代的网站应该都不会少的了SSL，也就是我们常见的https。目前自己的网站用的是最简单的LetsEncrypt，使用他家的工具Certbot来申请证书及其方便。在宿主机的环境下甚至还能自动配置。但是目前用的是Docker环境，在使用Dockefile构建时，是没有交互环境的。自动配置也可能无法生效。

### 生成证书

Certbot生成证书很是方便，在Docker环境下也是如此。使用官方的镜像可以很方便的生成：

```bash
sudo docker run -it --rm --name certbot \
            -v "/etc/letsencrypt:/etc/letsencrypt" \
            -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
            certbot/certbot certonly
```

配合`certonly`只获取证书，并`-v`来将容器的目录映射到宿主机，这样就能在生成后把证书存到宿主机目录了。

生成时，也会有两种工作模式选择：

```bash
How would you like to authenticate with the ACME CA?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: Spin up a temporary webserver (standalone)
2: Place files in webroot directory (webroot)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 
```

分别是：

* standalone模式：启动一个临时的webserver；
* webroot模式：将验证文件放到当前已有的webserver目录下；

如果当前没有正在运行的webserver，使用standalone模式是最为方便的。Certbot将自己运行一个临时的webserver完成认证。但是如果使用standalone模式，在运行需要添加一个映射的端口：

```bash
sudo docker run -it -p 80:80 --rm --name certbot \
            -v "/data/docker/apache/letsencrypt:/etc/letsencrypt" \
            -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
            certbot/certbot certonly
```

因为Certbot启用了一个临时的webserver来验证域名解析，如果不把容器的`80`端口映射出来的话，将无法完成验证。

在一切都没有任何问题之后，就能看到Congratulations了：

```bash
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/domain/fullchain.pem
```

根据官网的说法，证书均链接在`/etc/letsencrypt/live`目录内。

> `/etc/letsencrypt/archive` and `/etc/letsencrypt/keys` contain all previous keys and certificates, while `/etc/letsencrypt/live` symlinks to the latest versions.

### Mod_ssl

有了证书之后，apache还需要ssl的mod。alpine的镜像安装apache时是没有安装的ssl的mod。所以还需要在Dockerfile内添加一行，手动进行安装，包名为`apache2-ssl`：

```dockerfile
RUN apk update \
        && apk upgrade \
        && apk add --no-cache \
        apache2 \
        apache2-ssl \
```

在重新构建之前，还需要修改apache的`ssl.conf`。如何取得`ssl.conf`呢？我们只需要构建一个临时的alpine镜像，在容器内使用相同的命令安装一个apache与ssl mod，之后在`/etc/apache2/conf.d`目录内就有`ssl.conf`配置文件了。将其copy到宿主机内修改就好了。

```bash
apk add apache2-ssl
```

在启动命令内的`httpd.conf`配置文件会包含`ssl.conf`。所以只需要修改`ssl.conf`，再在构建时将其copy到镜像内就好了。

`httpd.conf`内的已有配置：

```
IncludeOptional /etc/apache2/conf.d/*.conf
```

那么，如何优雅的将容器内的`ssl.conf`copy出来呢？

可以在先将容器放在后台运行：

```bash
docker run -id test
```

然后使用docker自带的`docker cp`命令来copy到宿主机的目录：

```bash
docker cp 253d3ca34521:/etc/apache2/conf.d/ssl.conf /root
```

当然也可以直接打开，然后记录文件内容再复制出来。

有了Mod_ssl组件之后，就可以配合SSL证书来对网站进行加密了。既然能将默认的`ssl.conf`复制出来，就可以对其修改然后在生成镜像时再复制会容器内的原目录。

剩下对于SSL的配置就和给宿主机配置加密一样了，几乎没有什么不同。主要就是在`ssl.conf`中填上正确的证书目录：

```
SSLCertificateFile /etc/letsencrypt/live/defect.ink/fullchain.pem
#SSLCertificateFile /etc/ssl/apache2/server-dsa.pem
#SSLCertificateFile /etc/ssl/apache2/server-ecc.pem

#   Server Private Key:
#   If the key is not combined with the certificate, use this
#   directive to point at the key file.  Keep in mind that if
#   you've both a RSA and a DSA private key you can configure
#   both in parallel (to also allow the use of DSA ciphers, etc.)
#   ECC keys, when in use, can also be configured in parallel
SSLCertificateKeyFile /etc/letsencrypt/live/defect.ink/privkey.pem
```

Let's Encrypt生成的证书在路径下还会有个`fullchain.pem`，这是一整个证书链。在配置文件中只需要这个证书和一个私钥`privkey.pem`就好。

### 跳转至443

在有了https之后，如果不需要80端口还能继续访问。可以使用301跳转来将访问80端口的访客都跳转到443。Apache的mod_rewrite可以轻松的实现针对各种条件的跳转。

mod_rewrite的作用很多，能设置的条件也可以很复杂。当然配置个简单的跳转不是非常的复杂。

```
RewriteEngine on
RewriteCond %{SERVER_NAME} =defect.ink
RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
```

* `RewriteEngine`打开跳转引擎；
* `RewriteCond`跳转的条件；这里设置当域名为`defect.ink`时，执行下面的跳转动作；
* `RewriteRule`跳转的动作；当符合上面的条件时，执行添加https`https://%{SERVER_NAME}%{REQUEST_URI}`。而后面的变量保持不动。

这行配置是来自于certbot的自动配置中的，在配置宿主机的ssl时可以选择全部跳转。然后它就会帮我们自动配置了。对其进行简单的修改就可以作用与其他的配置文件了。

这几行推荐是写在`httpd.conf`的末尾，也就是`IncludeOptional /etc/apache2/conf.d/*.conf`的上方。虽然ssl.conf也会被include进来，但是还是感觉写在这里要方便一点。

然后将`httpd.conf`和`ssl.conf`一样在构建时复制到容器内就ok了。

```dockerfile
        && cp -a ssl.conf /etc/apache2/conf.d/ \
        && cp -a httpd.conf /etc/apache2/
```

### Renew

Let's Encrypt的证书虽然很方便，但是一次只能生成三个月有效期的证书。使用和生成差不多的方法renew证书就好了。

```
sudo docker run -it -p 80:80 --rm --name certbot \
             -v "/data/docker/apache/letsencrypt:/etc/letsencrypt" \
             -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
             certbot/certbot renew
```

想要自动化执行话，可以使用crontab来定时运行。

## 全部的Dockerfile

这时候的配置文件看起来应该是这个样子的：

```dockerfile
#test
  
FROM alpine:latest
MAINTAINER Defectink <i@defect.ink>

#install
RUN apk update \
        && apk upgrade \
        && apk add --no-cache \
        apache2 \
        apache2-ssl \
        nodejs \
        npm \
        tzdata \
        && cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
        && rm -rf /var/cache/apk/* \
        && mkdir -p /data/DefectingCat.github.io \
        && npm config set unsafe-perm true \
        && npm install -g hexo

COPY DefectingCat.github.io /data/DefectingCat.github.io
WORKDIR /data/DefectingCat.github.io
RUN hexo g \
        && cp -a public/* /var/www/localhost/htdocs/ \
        && cp -a ssl.conf /etc/apache2/conf.d/ \
        && cp -a httpd.conf /etc/apache2/

EXPOSE 80 443
CMD ["/usr/sbin/httpd","-f","/etc/apache2/httpd.conf","-DFOREGROUND"]
```

## 启动！

```bash
docker run -id --name="blog" -v /etc/letsencrypt/:/etc/letsencrypt/ -p 80:80 -p 443:443 blog
```

全部操作完了，启动命令也随着操作变得更加的复杂了。

* `-id`扔到后台；
* `--name`容器别名；
* `-v`映射之前的ssl证书的目录；
* `-p`80和443都需要映射；

## 优化

一些比较方便的命令。

删除所有`<none>`的镜像：

```bash
docker rmi $(docker images -f "dangling=true" -q)
```

停止所有容器，删除所有容器：

```bash
docker kill $(docker ps -q) ; docker rm $(docker ps -a -q)
```

停止所有容器，删除所有容器，**删除所有镜像**：

```bash
docker kill $(docker ps -q) ; docker rm $(docker ps -a -q) ; docker rmi $(docker images -q -a)
```

## 参考

* [How To Create an SSL Certificate on Apache for CentOS 7](https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-apache-for-centos-7)

* [apache2-ssl](https://pkgs.alpinelinux.org/package/edge/main/x86/apache2-ssl)
* [Certbot running with Docker](https://certbot.eff.org/docs/install.html#running-with-docker)

* [Where my Certificate](https://certbot.eff.org/docs/using.html#where-certs)