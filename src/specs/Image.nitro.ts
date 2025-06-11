import type { HybridObject } from 'react-native-nitro-modules'

export interface Image
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  readonly width: number
  readonly height: number

  toArrayBuffer(): ArrayBuffer
  toArrayBufferAsync(): Promise<ArrayBuffer>

  resize(width: number, height: number): Image
  resizeAsync(width: number, height: number): Promise<Image>
}
