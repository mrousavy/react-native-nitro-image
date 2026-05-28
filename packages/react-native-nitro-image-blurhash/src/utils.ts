// Some functions from the BlurHash JS implementation that are used for light
// tasks (such as getting the average color or validating a BlurHash string).

import type { Color } from 'react-native-nitro-image'

function sRGBToLinear(value: number): number {
  const v = value / 255
  if (v <= 0.04045) return v / 12.92
  return ((v + 0.055) / 1.055) ** 2.4
}

export function decodeDC(value: number): Color {
  const intR = value >> 16
  const intG = (value >> 8) & 255
  const intB = value & 255
  return {
    r: sRGBToLinear(intR),
    g: sRGBToLinear(intG),
    b: sRGBToLinear(intB),
  }
}

export function decode83(str: string): number {
  let value = 0
  for (let i = 0; i < str.length; i++) {
    const digit = digitCharacters.indexOf(str[i] as string)
    value = value * 83 + digit
  }
  return value
}

function validateBlurhash(blurhash: string): void {
  if (!blurhash || blurhash.length < 6) {
    throw new Error('The blurhash string must be at least 6 characters')
  }
  const sizeFlag = decode83(blurhash[0] as string)
  const numY = Math.floor(sizeFlag / 9) + 1
  const numX = (sizeFlag % 9) + 1
  if (blurhash.length !== 4 + 2 * numX * numY) {
    throw new Error(
      `blurhash length mismatch: length is ${blurhash.length} but it should be ${4 + 2 * numX * numY}`,
    )
  }
}

export type IsBlurhashValidResult =
  | { isValid: true }
  | { isValid: false; errorReason: string }

/**
 * Verifies if the given BlurHash is valid by checking its type, length and size flag.
 *
 * This uses the JS BlurHash decoder, so it might be slow.
 * @param blurhash The given BlurHash string.
 */
export function isBlurhashValid(blurhash: string): IsBlurhashValidResult {
  try {
    validateBlurhash(blurhash)
  } catch (error) {
    const errorReason =
      error instanceof Error ? error.message : JSON.stringify(error)
    return { isValid: false, errorReason }
  }
  return { isValid: true }
}

/**
 * Gets the average {@linkcode Color} in a given BlurHash string.
 *
 * This uses the JS BlurHash decoder, so it might be slow.
 * @param blurhash The BlurHash string.
 */
export function getAverageColor(blurhash: string): Color | undefined {
  if (blurhash == null || blurhash.length < 7) return undefined
  const value = decode83(blurhash.substring(2, 6))
  return decodeDC(value)
}

const digitCharacters = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '#',
  '$',
  '%',
  '*',
  '+',
  ',',
  '-',
  '.',
  ':',
  ';',
  '=',
  '?',
  '@',
  '[',
  ']',
  '^',
  '_',
  '{',
  '|',
  '}',
  '~',
]
