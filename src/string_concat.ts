import { runAll } from './shared'

/**
 * Concat vs template string.
 * Node.js 20 - no significant difference.
 * ----------------------------------------
 * Average:
 * strConcat: 22.80909239 nanoseconds
 * strTemplate: 22.41539654 nanoseconds
 */
void (() => {
  function strConcat(i: number) {
    return 'abc' + i + 'def'
  }

  function strTemplate(i: number) {
    return `abc${i}def`
  }

  runAll([strConcat, strTemplate])
})()
