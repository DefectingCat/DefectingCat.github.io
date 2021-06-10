## 处理请求

每进来一个 HTTP 请求，Handler 都会为其创建一个 goroutine。默认 Handler `http.DefaulServeMux`。

`http.ListenAndServe(":4000", nil)` 第二个参数就是 Handler，为 nil 时，就是 `DefaulServeMux`。

`DefaulServeMux` 是一个 multiplexer。

### 编写 Handler

Handler 是一个 struct，它需要实现一个 `ServeHTTP()` 方法。

```go
type myHandler struct {
}

func (m *myHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	_, err := w.Write([]byte("Hello world"))
	if err != nil {
		return
	}
}
```

注册一个 Handler 到 multiplexer 需要使用 `http.Handle`

```go
	http.Handle("/hello", &mh)
	http.Handle("/about", &a)
```

