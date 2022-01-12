import chalk from 'chalk'

const colors = {
  info: '#2980b9',
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
}

// 日志工具
export default {
  info(text?: string, log = true) {
    const str = chalk.hex(colors.info)(text)
    if (!log) return str
    console.log(str)
  },
  success(text?: string, log = true) {
    const str = chalk.hex(colors.success)(text)
    if (!log) return str
    console.log(str)
  },
  warning(text?: string, log = true) {
    const str = chalk.hex(colors.warning)(text)
    if (!log) return str
    console.log(str)
  },
  error(text?: string, log = true) {
    const str = chalk.hex(colors.error)(text)
    if (!log) return str
    console.log(str)
  },
}
