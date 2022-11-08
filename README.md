# Puppeteer 截图脚本性能测试

## 脚本介绍

- screenshot.js - 从 stdin 读入需要截图的 html 代码，可以配置是否启用 JavaScript
- build.js - 批量截图 dir 中所有的 html 代码
- bench.js - 对指定 html 代码进行性能测试，可以指定是否开启 JS 和截图次数，输出的结果为平均值 

所有截图结果会保存至 `output/` 目录下

性能测试会输出 `Total` 和 `Load` 两种时间花费，他们的含义如下:

- Total: 启动浏览器实例、新建页面、加载 html、截图、关闭浏览器的总时间
- Load: 仅包含加载 html 的时间

```
Usage: screenshot [options]

Options:
  --script               Enable JavaScript (default: false)
  --time                 Output time info (default: false)
  -o, --output <string>  Output path for image (default: "output/example.png")
  -h, --help             display help for command
```

```
Usage: build [options] <dir>

Arguments:
  dir         Directory of input files

Options:
  --script    Enable JavaScript (default: false)
  -h, --help  display help for command
```

```
Usage: bench [options] <file>

Arguments:
  file                   File to bench

Options:
  --script               Enable JavaScript (default: false)
  -n, --number <number>  Times for repetition (default: "1")
  -h, --help             display help for command
```

## 测试结果

- 对每个文件执行 10 遍 `bench.js`, 对结果取平均值
- 时间以毫秒为单位
- 测试平台为Intel(R) Core(TM) i5-1038NG7 CPU @ 2.00GHz
- `test/state2/` 中的代码是没有预先执行 JS 构建 DOM 的，对这部分代码启动 JavaScript；而 `test/state3/` 中的代码是预先执行 JS 构建好 DOM 的，对这部分代码禁用 JavaScript

|编号|测试文件名        |Total(State2/State3)|Load(State2/State3)|
|----|------------------|--------------------|-------------------|
|1   |markdown.html     |5676/2497           |4954/1817          |
|2   |canvas.html       |2079/2453           |1405/1821          |
|3   |react.html        |5125/2577           |4494/1837          |
|4   |vue.html          |5234/2475           |4498/1842          |

