#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _commander = require("commander");

var _generator = _interopRequireDefault(require("./generator"));

// import dev from './server'
var pkg = require('../package.json');

var program = new _commander.Command();
program.version("mock-gen ".concat(pkg.version || '0.1.0')).usage('<command> [options]');
program.command('gen').option('-nt, --no-ts').option('-nm, --no-mock').option('-nf, --no-fetch').description('Generate mock file and ts file').action(_generator["default"]); // program
//   .command('dev')
//   .option('-p, --port <port>', 'server port', 4000)
//   .description('Run development server')
//   .action(dev)

program.parse();