import type { EncodedImageData } from 'react-native-nitro-image'

export type ExifOrientation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type FixtureColor = 'red' | 'green' | 'blue' | 'yellow'

export interface ExifOrientationCase {
  orientation: ExifOrientation
  name: string
  width: number
  height: number
  corners: readonly [FixtureColor, FixtureColor, FixtureColor, FixtureColor]
}

export const STORED_WIDTH = 120
export const STORED_HEIGHT = 80

/**
 * The JPEG's stored pixels are four solid quadrants:
 *
 * red   | green
 * blue  | yellow
 *
 * `corners` describes the logical top-left, top-right, bottom-left, and
 * bottom-right colors after applying each EXIF orientation.
 */
export const EXIF_ORIENTATION_CASES: readonly ExifOrientationCase[] = [
  {
    orientation: 1,
    name: 'up',
    width: 120,
    height: 80,
    corners: ['red', 'green', 'blue', 'yellow'],
  },
  {
    orientation: 2,
    name: 'up mirrored',
    width: 120,
    height: 80,
    corners: ['green', 'red', 'yellow', 'blue'],
  },
  {
    orientation: 3,
    name: 'down',
    width: 120,
    height: 80,
    corners: ['yellow', 'blue', 'green', 'red'],
  },
  {
    orientation: 4,
    name: 'down mirrored',
    width: 120,
    height: 80,
    corners: ['blue', 'yellow', 'red', 'green'],
  },
  {
    orientation: 5,
    name: 'left mirrored',
    width: 80,
    height: 120,
    corners: ['red', 'blue', 'green', 'yellow'],
  },
  {
    orientation: 6,
    name: 'right',
    width: 80,
    height: 120,
    corners: ['blue', 'red', 'yellow', 'green'],
  },
  {
    orientation: 7,
    name: 'right mirrored',
    width: 80,
    height: 120,
    corners: ['yellow', 'green', 'blue', 'red'],
  },
  {
    orientation: 8,
    name: 'left',
    width: 80,
    height: 120,
    corners: ['green', 'yellow', 'red', 'blue'],
  },
]

// A 120x80 JPEG with an EXIF orientation entry and the quadrant pattern above.
// Keeping it inline gives every Harness runner the exact same encoded bytes.
const JPEG_BASE64 = [
  '/9j/4AAQSkZJRgABAQAASABIAAD/4QBYRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAA',
  'AAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAeKADAAQAAAABAAAAUAAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklN',
  'BAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAUAB4AwEiAAIRAQMRAf/EAB8AAAEFAQEB',
  'AQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGh',
  'CCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6',
  'g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz',
  '9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMR',
  'BAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZX',
  'WFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT',
  '1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgICAgICAwICAgIDBAMDAwMDBAUEBAQEBAQF',
  'BQUFBQUFBQYGBgYGBgcHBwcHCAgICAgICAgICP/bAEMBAQEBAgICAwICAwgFBQUICAgICAgICAgICAgICAgICAgI',
  'CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICP/dAAQACP/aAAwDAQACEQMRAD8A/Oeiiiv85z/tICiiigAo',
  'oooAK+xP2Tf+Y/8A9uP/ALXr47r7E/ZN/wCY/wD9uP8A7Xr4fxI/5EuI/wC3f/S4n+Rv7dr/AJRU43/7kf8A1ZYM',
  '+xKKKK/lc/8AOpCiiigAooooAKKKKAP/0Pznooor/Oc/7SAooooAKKKKACvsT9k3/mP/APbj/wC16+O6+xP2Tf8A',
  'mP8A/bj/AO16+H8SP+RLiP8At3/0uJ/kb+3a/wCUVON/+5H/ANWWDPsSiiiv5XP/ADqQooooAKKKKACiiigD/9H8',
  '56K/Meiv9GP+KAf/AFXf/lh/9+n+sH/Fbv8A6ov/AMvf/vQ/TiivzHoo/wCKAf8A1Xf/AJYf/fof8Vu/+qL/APL3',
  '/wC9D9OKK/Meij/igH/1Xf8A5Yf/AH6H/Fbv/qi//L3/AO9D9OK+xP2Tf+Y//wBuP/tevwDr+lj/AIN3/wDmr/8A',
  '3Kn/ALlq/hj9pR+yi/4g14KcR+JP+tP176j9W/c/VfY8/tsXQw/8T6zV5eX2vP8Aw5X5eXS91/OH0t/p2/8AEwnh',
  '7mvhB/Yf9mf2l7L/AGj2/wBY9n9Xr0sV/B9jQ5+f2HJ/Fjy83N73Lyv2iiv3wor/AJSv+I/f9QH/AJU/+0P8Uv8A',
  'ikH/ANVZ/wCWn/30fgfRX74UUf8AEfv+oD/yp/8AaB/xSD/6qz/y0/8Avo/A+iv3woo/4j9/1Af+VP8A7QP+KQf/',
  'AFVn/lp/99H4H0V++FFH/Efv+oD/AMqf/aB/xSD/AOqs/wDLT/76P//S/mvooor/ALSD+dwooooAKKKKACv6WP8A',
  'g3f/AOav/wDcqf8AuWr+aev6WP8Ag3f/AOav/wDcqf8AuWr/ABp/0gj/AJRE49/7kP8A1Z4I/VPBP/kp8F/2/wD+',
  'm5n9LFFFFf8Amen9+BRRRQAUUUUAFFFFAH//0/5r6KKK/wC0g/ncKKKKACiiigAr+lj/AIN3/wDmr/8A3Kn/ALlq',
  '/mnr+lj/AIN3/wDmr/8A3Kn/ALlq/wAaf9II/wCUROPf+5D/ANWeCP1TwT/5KfBf9v8A/puZ/SxRRRX/AJnp/fgU',
  'UUUAFFFFABRRRQB//9k=',
].join('')

const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const ORIENTATION_ENTRY_PREFIX = [0x01, 0x12, 0x00, 0x03, 0, 0, 0, 1]

function decodeBase64(value: string): Uint8Array {
  const bytes: number[] = []
  let accumulator = 0
  let bitCount = 0

  for (const character of value) {
    if (character === '=') break

    const decoded = BASE64_ALPHABET.indexOf(character)
    if (decoded < 0) {
      throw new Error(`Invalid Base64 character: ${character}`)
    }

    accumulator = (accumulator << 6) | decoded
    bitCount += 6

    if (bitCount >= 8) {
      bitCount -= 8
      bytes.push((accumulator >> bitCount) & 0xff)
      accumulator &= (1 << bitCount) - 1
    }
  }

  return Uint8Array.from(bytes)
}

function findSequence(bytes: Uint8Array, sequence: readonly number[]): number {
  const finalStart = bytes.length - sequence.length
  for (let start = 0; start <= finalStart; start++) {
    let matches = true
    for (let offset = 0; offset < sequence.length; offset++) {
      if (bytes[start + offset] !== sequence[offset]) {
        matches = false
        break
      }
    }
    if (matches) return start
  }
  return -1
}

export function makeExifOrientationJpeg(
  orientation: ExifOrientation,
): EncodedImageData {
  const bytes = decodeBase64(JPEG_BASE64)
  const entryOffset = findSequence(bytes, ORIENTATION_ENTRY_PREFIX)
  if (entryOffset < 0) {
    throw new Error('EXIF orientation entry is missing from the JPEG fixture')
  }

  // The fixture's TIFF data is big-endian. A SHORT value is stored in the first
  // two bytes of the four-byte value field immediately following the entry.
  bytes[entryOffset + 8] = 0
  bytes[entryOffset + 9] = orientation

  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)

  return {
    buffer,
    width: STORED_WIDTH,
    height: STORED_HEIGHT,
    imageFormat: 'jpg',
  }
}
