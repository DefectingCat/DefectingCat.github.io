---
title: 想起来当年还折腾过 hexo
date: 2018-06-29 12:12:41
tags: [Linux, HTML]
categories: 实践
url: hexo-again
index_img: /images/想起来当年还折腾过hexo/index.webp
---

## Hexo

曾经的水文：

[Hexo](/defect/hexo.html)✔
[Hexo and Github](/defect/hexo-and-github.html)✔

谁还不喜欢水呢（小声

hexo估计了解的人有很多了，在业界也是很知名的一款blog框架。说到blog程序，可能很多人都听说过知名的wordpress、typecho等。

那么hexo相对于他们的优势有什么呢？

- 全静态化站点
- 可部署于GitHub
- 一键部署
- 同样有丰富的插件
- 原生支持Markdown

曾经的曾经，那时的我刚开始研究hexo，还不够了解它的工作机制。谁让我以前比较笨。

以前我以为它是和部署普通的blog程序一样的，只是不需要用到数据库而已。于是我直接将其装在了自己的VPS上，虽然它也支持使用hexo-server来启用网页服务，直接部署在当前机器上。但是在我那个卡的要死的机器上使用ssh+vim来写markdown肯定不好受。

就算是在本地写完再上传也是比较麻烦的，尤其是后来研究了hexo与GitHub共同工作之后。发现它完全就可以部署在本地计算机上。写起来也更加的方便。
这就是这篇文章的作用了。

## 部署于Windows

所需：

- [Gitbash](https://gitforwindows.org/)（git for windows）
- [Node.js](https://nodejs.org/en/)
- Github仓库

> Windows 用户
> 对于windows用户来说，建议使用安装程序进行安装。安装时，请勾选Add to PATH选项。
> 另外，您也可以使用Git Bash，这是git for windows自带的一组程序，提供了Linux风格的shell，在该环境下，您可以直接用上面提到的命令来安装Node.js。打开它的方法很简单，在任意位置单击右键，选择“Git Bash Here”即可。由于Hexo的很多操作都涉及到命令行，您可以考虑始终使用Git Bash来进行操作。

Gitbash与Node.js均有在Windows下的独立安装程序，就和安装其他软件一般，非常简单。不再赘述。当然也可以使用gitbash来安装node.js，都是同样的简单。

当git与node.js全部安装完成后，我们就可以使用一条命令直接安装hexo了。

```npm
$ npm install -g hexo-cli
```

## 建站🏘

当hexo以及其他所需要的环境都安装在我们的Windows上后，就可以开始配合GitHub来搭建一个托放在GitHub上的静态化blog了。

```bash
$ hexo init <folder>
$ cd <folder>
$ npm install
```

仅需三条命令，就可以部署一个文件夹为我们的站点跟目录了。当然这个文件夹需要是空的，必须要是新建的一个全空的文件夹，才能正常执行 hexo init 。
正常安装完成后，可以在目录下看到如下的文件树了。

```bash
.
├── _config.yml
├── package.json
├── scaffolds
├── source
|   ├── _drafts
|   └── _posts
└── themes
```

日后我们新建的文章都会存放在source/_posts中，以便于hexo的渲染。

### _config.yml

该配置文件用于修改一些站点的配置。可以修改大多数站点的参数。例如：站点标题，时区等。

```
# Site
title: Defectink
subtitle: Another Defectink?
description: Just Blog
keywords:
author: DefectingCat
```

更多：[配置](https://hexo.io/zh-cn/docs/configuration)

### 部署至GitHub🛰

部署至GitHub是非常简单且方便的一个操作了。相对于自己建设于VPS上的站点来说，优势于：

- 免费
- 利用多个分支实现备份
- 版本控制

安装用于部署至GitHub的工具 [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git)

```bash
$ npm install hexo-deployer-git --save
```

修改_config.yml中的deploy配置。

```
deploy:
  type: git
  repo: <repository url> #https://bitbucket.org/JohnSmith/johnsmith.bitbucket.io
  branch: [branch] #published
  message: [message]
```

如果要利用多个分支实现，一个分支用于存放hexo的文件，一个分支用于部署hexo生成的网页。那么就需要修改branch中的分支了。hexo会根据配置文件中的分支来创建并提交到分支中。

> 这一切是如何发生的？
> 当初次新建一个库的时候，库将自动包含一个master分支。请在这个分支下进行写作和各种配置来完善您的网页。当执行hexo deploy时，Hexo会创建或更新另外一个用于部署的分支，这个分支就是_config.yml配置文件中指定的分支。Hexo会将生成的站点文件推送至该分支下，并且完全覆盖该分支下的已有内容。因此，部署分支应当不同于写作分支。（一个推荐的方式是把master作为写作分支，另外使用public分支作为部署分支。）值得注意的是，hexo deploy并不会对本地或远程的写作分支进行任何操作，因此依旧需要手动推送写作分支的所有改动以实现版本控制。此外，如果您的Github Pages需要使用CNAME文件自定义域名，请将CNAME文件置于写作分支的source_dir目录下，只有这样hexo deploy才能将CNAME文件一并推送至部署分支。

首先需要满足：

- 仓库名（用户名.github.io）✔
- 用于存放网页的必须是master分支✔

如果不满足呢？当然也可以。

但是当你使用其他仓库名来创建网页（GitHub Pages），也可以使用“用户名.github.io”这个域名。但是会在域名后面添加一个仓库名。例如：“defectingcat.github.io/test”。 就好像是子目录一样。且不知道为什么分支只能使用gh-pages。

当所有条件都准备好了，配置文件也准备好了。那么现在就可以部署了。

```bash
hexo clean && hexo deploy
```

前者清除站点文件，后者重新生成站点文件并将之推送到指定的库分支。
每次都需要这么长的命令吗？不，通过markdown写完文章后。直接使用

```
hexo g -d
```

来部署至GitHub。

> INFO Deploy done: git

看到这条消息，就说明我们已经向GitHub部署成功了。
此时访问GitHub的域名就可以打开刚刚部署好的hexo了。

### 恢复

部署至GitHub最大的好处就在于这里了，那就是恢复。刚刚上述有说过，我们利用两个分支，将生成的静态站点放在master分支，再额外创建一个分支用于存放hexo的核心文件。并使用git同步。

这样，当我们的本地的hexo的核心文件遭受损坏，或者误删的时候，我们就可以使用git。很轻松的获取一份曾经的备份。
例：

```
git clone https://github.com/DefectingCat/DefectingCat.github.io/tree/file
```

另外，hexo默认是没有后台的面板的。毕竟是纯静态化的站点。貌似使用某些插件可以实现拥有后台面板。没有后台就意味着我们不在自己的电脑环境下更新自己的hexo文章就比较麻烦了。或者说更换电脑、操作系统等。我们的环境都会被更改。

此时，亦可以使用git恢复备份的文件。并再通过上述几个简单的步骤安装hexo。值得注意的是，使用以前的命令若安装不成功，可以试试：

```
npm install hexo --save
```

## 主题⛺

无论是什么程序，那可能离不开主题。hexo也有很多很棒的主题，其中大部分都是开源主题。用起来也是很方便。
大红大紫的NexT应该是很多人都有了解了。找了半天也没有找到啥合适心意的主题。就决定试试这款主题了。
主题官方网站也有很完善的安装文档?[使用文档](http://theme-next.iissnan.com/getting-started.html)

### 安装与启用

开源主题，直接clone。

```
$ cd your-hexo-site
$ git clone https://github.com/iissnan/hexo-theme-next themes/next
```

亦或者使用其他方法：

```
curl -s https://api.github.com/repos/iissnan/hexo-theme-next/releases/latest | grep tarball_url | cut -d '"' -f 4 | wget -i - -O- | tar -zx -C themes/next --strip-components=1
```

ok，无论是什么方法下载下来。都会在同一个文件夹`themes/next`文件夹下。若不在，还是要主动移动到指定的文件较内。

安装完成后，可以通过修改配置文件来进行启用了。hexo很多的操作都是通过修改配置文件来实现的。虽然时修改配置文件，但是配置文件都是很人性化的，修改起来也非常的简单。并且NexT这款主题也有很完善的配置文档。

> 在 Hexo 中有两份主要的配置文件，其名称都是 _config.yml。 其中，一份位于站点根目录下，主要包含 Hexo 本身的配置；另一份位于主题目录下，这份配置由主题作者提供，主要用于配置主题相关的选项。

与其他所有hexo主题一样，启用方法都是：在站点配置文件中找到`theme`字段，如下修改：

```
theme: next
```

**完成只后推荐使用hexo clean来清除下缓存**

### 菜单

> 菜单配置包括三个部分，第一是菜单项（名称和链接），第二是菜单项的显示文本，第三是菜单项对应的图标。 NexT 使用的是 Font Awesome 提供的图标， Font Awesome 提供了 600+ 的图标，可以满足绝大的多数的场景，同时无须担心在 Retina 屏幕下 图标模糊的问题。

也就相当于我们常见的独立页面了。
编辑主题配置文件，修改如下：

设定菜单内容，对应的字段是 menu。 菜单内容的设置格式是：item name: link。其中 item name 是一个名称，这个名称并不直接显示在页面上，她将用于匹配图标以及翻译。

```
menu:
  home: / || home
  about: /about/ || user
  tags: /tags/ || tags
  categories: /categories/ || th
  archives: /archives/ || archive
  #schedule: /schedule/ || calendar
  sitemap: /sitemap.xml || sitemap
  commonweal: /404/ || heartbeat
```

这里与官方配置文档写的不同的是，随着新版的更新，配置文件也更加的方便了。上述提到的 Font Awesome图标就是在menu配置后直接写的。例如：

```
  home: / || home
```

这个`|| home`就是Font Awesome的图标名啦。
而启用这个图标也非常的简单，就在上述配置的下方就有一个开关。

```
# Enable/Disable menu icons.
menu_icons:
  enable: true
```

**除了主页与归档，其他页面都需要手动创建**

#### 创建独立页面

开启菜单的话，就需要创建一些独立页面来使用了。创建独立页面使用的就是hexo所说的“模板”了。官方文档[模板](https://hexo.io/zh-cn/docs/templates)

创建一个独立页面和创建一个新的文章的方式是一样的简单，但是使用到对应的模板创建成功后才能算是一个独立页面。

```
hexo new page about
```

使用这样的命令与创建文章的页面有什么不同呢？它也是生产一个新的`index.html`。但它会在`source`文件下创建对应的文件夹。例如：

```
$  ls source/
_posts/ about/
```

创建about页面后就会有个about文件夹。其他页面同理。

### 菜单页面

上述我们启用了主题的菜单选项，但是菜单对应的都是一个独立页面。也就是类似于about所建立的独立页面。创建方法一样。不同的是根据主题的配置。

所有的菜单的页面配置都类似，在新建好的独立页面中配置类型“type”。例如tags：

```
title: 标签
date: 2014-12-22 12:39:04
type: "tags"
---
```

或者是categories:

```
title: 分类
date: 2014-12-22 12:39:04
type: "categories"
---
```

配和上述开启所需要的菜单后，我们就能在菜单栏中打开并访问对应的页面了。虽然是修改配置文件，但是也是非常的简单呢。?

若要禁止使用评论功能：

```
comments: false
```

## CNAME

虽然GitHub送给我们了一个二级域名，但那个二级域名是需要配置自己的GitHub用户名使用的，往往我们的用户名可能就很长。本来就是二级域名了，再加上很长的域名，可能有时候自己都懒得输。

所以最佳、最方便的解决办法就是添加一个自己域名的cname解析到GitHub白送我们的域名上。
除了解析，hexo也要做相应的配置。也是非常的简单呢。

在网页的根目录下的`source/`文件下新建一个名为`CNAME`的空文件，在文件内写入我们cname过来的域名。

```
$ cat source/CNAME
defect.ink
```

**只需要写上域名就可以了，不需要戴上http等。**

## 预览

记录的虽然不是太多，也可能不是那么详细。但是还是大致的顺着搭建成功这么一个放向来的的。
所以就留下一个截图的纪念吧?

![截图纪念](https://cdn.defectink.com/2019/01/%E9%A1%B5%E9%9D%A2%E9%A2%84%E8%A7%88.webp-shuiyin)

~~图丢了~~