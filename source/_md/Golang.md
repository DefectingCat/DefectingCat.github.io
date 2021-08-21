## 修改字符串

字符串底层是由字节组成的切片，但字符串本身是不可变的。修改字符串有两种方法：

1. 将其转换为 byte 切片

```go
	str := "xfy"
	s := []byte(str)
	s[0] = 'd'
	str = string(s)

	fmt.Println(str)
```

但这种方法不能处理中文，因为一个中文字符占 3 个 byte。不能只对某一个 byte 进行赋值。

2. 将其转换为 rune 切片

```go
	str := "小肥羊"
	s := []rune(str)
	s[0] = '大'
	str = string(s)

	fmt.Println(str)
```

rune 表示单个 Unicode 字符串，是按字符进行处理的，可以修改单个字符。

## 结构体赋值

给指针字段赋值时，可以省略解引用的星号：

```go
func main() {
	type Cat struct {
		name  string
		age   int
		color string
	}

	myCat := Cat{
		"xfy",
		1,
		"cows",
	}

	fmt.Println(myCat)

	var c3 *Cat = new(Cat)
	c3.name = "test" // Equal to (*c3).name = "test"
}
```

