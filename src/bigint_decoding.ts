import { Buffer } from 'buffer'
import { runAll } from './shared'

/**
 * Node.js 20 - Node.js Buffer is faster.
 * ----------------------------------------
 * Average:
 * readBytes: 81.7604555 nanoseconds
 * readFromBuffer: 28.7395374 nanoseconds
 */
void (() => {
  function _readBytesAsUnsignedBigInt(
    src: Uint8Array,
    loc: number = 0,
    bytes: 8 | 16 | 32 = 8, // (U)Int64 | (U)Int128 | (U)Int256
  ): bigint {
    let result = 0n
    for (let i = bytes - 1; i >= 0; i--) {
      result = (result << 8n) + BigInt(src[loc + i])
    }
    return result
  }

  function _readFromBuffer(src: Buffer, loc: number = 0): bigint {
    return src.readBigInt64LE(loc)
  }

  const buf = Buffer.from(
    new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]),
  )
  runAll(
    [
      function readBytes() {
        return _readBytesAsUnsignedBigInt(buf)
      },
      function readFromBuffer() {
        return _readFromBuffer(buf)
      },
    ],
    {
      total: 10,
      each: 1_000_000,
    },
  )
})()
