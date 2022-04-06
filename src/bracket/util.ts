export const POWERS_OF_TWO = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536]

export function NearestPow2(v: number): number {
  if (v === 0) return 2
  if (POWERS_OF_TWO.includes(v)) {
    return v
  }
  if (v > Math.pow(2, 16)) {
    throw new Error('Provided value is out of range. Value must be lower than 65536')
  }

  /* tslint:disable:no-bitwise */
  v--
  v |= v >> 1
  v |= v >> 2
  v |= v >> 4
  v |= v >> 8
  /* tslint:enable:no-bitwise */
  v++
  return v
}
