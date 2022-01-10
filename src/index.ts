#!/usr/bin/env node

import { Command } from 'commander'
import generate from './generator'
// import dev from './server'

const pkg = require('../package.json')

const program = new Command()

program.version(`mock-gen ${pkg.version || '0.1.0'}`).usage('<command> [options]')

program
  .command('gen')
  .option('-nt, --no-ts')
  .option('-nm, --no-mock')
  .option('-nf, --no-fetch')
  .description('Generate mock file and ts file')
  .action(generate)

// program
//   .command('dev')
//   .option('-p, --port <port>', 'server port', 4000)
//   .description('Run development server')
//   .action(dev)

program.parse()
