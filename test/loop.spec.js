const { expect } = require('chai')
const LoopGuard = require('../index').default

describe('ganjiang loop protect', () => {
  const LOOP_CONFIG = {
    max_loop_time: 10000,
    max_memory_used: 1024
  }
  it('should add code', () => {
    const loopIns = new LoopGuard(LOOP_CONFIG)
    const newCodes = loopIns.instrument(`() => {
      for(let i =0 ; i< 1000; ++i) {
        console.log(i);
      }
    }`)
  })
})