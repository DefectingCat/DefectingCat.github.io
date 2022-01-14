---
title: systemd 的基础操作
date: 2019-06-14 14:42:41
tags: Linux
categories: Linux
url: basic-knowledge-of-systemd
index_img: /images/systemd的基础操作/logo.webp
---

## 什么是systemd？

Systemd是我们常用的一些Linux发行版中常见的一套中央化系统及设置管理程序(init)，包括有[守护进程](https://zh.wikipedia.org/wiki/%E5%AE%88%E6%8A%A4%E8%BF%9B%E7%A8%8B)、[程序库](https://zh.wikipedia.org/wiki/%E7%A8%8B%E5%BC%8F%E5%BA%AB)以及应用软件。

我们经常使用`systemctl start apache2`来启动一些服务或者应用软件时，使用到的就是Systemd的一部分。

当前绝大多数的Linux发行版都已采用systemd代替原来的[System V](https://zh.wikipedia.org/wiki/UNIX_System_V)。

## 学习它的作用？

它能够方便的对一些软件运行进行管理，经常使用`systemctl`的同学们可能会比较了解，譬如查看运行状态，设置开机自启等操作。

最近尝鲜了Ubuntu，但是遇到个新的问题。在Ubuntu 18.10中，已经将以前的开机自启动的脚本`/etc/rc.local`去掉了。无意中看到使用systemd来控制开机自启应用程序。

后来就顺便尝试进一步了解一下systemd，毕竟还是比较有用的。

## 开机运行启动的原理

一些支持systemd的软件，在安装时会在`/usr/lib/systemd/system`目录下添加一个支持systemd的配置文件。当我们使用`systemctl enable apache2`时，就相当于将`/usr/lib/systemd/system`目录下的配置文件添加一个符号链接，链接到`/etc/systemd/system`目录。

当我们的系统开机时，systemd会执行`/etc/systemd/system`目录下的配置文件，以达到开机自启的效果。

最近发现当前较新的发行版，使用enable命令时，创建的链接目录为：

```
~ systemctl enable httpd             
Created symlink from /etc/systemd/system/multi-user.target.wants/httpd.service to /usr/lib/systemd/system/httpd.service.
```

## 配置文件

几条常用且熟悉的sysemctl的命令这里就不在详细介绍了。这里直接了解一下最核心的部分，配置文件。

早在很久以前，对于[Nyncat](https://www.defectink.com/defect/12.html)这篇文章，里面就使用到自己编写systemd的配置文件来达到对nyancat这个服务的详细控制。（虽然当时我不理解配置文件说的啥…

上述了解到，配置文件一般情况下出现在两个地方：`/usr/lib/systemd/system`目录和`/etc/systemd/system/multi-user.target.wants`目录。对于完全不了解配置文件的情况下，我们可以先在这两个目录找个案例了解一下。

**某些Ubuntu的发行版可能在`/lib/systemd/system`目录下保存配置文件**

例如，CentOS的httpd：

```
[Unit]
Description=The Apache HTTP Server
After=network.target remote-fs.target nss-lookup.target
Documentation=man:httpd(8)
Documentation=man:apachectl(8)

[Service]
Type=notify
EnvironmentFile=/etc/sysconfig/httpd
ExecStart=/usr/sbin/httpd $OPTIONS -DFOREGROUND
ExecReload=/usr/sbin/httpd $OPTIONS -k graceful
ExecStop=/bin/kill -WINCH ${MAINPID}
# We want systemd to give httpd some time to finish gracefully, but still want
# it to kill httpd after TimeoutStopSec if something went wrong during the
# graceful stop. Normally, Systemd sends SIGTERM signal right after the
# ExecStop, which would kill httpd. We are sending useless SIGCONT here to give
# httpd time to finish.
KillSignal=SIGCONT
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

我们可以了解到，它基本上分为三个区块：`Unit`、`Service`和`Install`区块。

### Unit区域

Unit区域用于解释启动顺序与依赖关系。可以直观的看到它有几个字段：

- Description
- After
- Documentation

第一眼看上去可能都是比较乱七八糟的，根本不知道它在说啥。但是我们拆开来一个一个了解，就会发现它意义非常的简单。

**Description**：用于给出当前服务的简单描述。通常我们查看服务状态时，都会在第一行看到这么一句话：

```
httpd.service - The Apache HTTP Server
```

这就是`Descipton`字段的作用，一句话对当前服务的简单介绍。

**After**：该字段是有关于启动顺序的字段，从字面意思我们就应该大概了解到，这个值应该是定义当前服务应该启动在哪些服务之后。

上述配置文件该值解释就是：当`network.target remote-fs.target nss-lookup.target`这些服务需要启动，那么当前的`httpd.service`应该在他们之后启动。

相对的，和`After`对应的还有个`Before`字段。了解了`After`这个`Before`就应该很容易理解了。完全和`After`相对的意思，定义`httpd.service`应该在哪些服务之前启动。

After和Before只关乎到服务的启动顺序，并不关乎到依赖关系。

**Documentation**：该字段比较简单，和`Descripton`作用差不多。它的值用于给出当前服务的文档的位置。

当前配置文件中并没有说明依赖关系的字段。依赖关系和启动顺序都是写在当前这个Unit区域的，它俩非常像象，但是作用不同。

依赖关系有两个字段进行控制：`Wants`和`Requiers`。

**Wants**：表示弱依赖关系，即使该值内的服务启动失败，也不影响当前服务的继续运行。

**Requires**：表示强依赖关系，如果该值内的服务无法运行，那么当前服务也将停止。

打个比方：

当前的httpd.service需要依赖mysql来存储数据。如果在配置文件中它只定义了在mysql之后启动。而没定义依赖关系，那么当mysql出现错误停止时，在重新启动期间，当前的httpd将无法与mysql建立链接。

**这里只是打个比方帮助我们更好的了解，实际情况下httpd在通常和mysql是没有这样的依赖关系的🍥。**

### Service区域

Service区域是主要的一部分，主要控制软件的启动停止等，都是在此部分声明的。也就是定义了如何启动当前的服务。

许多软件都有环境参数文件，使用`EnvironmentFile`字段便可以定义环境参数。

`EnvironmentFile`字段：指定当前服务的环境参数文件。该文件内部的`key=value`键值对，可以用`$key`的形式，在当前配置文件中获取。

例如，启动`sshd`，执行的命令是`/usr/sbin/sshd -D $OPTIONS`，其中的变量`$OPTIONS`就来自`EnvironmentFile`字段指定的环境参数文件。

除此之外，Service区域还有一些关于控制软件行为的一些字段：

* `ExecStart`字段：定义启动进程时执行的命令。

- `ExecReload`字段：重启服务时执行的命令
- `ExecStop`字段：停止服务时执行的命令
- `ExecStartPre`字段：启动服务之前执行的命令
- `ExecStartPost`字段：启动服务之后执行的命令
- `ExecStopPost`字段：停止服务之后执行的命令

所有的启动设置之前，都可以加上一个连词号（`-`），表示"抑制错误"，即发生错误的时候，不影响其他命令的执行。比如，`EnvironmentFile=-/etc/sysconfig/sshd`（注意等号后面的那个连词号），就表示即使`/etc/sysconfig/sshd`文件不存在，也不会抛出错误。

此外，Service中还有几个比较重要的字段

**Type**字段，它有如下一些值：

- simple（默认值）：`ExecStart`字段启动的进程为主进程
- forking：`ExecStart`字段将以`fork()`方式启动，此时父进程将会退出，子进程将成为主进程
- oneshot：类似于`simple`，但只执行一次，Systemd 会等它执行完，才启动其他服务
- dbus：类似于`simple`，但会等待 D-Bus 信号后启动
- notify：类似于`simple`，启动结束后会发出通知信号，然后 Systemd 再启动其他服务
- idle：类似于`simple`，但是要等到其他任务都执行完，才会启动该服务。一种使用场合是为让该服务的输出，不与其他服务的输出相混合

### Install区域

`Install`区块，定义如何安装这个配置文件，即怎样做到开机启动。

`WantedBy`字段：表示该服务所在的 Target。

`Target`的含义是服务组，表示一组服务。`WantedBy=multi-user.target`指的是，sshd 所在的 Target 是`multi-user.target`。

这个设置非常重要，因为执行`systemctl enable sshd.service`命令时，`sshd.service`的一个符号链接，就会放在`/etc/systemd/system`目录下面的`multi-user.target.wants`子目录之中。

Systemd 有默认的启动 Target。

 ```bash
 $ systemctl get-default
 multi-user.target
 ```

一般来说，常用的 Target 有两个：一个是`multi-user.target`，表示多用户命令行状态；另一个是`graphical.target`，表示图形用户状态，它依赖于`multi-user.target`。官方文档有一张非常清晰的 [Target 依赖关系图](https://www.freedesktop.org/software/systemd/man/bootup.html#System Manager Bootup)。

Target 也有自己的配置文件。

```bash
$ systemctl cat multi-user.target

[Unit]
Description=Multi-User System
Documentation=man:systemd.special(7)
Requires=basic.target
Conflicts=rescue.service rescue.target
After=basic.target rescue.service rescue.target
AllowIsolate=yes
```

## 详细的字段解释

```
[Unit]
Description : 服务的简单描述
Documentation ： 服务文档
Before、After:定义启动顺序。Before=xxx.service,代表本服务在xxx.service启动之前启动。After=xxx.service,代表本服务在xxx.service之后启动。
Requires：这个单元启动了，它需要的单元也会被启动；它需要的单元被停止了，这个单元也停止了。
Wants：推荐使用。这个单元启动了，它需要的单元也会被启动；它需要的单元被停止了，对本单元没有影响。
```

```
[Service]
Type=simple（默认值）：systemd认为该服务将立即启动。服务进程不会fork。如果该服务要启动其他服务，不要使用此类型启动，除非该服务是socket激活型。
Type=forking：systemd认为当该服务进程fork，且父进程退出后服务启动成功。对于常规的守护进程（daemon），除非你确定此启动方式无法满足需求，使用此类型启动即可。使用此启动类型应同时指定 PIDFile=，以便systemd能够跟踪服务的主进程。
Type=oneshot：这一选项适用于只执行一项任务、随后立即退出的服务。可能需要同时设置 RemainAfterExit=yes 使得 systemd 在服务进程退出之后仍然认为服务处于激活状态。
Type=notify：与 Type=simple 相同，但约定服务会在就绪后向 systemd 发送一个信号。这一通知的实现由 libsystemd-daemon.so 提供。
Type=dbus：若以此方式启动，当指定的 BusName 出现在DBus系统总线上时，systemd认为服务就绪。
Type=idle: systemd会等待所有任务(Jobs)处理完成后，才开始执行idle类型的单元。除此之外，其他行为和Type=simple 类似。
PIDFile：pid文件路径
ExecStartPre：停止服务时执行的命令
ExecStart：指定启动单元的命令或者脚本，ExecStartPre和ExecStartPost节指定在ExecStart之前或者之后用户自定义执行的脚本。Type=oneshot允许指定多个希望顺序执行的用户自定义命令。
ExecReload：指定单元停止时执行的命令或者脚本。
ExecStop：指定单元停止时执行的命令或者脚本。
ExecStopPost：停止服务之后执行的命令
ExecStartPost：启动服务之后执行的命令
PrivateTmp：True表示给服务分配独立的临时空间
Restart：这个选项如果被允许，服务重启的时候进程会退出，会通过systemctl命令执行清除并重启的操作。
RemainAfterExit：如果设置这个选择为真，服务会被认为是在激活状态，即使所以的进程已经退出，默认的值为假，这个选项只有在Type=oneshot时需要被配置。
```

```
[Install]
Alias：为单元提供一个空间分离的附加名字。
RequiredBy：单元被允许运行需要的一系列依赖单元，RequiredBy列表从Require获得依赖信息。
WantBy：单元被允许运行需要的弱依赖性单元，Wantby从Want列表获得依赖信息。
Also：指出和单元一起安装或者被协助的单元。
DefaultInstance：实例单元的限制，这个选项指定如果单元被允许运行默认的实例。
```

## 重启

```bash
# 重新加载配置文件
$ sudo systemctl daemon-reload

# 重启相关服务
$ sudo systemctl restart foobar
```
