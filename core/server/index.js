const path = require("path");
const chokidar = require("chokidar");
const glob = require("glob");
const MockServer = require("./mock_server");
const { debounce } = require("./utils");
const logger = require("../utils/logger");

class HttpMockServerPlugin {
  constructor(_config = {}) {
    const config = { cwd: process.cwd(), ..._config };
    const mockServer = new MockServer(config);

    const create = debounce(300, this.create);

    // 监听事件
    chokidar.watch("./mock", { cwd: config.cwd }).on("all", (event) => {
      if (!["add", "change", "unlink"].includes(event)) return;
      mockServer.clear(); // 清除

      create(config.cwd, (filePath) => {
        const fullPath = path.resolve(config.cwd, filePath);

        delete require.cache[fullPath]; // 获取最新的内容
        const content = require(fullPath);
        if (content === null || typeof content !== "object") return;
        const url = filePath
          .replace(/\\/g, "/") // 抹平 platform 路径修饰符
          .replace(/\[(.*?)\]/g, ":$1") // 转义路由参数
          .replace(/^(.*?mock)|(.js)$/g, ""); // 剔除 js 后缀 与开头的 mock 前缀
        for (let [name, fn] of Object.entries(content)) {
          mockServer.add(name || "get", url, fn);
        }
      });
    });
  }

  // 创建文件
  create(cwd, callback) {
    glob("./mock/**/*.js", { cwd }, (error, matches) => {
      if (error !== null) return;
      // 需要排序 针对 有 路由参数的需要排到后面
      const dynamicList = [];
      for (const matched of matches) {
        if (/\[.*?\]/.test(matched)) dynamicList.push(matched);
        else callback(matched);
      }
      dynamicList.forEach(callback);
    });
  }

  // webpack plugin
  apply() {}
}
new HttpMockServerPlugin();
module.exports = HttpMockServerPlugin;
// 发生错误不退出进程
process.on("uncaughtException", function (err) {
  //打印出错误的调用栈方便调试
  logger.error(err.stack);
});
