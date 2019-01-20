
const LOOP_TYPES = {
  LoopTime    : 'LoopTime',
  MemoryUsage : 'MemoryUsage',
}

const CHECK_FUNC_CODES = {
  [LOOP_TYPES.LoopTime] : `
    function __LoopTime_Guard__(type, count, line) {
      let c = 0;
      return function () {
        c ++;
        if (c >= count) {
          const msg = \`\${type} loop may be infinite at line \${line}, it already been executed more than \${count} times, please check the loop whether it's infinite\`
          const error = new Error(msg)
          error.code = 'MAX_LOOP_TIME_ERROR'
          error.message = msg
          throw error;
        }
      }
    }
  `,
  [LOOP_TYPES.MemoryUsage] : `
    function __MemoryUsage_Guard__(type, memory, line) {
      return function () {
        const used = context.memoryUsage()
        const usedHeap = Math.round(used.heapUsed / 1024 / 1024 * 100) / 100
        if(usedHeap > memory) {
          const usedMemory = {}
          for (let key in used) {
            usedMemory[key] = \`\${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\`
          }
          const msg = \`\${type} loop may be leak at line \${line}, it used \${JSON.stringify(usedMemory, null, 2)} memory more than \${memory} MB, please check the loop whether it's infinite\`
          const error = new Error(msg)
          error.code = 'MAX_MEMORY_LIMIT_ERROR'
          error.message = msg
          throw error
        }
      }
    }
  `,
}

export {
  LOOP_TYPES,
  CHECK_FUNC_CODES,
}
