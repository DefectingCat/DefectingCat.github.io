---
title: 解决 inotify watch 不够⌚
date: 2019-05-29 9:05:01
tags: Linux
categories: 踩坑
url: fixed-inotify-watch-not-enough
index_img: /images/解决inotify-watch不够/logo.webp
---

> Failed to add /run/systemd/ask-password to directory watch: No space left on device

这当然不是磁盘空间不足。

曾经被这问题折腾了很长时间，在磁盘空间充足的情况下，一直提示设备剩余空间不足，导致许多服务无法启动。该问题所在的根源是Inotify watch被占用光了导致的。

## inotify watch

Inotify 到底是什么？

Inotify 是一种文件变化通知机制，或者称之为监控文件系统，Linux 内核从 2.6.13 开始引入。在 BSD 和 Mac OS 系统中比较有名的是[kqueue](http://wiki.netbsd.se/kqueue_tutorial)，它可以高效地实时跟踪 Linux 文件系统的变化。近些年来，以[fsnotify](http://git.kernel.org/?p=linux/kernel/git/torvalds/linux-2.6.git;a=commitdiff;h=90586523eb4b349806887c62ee70685a49415124)作为后端，几乎所有的主流 Linux 发行版都支持 Inotify 机制。

可以简单的理解为，inotify就是监控我们当前系统上的文件变化。在日常工作中，人们往往需要知道在某些文件 (夹) 上都有那些变化，比如：

- 通知配置文件的改变
- 跟踪某些关键的系统文件的变化
- 监控某个分区磁盘的整体使用情况
- 系统崩溃时进行自动清理
- 自动触发备份进程
- 向服务器上传文件结束时发出通知

检查当前系统内核是否支持inotify机制：

```
grep INOTIFY_USER /boot/config-$(uname -r)
```

如果输出为：`CONFIG_INOTIFY_USER=y`，那么当前的系统内核便是支持inotify了。

## 解决watch不够

经常打开服务无法启动，提示：

```
Failed to add /run/systemd/ask-password to directory watch: No space left on device
```

便是inotify watch不够导致的服务无法启动，很多程序的进程都需要使用inotify watch来监控文件系统。当某些进程使用的太多的时候，就会导致watch不够，导致一些程序直接无法启动。

遇到这种情况解决办法非常的简单，毕竟不是磁盘的空间不够，我们不需要删除任何的文件，只需要放大足够的watch数量就ok了。

临时的解决办法：

```
echo 1048576 > /proc/sys/fs/inotify/max_user_watches
```

直接在终端`echo`一个大量的watch数量到指定的路径，不出意外的话就能够直接解决问题。但这只是个临时的解决办法，再重启机器后将会还原。

该临时解决办法的好处就是方便快捷，有次我的sshd因为watch数量的不够倒是无法启动时，唯一的解决办法就是连接vnc来解决，然后网页的vnc是不支持粘贴的，所以使用这一行命令也就非常的方便了。

长期解决方法：

```
vim /etc/sysctl.conf 
fs.inotify.max_user_watches=1048576
```

长期的解决方法也很简单，我们直接在`/etc/sysctl.conf `文件的末尾添加一句话就可以了。

## 参考

* [Inotify: 高效、实时的 Linux 文件系统事件监控框架](<https://www.infoq.cn/article/inotify-linux-file-system-event-monitoring>)
* [磁盘空间充足，但是重启服务出现报错：Failed to add /run/systemd/](<https://blog.51cto.com/zhanx/2339983>)
* [inotify](<https://zh.wikipedia.org/wiki/Inotify>)