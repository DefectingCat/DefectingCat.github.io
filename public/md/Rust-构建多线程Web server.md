在大部分现代操作系统中，已执行程序的代码在一个 **进程**（*process*）中运行，操作系统则负责管理多个进程。在程序内部，也可以拥有多个同时运行的独立部分。运行这些独立部分的功能被称为 **线程**（*threads*）。

很多编程语言提供了自己特殊的线程实现。编程语言提供的线程被称为 **绿色**（*green*）线程，使用绿色线程的语言会在不同数量的 OS 线程的上下文中执行它们。为此，绿色线程模式被称为 *M:N* 模型：`M` 个绿色线程对应 `N` 个 OS 线程，这里 `M` 和 `N` 不必相同。

每一个模型都有其优势和取舍。对于 Rust 来说最重要的取舍是运行时支持。绿色线程的 M:N 模型需要更大的语言运行时来管理这些线程。Rust 是追求性能的语言，所以，Rust 标准库只提供了 1:1 线程模型实现。但 Rust 也是较为底层的语言，如果愿意牺牲性能来换取抽象，以获得对线程运行更精细的控制及更低的上下文切换成本，可以使用实现了 M:N 线程模型的 crate。

## 单线程的 web server

web server 中涉及到的两个主要协议是 **超文本传输协议**（*Hypertext Transfer Protocol*，*HTTP*）和 **传输控制协议**（*Transmission Control Protocol*，*TCP*）。这两者都是 **请求-响应**（*request-response*）协议，也就是说，有 **客户端**（*client*）来初始化请求，并有 **服务端**（*server*）监听请求并向客户端提供响应。请求与响应的内容由协议本身定义。

### 监听 TCP 连接

HTTP 是基于 TCP 的协议，所以我们的 Web 服务器第一件事就是需要监听 TCP 连接。

```rust
use std::net::TcpListener;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();

    for stream in listener.incoming() {
        let stream = stream.unwrap();

        println!("Connection established!");
    }
}
```

标准库为我们提供了 `TcpListener`，它可以直接绑定一个地址与端口，并返回一个 `Result<T, E>`。因为端口的监听有可能会失败（管理员权限、端口被占用等）。

`TcpListener` 的 `incoming` 方法返回一个迭代器，它提供了一系列的流（更准确的说是 `TcpStream` 类型的流）。**流**（*stream*）代表一个客户端和服务端之间打开的连接。**连接**（*connection*）代表客户端连接服务端、服务端生成响应以及服务端关闭连接的全部请求 / 响应过程。为此，`TcpStream` 允许我们读取它来查看客户端发送了什么，并可以编写响应。总体来说，这个 `for` 循环会依次处理每个连接并产生一系列的流供我们处理。

既然它返回一个迭代器，所以还可以使用偏函数式的写法：

```rust
listener
    .incoming()
    .for_each(|stream| { 
        stream.unwrap(); 
        println!("Connection established!");
    });
```

现在打开浏览器或者使用其他工具访问 `http://127.0.0.1:7878` 就能够看到 Rust 打印的 `Connection established!`。

不过我们还收不到任何回应，因为我们还没有添加任何响应。

## handle 方法

我们还需要添加一个用于处理客户端发送过来的请求的处理方法

```rust
fn handle_connection(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    stream.read(&mut buffer).unwrap();
    println!("Request: {}", String::from_utf8_lossy(&buffer[..]));
}
```

在 `handle_connection` 中，`stream` 参数是可变的。这是因为 `TcpStream` 实例在内部记录了所返回的数据。它可能读取了多于我们请求的数据并保存它们以备下一次请求数据。因此它需要是 `mut` 的因为其内部状态可能会改变；通常我们认为 “读取” 不需要可变性，不过在这个例子中则需要 `mut` 关键字。

接下来，需要实际读取流。这里分两步进行：首先，在栈上声明一个 `buffer` 来存放读取到的数据（这里 1024 字节的缓冲区已经足够，如果希望处理任意大小的请求，缓冲区管理将更为复杂）。接着将缓冲区传递给 `stream.read` ，它会从 `TcpStream` 中读取字节并放入缓冲区中。

> `String::from_utf8_lossy` 函数获取一个 `&[u8]` 并产生一个 `String`。函数名的 “lossy” 部分来源于当其遇到无效的 UTF-8 序列时的行为：它使用 `�`。

现在在每个流的迭代中都使用该方法：

```rust
listener
    .incoming()
    .for_each(|stream| handle_connection(stream.unwrap())));
```

再次访问我们的 web server，就应该能看到请求头了：

```bash
Request: GET / HTTP/1.1
Host: 127.0.0.1:7878
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101
Firefox/52.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
Upgrade-Insecure-Requests: 1
```

### 添加响应

HTTP 第一行叫做 **状态行**（*status line*），它包含响应的 HTTP 版本、一个数字状态码用以总结请求的结果和一个描述之前状态码的文本原因短语。CRLF 序列之后是任意 header，另一个 CRLF 序列，和响应的 body。

这里是一个使用 HTTP 1.1 版本的响应例子，其状态码为 200，原因短语为 OK，没有 header，也没有 body：

```
HTTP/1.1 200 OK\r\n\r\n
```

这是一个超级微型的响应，让我们将这个响应发送回客户端

```rust
fn handle_connection(mut stream: TcpStream) {
    let mut buffer = [0; 1024];

    stream.read(&mut buffer).unwrap();

    let response = "HTTP/1.1 200 OK\r\n\r\n";

    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
```

`stream.read()` 方法用于将请求数据写入到指定的缓冲区，而 `stream.write()` 方法则用于将指定的字节返回给客户端。

因为 `stream` 的 `write` 方法获取一个 `&[u8]` 并直接将这些字节发送给连接，所以需要在 `response` 上调用 `as_bytes`。

现在再次用浏览器访问我们的 web server 就可以得到一个空的页面，而不是错误。太棒了！我们刚刚手写了一个 HTTP 请求与响应。

### 验证请求并有选择的进行响应

这里就不进行读取 HTML 文件的操作了，我们将直接返回 JSON。目前我们的服务器将响应任何请求，并且返回的都是同一个东西。我们将根据请求头来做一个简单的判断，添加一个简单的路由！

由于 `buffer` 是 1024 字节的数组，所以我们的判断条件也需要是字节。好在 Rust 有更方便的写法：

```rust
let get = b"GET / HTTP/1.1\r\n";
let sleep = b"GET /sleep HTTP/1.1\r\n";
```

这个时候我们的 `get` 与 `sleep` 应该分别是 `&[u8; 16]` 和 `&[u8; 21]` 的数组。非常棒，接下来将请求来的缓冲区与其做对比即可：

```rust
if buffer.starts_with(get) {}
```
