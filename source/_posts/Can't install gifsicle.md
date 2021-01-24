---
title: Can't install gifsicle
index_img: /images/Can't%20install%20gifsicle/index.webp
date: 2020-08-04 14:03:00
tags: network
categories: 踩坑
url: cant-install-gifsicle
---

## Hexo-all-minifier

In a long time, i'm used to Hexo-all-minifier to optimization blog. But recently i can't even install it.

The error logs with `npm install`:

```bash
  ‼ getaddrinfo ENOENT raw.githubusercontent.com
  ‼ gifsicle pre-build test failed
  i compiling from source
  × Error: Command failed: C:\WINDOWS\system32\cmd.exe /s /c "autoreconf -ivf"
'autoreconf' �����ڲ����ⲿ���Ҳ���ǿ����еĳ���
���������ļ���
```

In the beginning, i thought the problem is my windows can't run autoconf. So, i tried installing cygwin, And that is difficult for me. I never tried to installed cygwin.

Anyway, i installed successfully. But the problem has not solved. There is still has the errors with npm install .

## imagemin-gifsicle

The problem appeared when installing gifsicle, The Hexo-all-minifier used it too. So, the best way is go to the gifsicle issues. As predicted, there is someone got the same errors. 

Be unexpected, It's not a problem with windows or autoconf. That is network problem🌚. 

```bash
  ‼ getaddrinfo ENOENT raw.githubusercontent.com
  ‼ gifsicle pre-build test failed
```

As in above two lines, the problem is can't connect with `githubusercontent.com`.

## Best way

Write domain with ip into the hosts. That is best way to connect with github and other domains.

```
52.74.223.119     github.com
192.30.253.119    gist.github.com
54.169.195.247    api.github.com
185.199.111.153   assets-cdn.github.com
151.101.76.133    raw.githubusercontent.com
151.101.76.133    gist.githubusercontent.com
151.101.76.133    cloud.githubusercontent.com
151.101.76.133    camo.githubusercontent.com
151.101.76.133    avatars0.githubusercontent.com
151.101.76.133    avatars1.githubusercontent.com
151.101.76.133    avatars2.githubusercontent.com
151.101.76.133    avatars3.githubusercontent.com
151.101.76.133    avatars4.githubusercontent.com
151.101.76.133    avatars5.githubusercontent.com
151.101.76.133    avatars6.githubusercontent.com
151.101.76.133    avatars7.githubusercontent.com
151.101.76.133    avatars8.githubusercontent.com
```

Then, try`npm cache clean -f`and`ipconfig/flushdns`.

As long as can ping with github domains, the problem will be solved.

The `Command failed` just write some ips for hosts, then `npm install` will be worked.

So, 

![批注 2020-08-04 135700](../images/Can't%20install%20gifsicle/批注%202020-08-04%20135700.webp)



enjoy it.