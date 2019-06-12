const { expect } = require('chai')
const LoopGuard = require('../index').default

describe('ganjiang loop protect', () => {
  const LOOP_CONFIG = {
    max_loop_time: 10000,
    max_memory_used: 1024
  }
  it('should add code to for loop', () => {
    const loopIns = new LoopGuard(LOOP_CONFIG)
    const newCodes = loopIns.instrument(`() => {
      for(let i =0 ; i< 1000; ++i) {
        console.log(i);
      }
    }`)
    const forLoopProtectCodes = '()=>{\nlet __MemoryUsage0=__MemoryUsage_Guard__("For-Loop",1024,2);let __LoopTime0=__LoopTime_Guard__("For-Loop",10000,2);function __MemoryUsage_Guard__(type,memory,line){\nreturn function(){\nconst used=context.memoryUsage();\nconst usedHeap=Math.round(used.heapUsed/1024/1024*100)/100;\nif(usedHeap>memory){\nconst usedMemory={};\nfor(let key in used){\nusedMemory[key]=`${Math.round(used[key]/1024/1024*100)/100} MB`;\n}\nconst msg=`${type} loop may be leak at line ${line}, it used ${JSON.stringify(usedMemory,null,2)} memory more than ${memory} MB, please check the loop whether it\'s infinite`;\nconst error=new Error(msg);\nerror.code="MAX_MEMORY_LIMIT_ERROR";\nerror.message=msg;\nthrow error;\n}\n};\n}function __LoopTime_Guard__(type,count,line){let c=0;return function(){c++;if(c>=count){const msg=`${type} loop may be infinite at line ${line}, it already been executed more than ${count} times, please check the loop whether it\'s infinite`;const error=new Error(msg);error.code="MAX_LOOP_TIME_ERROR";error.message=msg;throw error}}}for(let i=0;i<1000;++i){console.log(i);__MemoryUsage0();__LoopTime0()}}'
    expect(newCodes).to.be.equal(forLoopProtectCodes)
  })
  it('should add code to while loop', () => {
    const loopIns = new LoopGuard(LOOP_CONFIG)
    const newCodes = loopIns.instrument(`() => {
      while(true) {
        console.log(i);
      }
    }`)
    const whileLoopProtectCodes = '()=>{\nlet __MemoryUsage0=__MemoryUsage_Guard__("While-Loop",1024,2);let __LoopTime0=__LoopTime_Guard__("While-Loop",10000,2);function __MemoryUsage_Guard__(type,memory,line){\nreturn function(){\nconst used=context.memoryUsage();\nconst usedHeap=Math.round(used.heapUsed/1024/1024*100)/100;\nif(usedHeap>memory){\nconst usedMemory={};\nfor(let key in used){\nusedMemory[key]=`${Math.round(used[key]/1024/1024*100)/100} MB`;\n}\nconst msg=`${type} loop may be leak at line ${line}, it used ${JSON.stringify(usedMemory,null,2)} memory more than ${memory} MB, please check the loop whether it\'s infinite`;\nconst error=new Error(msg);\nerror.code="MAX_MEMORY_LIMIT_ERROR";\nerror.message=msg;\nthrow error;\n}\n};\n}function __LoopTime_Guard__(type,count,line){let c=0;return function(){c++;if(c>=count){const msg=`${type} loop may be infinite at line ${line}, it already been executed more than ${count} times, please check the loop whether it\'s infinite`;const error=new Error(msg);error.code="MAX_LOOP_TIME_ERROR";error.message=msg;throw error}}}while(true){console.log(i);__MemoryUsage0();__LoopTime0()}}'
    expect(newCodes).to.be.equal(whileLoopProtectCodes)
  })
})