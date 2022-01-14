---
title: Minecraft bedrock服务端🥂
date: 2019-05-16 14:21:37
tags: Minecraft
categories: 实践
url: minecraft-bedrock-server
index_img: /images/Minecraft-bedrock服务端/217940907.webp
---

## Minecraft

**MINECRAFT 是什么？**

> **这是一个有关放置方块与探险的游戏。**
游戏设定在一片可以无限生成的世界里，这里有广袤而开阔的土地——由冰雪覆盖的山峰、潮湿的河口、辽阔的牧场等等组成——它们充满着奥秘、奇迹与危险。

这个游戏应该是多数玩家都已不陌生，开发商为Mojang AB（Mojäng Aktiebolag），是瑞典的一家电子游戏开发商。他家也发行过其他的小游戏，但是名声都不怎么样。最后Minecraft一炮走红。2014年9月，财大气粗的软软以25亿美元收购Mojang以及游戏的知识产权。

最早的时候我们在PC上接触的应该都是开发商的Java版本，Java版本的好处就是它有各种各样的Mod，以及材质包等。对于玩家来说使用也非常的方便。虽然性能不是那么的卓越，但是现在依然是很受玩家的欢迎了。

在被微软收购以后，微软结合自家的Win10应用商店也出了一个Bedrock版本，与其不同的是，这次使用C语言写出来的。在自家的应用商店内，玩家们安装也变的更加的方便了。除此之外，性能方面肯定是要比Java好的多的。

## Bedrock Server

相比较以前的Java版本自建服务器来说，Bedrock版本的Server要比以前方便简单的多。虽然目前还处于Bate版本，但是支持的功能也比较完善了。

主要是简单的多，对于以前的Java，服务端搭建起来非常的麻烦，得力于Java，还非常吃服务器的资源。目前已经编译好的C语言来说，不仅省了很多事，还降低了对服务器的要求。当然，唯一一个缺点就是跨平台肯定没有Java方便了。

## 搭建服务端

服务端我们可以免费的在[官方网站](<https://www.minecraft.net/en-us/download/server/bedrock/>)下载，目前只支持Windows与Ubuntu版本。在Windows上运行推荐使用Windows10/Windows Server 2016及以后的版本。

![2019-05-13T05:16:24.webp][1]

[1]: ../images/Minecraft-bedrock服务端/4100402335.webp

Windows版本与Ubuntu版本的文件几乎差不多，下载后直接解压，我们就能够看到一个可执行的`bedrock_server.exe`文件。当没有任何需求时，直接执行它就可以启动并正常使用服务端了。

启动后我们可以看到一个类似这样的命令提示符的界面：

![2019-05-15T13:18:43.webp][2]

[2]: ../images/Minecraft-bedrock服务端/3200057918.webp

此时的服务器端就已经启动完成了，若能直接访问服务器，就可以直接开始游戏了🥓。

*需要使用在Windows商店下载的Minecarft作为客户端*

### 配置文件

当然，默认的配置文件往往大多数时间都是不能满足我们的需求的。还有很多种情况需要我们根据自己的想法去自定义。例如修改个监听的端口。

目前的Bedrock服务端也有个较为完善的配置文件，可读性也非常的高。官方下载的包里不仅有个“How to”，并且配置文件内都有着很详细的注释，例如修改游戏模式：

```
gamemode=survival
# Sets the game mode for new players.
# Allowed values: "survival", "creative", or "adventure"
```

配置文件的修改入门很低，只要能打开几乎针对服务器的一些选项都可以自定义。除此之外，我们还可以在服务器允许中的命令行/shell内直接使用一些命令，例如提出某个在线的玩家：

```
kick <player name or xuid> <reason>
```

或者是关闭服务器：

```
stop
```

*当然你喜欢的话也可以直接终止这个进程，当然不推荐这么做。*

压缩包内的“bedrock_server_how_to.html”写的非常的详细，功能也非常的全。对于一些日常的使用，或者是入门的话，可以多参考参考该文件。

为了方便，我还放了个在线版本的[📢bedrock_server_how_to](<https://www.defectink.com/defect/bedrock_server_how_to.html>)。是当前最新的1.11.2.1版本的，后续可能不会持续更新。当前写的非常的详细了。

### 权限级别

配置文件可以修改大多数服务端的配置，主要是针对游戏服务器的修改。像是对于游戏内的具体修改并没有写在配置文件内，例如对玩家的修改以及修改世界的选项。这些操作选项需要我们手动赋予一个玩家“操作员”的权限，这样，该玩家就会有对目前游戏的整个世界的完整操作权限。

![2019-05-15T15:27:50.webp][3]

[3]: ../images/Minecraft-bedrock服务端/2032314932.webp

在游戏的目录下有个名为`permissions.json`的json文件，在默认情况下它是空的，我们可以根据帮助文件提供的格式直接赋予某个玩家权限：

```
[
    {
        "permission": "operator",
        "xuid": "451298348"
    }
]
```

*需要注意的是，我们需要对应的玩家的`xuid`值，这在玩家连接时会显示在终端上。*

一次赋予多个玩家的格式：

```
[
    {
        "permission": "operator",
        "xuid": "451298348"
    },
    {
        "permission": "member",
        "xuid": "52819329"
    },
    {
        "permission": "visitor",
        "xuid": "234114123"
    }
]
```

当玩家被赋予`operator`的权限时，重启服务端，再次进入游戏时该玩家就拥有了对世界的完整控制。

*某些世界生成后就不能修改的选项除外*

## 备份世界

最简单也是最直接的备份方式就是直接备份当前服务端的整个文件夹，如果这个操作太过于麻烦的话，或者说文件夹已经达到了臃肿的地步了。我们可以使用预留的备份命令，可以生成`.db`的文件用于copy。文档的详细解释：

| Command     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| save hold   | This will ask the server to prepare for a backup. It’s asynchronous and will return immediately.                                                                                                                                                                                                                                                                                                                                                                                                 |
| save query  | After calling `save hold` you should call this command repeatedly to see if the preparation has finished. When it returns a success it will return a file list (with lengths for each file) of the files you need to copy. The server will not pause while this is happening, so some files can be modified while the backup is taking place. As long as you only copy the files in the given file list and truncate the copied files to the specified lengths, then the backup should be valid. |
| save resume | When you’re finished with copying the files you should call this to tell the server that it’s okay to remove old files again.                                                                                                                                                                                                                                                                                                                                                                    |

我们可以直接使用`save hold`来生成备份文件，然后再使用`save query`来查询文件的位置。*注意：当我们的世界名称使用中文时，可能会出现在终端中文乱码的情况*，例如：

![2019-05-15T15:50:09.webp][4]

[4]: ../images/Minecraft-bedrock服务端/1339714059.webp

此时最佳解决办法就是换个世界名称。但是直接在配置文件中更换名称后，会导致重新创建一个新的世界。为了避免这个现象，达到给旧世界更换名称的操作。我们需要同时修改三个地方的名称，并保持一致：

* `server.properties`文件内的名称
* `world`文件夹内的世界文件夹名称
* 世界文件夹内的`levelname.txt`内的文字

当这三处名称统一修改时，再重新启动服务器就会达到修改世界名称的效果了。

目前推荐的最佳的备份方法就是直接备份`world`文件夹的所有内容，在服务器运行时对文件夹进行复制操作不会影响服务器的正常运行。

## 网易代理

网易代理的Minecraft对游戏的本质来说或许没有太多的不同，对于收费模式也是符合目前国内的游戏较为普遍的免费进入游戏，后续再根据自己的选择购买一些增值服务。也就是非买断制。但是网易拥有租赁服务器的服务，可能是想方便提供给玩家们一个更加方便的购买与启用服务器的渠道，但是他直接禁止使用其他的第三方服务器。对于某些玩家来说可能不是个好的选择。

虽然微软在Xbox上也有这类似的操作，但是Windows商店的Minecraft也不是天价，对于不想玩个mc就把身份证给网易的小伙伴们，Windows商店可能是个更好的选择。

