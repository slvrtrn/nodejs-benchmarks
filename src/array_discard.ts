import { runAll } from './shared'

const N = 100_000

/**
 * Node.js 20 - assigning an empty array is slightly faster than length = 0.
 * ----------------------------------------
 * Average:
 * arrayLength: 26.1026754 nanoseconds
 * arraySetEmpty: 7.0424808 nanoseconds
 */
void (() => {
  function _arrayLength(arr: number[]) {
    return function arrayLength() {
      arr.length = 0
      return arr
    }
  }

  function _arraySetEmpty(arr: number[]) {
    return function arraySetEmpty() {
      arr = []
      return arr
    }
  }

  function getArray() {
    const arr = new Array(N)
    for (let i = 0; i < N; i += 1) {
      arr[i] = i + 1
    }
    return arr
  }

  runAll([_arrayLength(getArray()), _arraySetEmpty(getArray())], {
    total: 100,
    each: 100_000,
  })
})()
