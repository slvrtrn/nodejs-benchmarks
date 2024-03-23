import { runAll } from './shared'

/**
 * Math.floor vs double-tilde.
 * Node.js 20 - tilde is a bit faster.
 * ----------------------------------------
 * Average:
 * mathFloor: 3.691477318 nanoseconds
 * tilde: 3.104469141 nanoseconds
 */
void (() => {
  function mathFloor(i: number) {
    return Math.floor(i / 2)
  }

  function tilde(i: number) {
    return ~~(i / 2)
  }

  runAll([mathFloor, tilde], {
    total: 1_000,
    each: 1_000_000,
  })
})()
