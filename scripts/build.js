"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = require("path");

var _fsExtra = require("fs-extra");

var _child_process = require("child_process");

var CWD = (0, _fsExtra.realpathSync)(process.cwd());
var OUTPUT_PATH = (0, _path.resolve)(CWD, 'lib');
var ENTRY_PATH = (0, _path.resolve)(CWD, 'src');
var TEMPLATE_DIR_NAME = 'templates';
var CONFIG_RELATIVE_PATH = 'utils/mock_gen.default.js';
var TEMPLATE_DIR = (0, _path.resolve)(ENTRY_PATH, TEMPLATE_DIR_NAME);
var CONFIG_PATH = (0, _path.resolve)(ENTRY_PATH, CONFIG_RELATIVE_PATH);
var DEST_TEMPLATE_DIR = (0, _path.resolve)(OUTPUT_PATH, TEMPLATE_DIR_NAME);
var DEST_CONFIG_PATH = (0, _path.resolve)(OUTPUT_PATH, CONFIG_RELATIVE_PATH);

function buildSource() {
  return _buildSource.apply(this, arguments);
}

function _buildSource() {
  _buildSource = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee() {
    var args, child;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            args = [require.resolve('@babel/cli/bin/babel'), ENTRY_PATH, '--extensions', '.ts', '--out-dir', OUTPUT_PATH, '--ignore', ['./**/*.d.ts', './**/@types/*', './**/src/ts/*'].join(',')];
            child = (0, _child_process.spawn)('node', args);
            child.stderr.pipe(process.stderr);
            return _context.abrupt("return", new Promise(function (res, rej) {
              child.on('exit', function (code) {
                code ? rej() : res();
              });
            }));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _buildSource.apply(this, arguments);
}

function copyStatic() {
  return _copyStatic.apply(this, arguments);
}

function _copyStatic() {
  _copyStatic = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Promise.all([(0, _fsExtra.ensureDir)(DEST_TEMPLATE_DIR), (0, _fsExtra.ensureFile)(DEST_CONFIG_PATH)]);

          case 2:
            _context2.next = 4;
            return Promise.all([(0, _fsExtra.copy)(TEMPLATE_DIR, DEST_TEMPLATE_DIR), (0, _fsExtra.copyFile)(CONFIG_PATH, DEST_CONFIG_PATH)]);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _copyStatic.apply(this, arguments);
}

function build() {
  return _build.apply(this, arguments);
}

function _build() {
  _build = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee3() {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _fsExtra.remove)(OUTPUT_PATH);

          case 2:
            _context3.next = 4;
            return buildSource();

          case 4:
            _context3.next = 6;
            return copyStatic();

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _build.apply(this, arguments);
}

build();