// 打包命令
import { resolve } from 'path'

import { remove, realpathSync, ensureDir, ensureFile, copy, copyFile } from 'fs-extra'
import { spawn } from 'child_process'

const CWD = realpathSync(process.cwd()) // 当前运行环境

// build
const OUTPUT_PATH = resolve(CWD, 'lib')
const ENTRY_PATH = resolve(CWD, 'src')

const TEMPLATE_DIR_NAME = 'templates'
const CONFIG_RELATIVE_PATH = 'utils/mock_gen.default.js'

const TEMPLATE_DIR = resolve(ENTRY_PATH, TEMPLATE_DIR_NAME)
const CONFIG_PATH = resolve(ENTRY_PATH, CONFIG_RELATIVE_PATH)

const DEST_TEMPLATE_DIR = resolve(OUTPUT_PATH, TEMPLATE_DIR_NAME)
const DEST_CONFIG_PATH = resolve(OUTPUT_PATH, CONFIG_RELATIVE_PATH)

async function buildSource() {
  const args = [
    require.resolve('@babel/cli/bin/babel'),
    ENTRY_PATH,
    '--extensions',
    '.ts',
    '--out-dir',
    OUTPUT_PATH,
    '--ignore',
    ['./**/*.d.ts', './**/@types/*', './**/src/ts/*'].join(','),
  ].concat(process.argv.slice(2))

  const child = spawn('node', args)
  child.stderr.pipe(process.stderr)
  child.stdout.pipe(process.stdout)
  return new Promise<void>((res, rej) => {
    child.on('exit', (code) => {
      code ? rej() : res()
    })
  })
}

// 复制静态文件
async function copyStatic() {
  // copy file

  await Promise.all([ensureDir(DEST_TEMPLATE_DIR), ensureFile(DEST_CONFIG_PATH)])
  await Promise.all([
    copy(TEMPLATE_DIR, DEST_TEMPLATE_DIR),
    copyFile(CONFIG_PATH, DEST_CONFIG_PATH),
  ])
}

async function build() {
  await remove(OUTPUT_PATH)
  await buildSource()
  await copyStatic()
}

build()
