$(document).ready(function () {
    // 通过on选择动态DOM
    // 获取焦点时修改背景动画
    $("#comments").on("focus", ".v[data-class=v] .vwrap .vedit", function () {
        $(this).animate({"background-size":"0%"});
    });
    // 失焦时添加回来
    $("#comments").on("blur", ".v[data-class=v] .vwrap .vedit", function () {
        $(this).animate({"background-size":"20%"});
    });
});
