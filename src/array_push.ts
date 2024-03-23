import { runAll } from './shared'

const N = 10_000

/**
 * Despite push being heavily optimized, setting by index is _still_ faster.
 * Node.js 20:
 * ----------------------------------------
 * Average:
 * arrayPush: 28148.41035 nanoseconds
 * arraySetByIndex: 9181.75035 nanoseconds
 */
void (() => {
  function arrayPush() {
    const arr: any[] = []
    for (let i = 0; i < N; i += 1) {
      arr.push(i)
    }
    return arr
  }

  function arraySetByIndex() {
    const arr = new Array(N)
    for (let i = 0; i < N; i += 1) {
      arr[i] = i
    }
    return arr
  }

  runAll([arrayPush, arraySetByIndex], {
    total: 10,
    each: 10_000,
  })
})()
