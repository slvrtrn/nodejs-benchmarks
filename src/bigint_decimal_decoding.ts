import { runAll } from './shared'

const N = 10_000_000

/**
 * Node.js 20 - decoding a ClickHouse Decimal64 with a scale of 8.
 * Finding the dot index is always a little bit faster.
 * ----------------------------------------
 * Average:
 * decodeBigIntDecimalWithMath: 54.03705956 nanoseconds
 * decodeBigIntDecimalWithDotIndex: 44.91615556 nanoseconds
 * decodeBigIntDecimalWithDotIndexLesserScale: 51.87891233 nanoseconds
 */
void (() => {
  function _decodeBigIntDecimalWithMath(
    src: Buffer,
    scaleMultiplier: bigint,
    loc: number = 0,
  ) {
    if (src.length < loc + 8) return null
    const fullDecimal64 = src.readBigInt64LE(loc)
    const whole = fullDecimal64 / scaleMultiplier
    const fractional = fullDecimal64 % scaleMultiplier
    return [`${whole}.${fractional}`, loc + 8]
  }

  function _decodeBigIntDecimalWithDotIndex(
    src: Buffer,
    scale: number,
    loc: number = 0,
  ) {
    if (src.length < loc + 8) return null
    const fullDecimal64 = src.readBigInt64LE(loc)
    const str = fullDecimal64.toString(10)
    if (scale >= str.length) {
      return [`0.${str}`, loc + 8]
    } else {
      const dotIndex = str.length - scale
      return [`${str.slice(0, dotIndex)}.${str.slice(dotIndex)}`, loc + 8]
    }
  }

  // Decimal64(P = 18, S = 8)
  const buf = Buffer.from(new Uint8Array([192, 248, 245, 0, 0, 0, 0, 0]))
  runAll(
    [
      function decodeBigIntDecimalWithMath() {
        return _decodeBigIntDecimalWithMath(buf, BigInt(10 ** 8))
      },
      function decodeBigIntDecimalWithDotIndex() {
        return _decodeBigIntDecimalWithDotIndex(buf, 8)
      },
      function decodeBigIntDecimalWithDotIndexLesserScale() {
        return _decodeBigIntDecimalWithDotIndex(buf, 4)
      },
    ],
    {
      total: 10,
      each: N,
    },
  )
})()
