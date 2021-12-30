// 创建 koa 服务器 并设置相应的路由参数
// 不支持多级路由

const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
const logger = require("../utils/logger");
const { unique } = require("./utils");
const { API_REQUEST_TYPE } = require("../constant");

class Server {
  app = new Koa({ env: process.env.NODE_ENV });
  router = new Router({ sensitive: true });
  constructor(port) {
    this.app.listen(port, () => {
      logger.success(`🚀 mock server at http://localhost:${port}/`);
    });
    this.app
      .use(cors({ origin: "*" })) // 设置跨域
      .use(bodyParser()) // 解析 body 参数
      .use(this.router.routes()) // 解析 router
      .use(this.router.allowedMethods());
  }

  /**
   *
   * @param {string} method 'get' | 'post' | 'del' | 'delete' | 'put' | 'header'
   * @param {string} url
   * @param {function} factory
   */
  add(_method, url, factory) {
    const method = _method.toLowerCase();

    if (!API_REQUEST_TYPE.matchKey(method)) {
      throw new Error(`no such http method: ${method}`);
    }

    const name = `${url}=${method}`;
    this.router[method](name, url, factory);

    this.router.stack = unique(this.router.stack, "name");
  }

  // 清空
  clear() {
    this.router.stack = [];
  }

  // todo
  update() {}
  // todo
  delete() {}
}
module.exports = Server;
