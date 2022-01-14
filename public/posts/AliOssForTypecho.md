---
title: AliOssForTypecho
date: 2019-06-26 16:42:41
tags: typecho
categories: 踩坑
url: alioss-for-typecho
index_img: /images/AliOssForTypecho/logo.webp
---

原作大佬：

* [Typecho插件](https://zhoujie.ink/AliOssForTypecho.html)

最近从辣鸡七牛换到了阿里云的oss，对于我们使用阿里云的ECS来说，oss支持直接内网访问还是很友好的。

存储换了之后，于是找到了大佬的这款插件。可是大佬当初写插件的时候有些地方不太符合个人的使用习惯。比如存储的目录下都会给每张图片单独生成要一个文件夹。

虽然看到大佬blog下已经有留言了，但是那都是去年的事了。

当时是因为阿里云还没有检测object是否存在的sdk，大佬估计也是没有时间来跟这阿里云的sdk持续更新。就在18年10月份阿里云才更新了判断文件是否存在的php sdk。

对于我这种0基础没入门的php玩家，修改太多也太麻烦，也不会。于是只做了一些简单的修改

- 去除每个图片随机创建一个文件夹，但是没有是否存在的检测，上传时要确保文件不会重名。
- 添加图片处理样式，支持自定义规则。
- 更新了最新的OssClient（虽然我不知道它怎么用




为什么不做object存在检测？

- 当前文件夹是按“年-月-日”来分层的，也就是说存在重名的文件的时间段只有一天内上传的文件才有机会重名。
- 不会
- 主要是不会

阿里云的[判断文件是否存在](https://help.aliyun.com/document_detail/88501.html?spm=a2c4g.11186623.6.938.33f015cdQHplrY)文档，有兴趣的大佬可以试试。



下载地址：

* [AliossForTypecho](https://github.com/DefectingCat/AliOssForTypecho-)