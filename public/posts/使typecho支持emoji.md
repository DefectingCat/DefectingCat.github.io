---
title: 使 typecho 支持 emoji🎈
date: 2019-05-12 13:41:57
tags: typecho
categories: 实践
url: make-typecho-support-the-emoji
index_img: /images/使typecho支持emoji/1118031526.webp
---

## Emoji？

emoji是我们身边常见的且神奇的表情符号，它被称为绘文字（えもじ *emoji*）。最初是日本在无线通信中所使用的视觉情感符号。与我们常发的表情包不同的是，它并不是图片。

Emoji的编码是Unicode字符集中的一部分，特定形象的Emoji表情符号对应到特定的Unicode字节。也就是说emoji是unicode编码。好处是无论在什么地方使用都不像是图片那么难处理，以及可以直接写在数据库内。

![emoji_unicode.webp][1]

### 词语发音

絵文字/えもじ（emoji）的发音是 /emoꜜdʑi/（此处为国际音标）。 [2] 

- /e/：即汉语拼音 y**e**中**ê**的发音，英语单词 b**e**d 中**e**的发音。
- /dʑ/：与汉语拼音 j 对应的浊音。与潮州话拼音方案的 r 相似，如潮州话“字”（ri⁷）字的声母。 [3] 
- /mo/ 为重读音节。

在英语中，emoji 常被读作 /ɪˈmoʊdʒi/。 

## 在typecho中使用emoji

现在多数的软件、网站等都已经广泛的支持emoji表情了。自己也是非常的喜欢这类表情，特别喜欢微软家的，那种扁平的风格真的很招人喜爱。

![1557663679707.webp][2]

但是最近使用typecho的时候遇到点小问题，发现新安装的typecho居然不支持使用emoji。在文章等页面使用了emoji之后，保存会提示数据库查询错误。

这是因为数据库默认使用的是`utf8`编码，在`utf8`的编码中最多只支持3个字节，而我们可爱的emoji是4个字节，如上述所说的，emoji并非图片，是直接存储在数据库内的。所以就出现了数据库查询错误导致无法使用emoji的问题。

### 修改数据库

解决办法也非常的简单，我们直接使用phpMyAdmin或者sql，修改数据库`charset`为`utf8mb4`就ok了

```
alter table typecho_comments convert to character set utf8mb4 collate utf8mb4_unicode_ci;
alter table typecho_contents convert to character set utf8mb4 collate utf8mb4_unicode_ci;
alter table typecho_fields convert to character set utf8mb4 collate utf8mb4_unicode_ci;
alter table typecho_metas convert to character set utf8mb4 collate utf8mb4_unicode_ci;
alter table typecho_options convert to character set utf8mb4 collate utf8mb4_unicode_ci;
alter table typecho_relationships convert to character set utf8mb4 collate utf8mb4_unicode_ci;
alter table typecho_users convert to character set utf8mb4 collate utf8mb4_unicode_ci;
```

如果有没有涉及的表，按照同样的语句修改就可以了。

修改后就可以看到表的‘排序规则’(charset)为可以使用emoji的`utf8mb4`了。

![2019-05-12T12:27:33.webp][3]

### 修改typecho配置文件

当数据库修改完成之后，到typecho的目录下找到其配置文件`config.inc.php`。并且修改为刚刚设置编码就ok了

```
$db->addServer(array (
    'host'      =>  localhost,
    'user'      =>  'root',
    'password'  =>  'my_password',
    'charset'   =>  'utf8mb4', //修改这一行
    'port'      =>  3306,
    'database'  =>  '喵喵喵'
)
```

全部修改完成后就能正常的在typecho中使用emoji了

![2019-05-12T12:31:18.webp][4]



[1]: ../images/使typecho支持emoji/2721696195.webp
[2]: ../images/使typecho支持emoji/1431864746.webp
[3]: ../images/使typecho支持emoji/175217384.webp
[4]: ../images/使typecho支持emoji/4188132525.webp