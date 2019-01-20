import * as babelParser from '@babel/parser'
import * as babelType from '@babel/types'
import babelTraverse from '@babel/traverse'
import babelGenerator from '@babel/generator'
import { CHECK_FUNC_CODES, LOOP_TYPES } from './loop-guard-codes'

// 默认3万次
const DEFAULT_LOOP_TIME = 30000

// 1024MB = 1GB
const DEFAULT_MEMORY_USAGE = 1024

class LoopGuard {
  constructor({ max_loop_time = DEFAULT_LOOP_TIME, max_memory_used = DEFAULT_MEMORY_USAGE } = {}) {
    this.maxLoopTime = max_loop_time
    this.maxMemoryUsed = max_memory_used
  }

  checkTypeFun(type) {
    const tpl = CHECK_FUNC_CODES[type]
    const ast = babelParser.parse(tpl)
    return ast.program.body[0]
  }

  execTypeCheck(type, index) {
    const tpl = `
    __${type}${index}();
  `
    const ast = babelParser.parse(tpl)
    return ast.program.body[0]
  }

  newTypeCheck(type, loopType, index, count, line) {
    const tpl = `
      let __${type}${index} =  __${type}_Guard__('${loopType}', ${count}, ${line});
    `
    const ast = babelParser.parse(tpl)
    return ast.program.body[0]
  }

  instrument(code) {
    const ast = babelParser.parse(code, {
      sourceType : 'script',
      plugins    : ['objectRestSpread', 'optionalChaining', 'bigInt', 'optionalCatchBinding', 'throwExpressions'],
    })
    let loopIndex = 0
    const asyncFuncExpression = ast.program.body[0].expression
    // const isAsyncFunc = babelType.isArrowFunctionExpression(asyncFuncExpression, { async: true })
    // if (!isAsyncFunc) throw new Error('IS_NOT_ASYNC_FUNC_ERROR: expression is not valid async function, check the code')
    if (!asyncFuncExpression.body.body) return code
    let hasAddGlobalCheckFunc = false
    babelTraverse(ast, {
      enter : path => {
        const { node } = path
        let loopType = null
        if (babelType.isForStatement(node)) {
          // for
          loopType = 'For-Loop'
        } else if (babelType.isWhileStatement(node)) {
          // while
          loopType = 'While-Loop'
        }
        if (loopType) {
          if (!hasAddGlobalCheckFunc) {
            asyncFuncExpression.body.body.unshift(this.checkTypeFun(LOOP_TYPES.LoopTime))
            asyncFuncExpression.body.body.unshift(this.checkTypeFun(LOOP_TYPES.MemoryUsage))
            hasAddGlobalCheckFunc = true
          }
          path.container.splice(path.key, 0, this.newTypeCheck(LOOP_TYPES.LoopTime, loopType, loopIndex, this.maxLoopTime, node.loc.start.line))
          path.container.splice(path.key, 0, this.newTypeCheck(LOOP_TYPES.MemoryUsage, loopType, loopIndex, this.maxMemoryUsed, node.loc.start.line))
          node.body.body.push(this.execTypeCheck(LOOP_TYPES.MemoryUsage, loopIndex))
          node.body.body.push(this.execTypeCheck(LOOP_TYPES.LoopTime, loopIndex))
          loopIndex++
        }
      },
    })
    const out = babelGenerator(ast, {
      retainLines : true,
      quotes      : 'single',
      minified    : true,
    })
    const minifiedCodes = out.code
    return minifiedCodes.charAt(minifiedCodes.length - 1) === ';' ? minifiedCodes.slice(0, minifiedCodes.length - 1) : minifiedCodes
  }
}

export default LoopGuard
