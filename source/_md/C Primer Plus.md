## 数据类型

### 整型

通常`int`占用 16 位或 32 位。现在常见的设置是`long long`占 64 位，`long`占 32 位，`short`占 16 位。

```c
#include <stdio.h>

int main(void)
{
  /* 64位整数 */
  long long int decNum;

  printf("input a dec number: ");
  scanf("%lld", &decNum);
  /* 转换对应的进制 */
  printf("dec = %lld; octal = %llo, hex = %llx\n", decNum, decNum, decNum);

  return 0;
}
```

### char 类型

char 类型用于存储字符（如，字母或标点符号），从技术层面看，char 是整型。因为它存储的是整数，用来编码成对应的字符。

char 类型与字符串不同，char 使用单引号。

```c
/* 单个字符使用单引号 */
char itable = 'a';
/* 不能存储字符串 */
char name = "xfy";
```

字符串是以空字符`\0`结尾的 char 类型数组。

## 数组

### 指向多维数组的指针

指向多维数组的指针必须指向包含多个特定类型的值：

```c
int (*pz) [2]; // pz 指向一个内含两个 int 类型值的数组
```

数组的名称指向第一个元素的地址，当指针被赋值数组之后，访问指针与使用数组名相同。

```c
pz[0][0];
*pz[0];
**pz;
```

### 数组与指针

通常，字符串都作为可执行文件的一部分存储在数据段中。当把程序载入内存时，也载入了程序中的字符串。字符串储存在静态存储区（static memory）中。但是，程序在开始运行时才会为字符串数组分配内存。此时，才将字符串从拷贝到数组中。而此时，字符串有两个副本。一个是在静态内存中的字符串字面量，另一个是存储在数组中的字符串。

在数组形式中，数组名称是常量。不能更改数组名`ch`，如果改变了`ch`，则意味着改变了数组的存储位置（即地址）。可以进行类似于`ch + 1`这样的操作，标识数组的下一个元素。但是不允许进行`++ch`这样的操作。

执行形式`char* pt`也使得编译器为字符串在静态储存区预留了对应的元素空间。另外，一旦开始执行程序，它会为指针变量`pt`留出一个储存位置，并把字符串的地址存储在指针变量中。该变量最初指向该字符串的首字符，但是它的值可以改变。因此，可以对指针变量使用递增运算符。例如，使用`++pt`将指向第 2 个字符。

```c
/* addresses.c -- 打印字符串数组与指针字符串的地址 */
#include <stdio.h>
#define MSG "I am special"
int main(void)
{
	char ch[] = MSG;
	const char* pt = MSG;
	printf("addresse of MSG: %p \n", MSG);
	printf("addresse of \"I am special\": %p \n", "I am special");
	printf("addresse of ch: %p \n", ch);
	printf("addresse of pt: %p \n", pt);

	return 0;
}
```

在这段程序中，分别打印了字符串常量、数组以及指针字符串的地址。在 gcc 编译的结果后，可以看到，指针以及字符串字面量的地址都相同，而数组字符串使用了另一个地址。字符串字面量出现多次时，编译器只用了一个存储位置，而且与 MSG 相同。

```
addresse of MSG: 0x5618ff84a008
addresse of "I am special": 0x5618ff84a008
addresse of ch: 0x7ffe41c8a5fb
addresse of pt: 0x5618ff84a008
```



## 字符串输入

如果想读取一段字符串，就必须先储存该字符串的空间，然后利用字符串获取函数来获取字符串。

### 分配空间

这段代码虽然可能会通过编译，但指针 name 是未初始化的指针，name 可能指向任何地方，甚至擦写程序中的数据或代码。

```c
	char* name;
	scanf("%s", &name);
```

最简单的方法是声明时指定数组大小：

```c
char words[50];
```

### 不幸的`gets()`

`gets()`函数不会检查数组的长度，也就是它不知道数组何时会结束。如果输入的字符过长，就会导致缓冲区溢出（buffer overflow）。

在类 UNIX 系统中，会提示`Segmentation fault`。
