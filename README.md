# GanJiang Loop Protect

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/dff0b2ee1b964d2d88fe6947c4f5c649)](https://app.codacy.com/app/taozhi8833998/loop-protect?utm_source=github.com&utm_medium=referral&utm_content=taozhi8833998/loop-protect&utm_campaign=Badge_Grade_Dashboard)
[![](https://img.shields.io/badge/Powered%20by-ganjiang-brightgreen.svg)](https://github.com/taozhi8833998/loop-protect)
[![Build Status](https://travis-ci.org/taozhi8833998/loop-protect.svg?branch=master)](https://travis-ci.org/taozhi8833998/loop-protect)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/taozhi8833998/loop-protect/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/js-loop-protect.svg)](https://badge.fury.io/js/js-loop-protect)
[![NPM downloads](http://img.shields.io/npm/dm/js-loop-protect.svg?style=flat-square)](http://www.npmtrends.com/js-loop-protect)
[![Coverage Status](https://coveralls.io/repos/github/taozhi8833998/loop-protect/badge.svg?branch=master)](https://coveralls.io/github/taozhi8833998/loop-protect?branch=master)
[![Dependencies](https://img.shields.io/david/taozhi8833998/loop-protect.svg)](https://img.shields.io/david/taozhi8833998/loop-protect)
[![Known Vulnerabilities](https://snyk.io/test/github/taozhi8833998/loop-protect/badge.svg?targetFile=package.json)](https://snyk.io/test/github/taozhi8833998/loop-protect?targetFile=package.json)
[![issues](https://img.shields.io/github/issues/taozhi8833998/loop-protect.svg)](https://github.com/taozhi8833998/loop-protect/issues)

**Parse simple SQL statements into an abstract syntax tree (AST) with the visited tableList and convert it back to SQL.**

## :star: Features

  - support for loop protect
  - support white loop protect

## :rocket: Usage

### Loop Guard

```javascript
const LoopGuard = require('js-loop-protect').default
const loopGuardIns = new LoopGuard({
  max_loop_time: 10000, // 最多循环1w次
  max_memory_used: 1024 // 内存使用量最大1G 单位是MB
})
const func = `async () => {
  for(let i = 0; i < 100001; ++i) {
    // process your business
    console.log(i)
  }
}
`
const guardCodes = loopGuardIns.instrument(func)
console.log('guardCodes = ', guardCodes)
```

## License

[MIT](LICENSE)
