/** Benchmark various primitive operations on the current runtime versions.
 *  Inspired by https://stackoverflow.com/a/37037034/4575540. */

type Strategy = (i: number) => any

export function run(
  strategy: Strategy,
  iterations: number = 10_000_000,
  log: boolean = true,
): number {
  const start = process.hrtime() // [seconds, nanoseconds]
  for (let i = 0; i < iterations; i += 1) {
    strategy(i).length
  }
  const end = process.hrtime(start) // [seconds, nanoseconds] since `start`
  const elapsedMillis = end[0] * 1e9 + end[1]
  if (log) {
    console.log(`${strategy.name} completed in ${elapsedMillis} ns`)
  }
  return elapsedMillis
}

export function runAll(
  strategies: Array<Strategy>,
  iterations?: {
    total: number
    each: number
  },
) {
  const iterationsTotal = iterations?.total ?? 10
  const iterationsEach = iterations?.each ?? 10_000_000
  const results: Record<string, number> = {}
  for (let i = 0; i < iterationsTotal; i++) {
    for (const s of strategies) {
      const totalElapsed = results[s.name] ?? 0
      results[s.name] = run(s, iterationsEach, false) + totalElapsed
    }
  }
  console.log('----------------------------------------')
  console.log('Average:')
  for (const [name, totalElapsed] of Object.entries(results)) {
    console.log(
      `${name}: ${totalElapsed / (iterationsTotal * iterationsEach)} nanoseconds`,
    )
  }
}
