const chalk = require("chalk");
const colors = {
  info: "#2980b9",
  success: "#2ecc71",
  warning: "#f39c12",
  error: "#e74c3c",
};

// 日志工具
module.exports = {
  info(text, log = true) {
    const str = chalk.hex(colors.info)(text);
    if (!log) return str;
    console.log(str);
  },
  success(text, log = true) {
    const str = chalk.hex(colors.success)(text);
    if (!log) return str;
    console.log(str);
  },
  warning(text, log = true) {
    const str = chalk.hex(colors.warning)(text);
    if (!log) return str;
    console.log(str);
  },
  error(text, log = true) {
    const str = chalk.hex(colors.error)(text);
    if (!log) return str;
    console.log(str);
  },
};
