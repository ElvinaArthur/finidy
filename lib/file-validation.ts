function starts(buffer: Buffer, signature: number[]) {
  return signature.every((byte, index) => buffer[index] === byte)
}

export function hasValidFileSignature(buffer: Buffer, mime: string) {
  if (!buffer.length) return false
  if (mime === 'image/jpeg') return starts(buffer, [0xff, 0xd8, 0xff])
  if (mime === 'image/png') return starts(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  if (mime === 'image/webp') return buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP'
  if (mime === 'application/pdf') return buffer.subarray(0, 5).toString() === '%PDF-'
  if (mime === 'application/msword') return starts(buffer, [0xd0, 0xcf, 0x11, 0xe0])
  if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return starts(buffer, [0x50, 0x4b, 0x03, 0x04])
  if (mime === 'audio/mpeg') return buffer.subarray(0, 3).toString() === 'ID3' || starts(buffer, [0xff, 0xfb]) || starts(buffer, [0xff, 0xf3])
  if (mime === 'audio/mp4' || mime === 'video/mp4') return buffer.subarray(4, 8).toString() === 'ftyp'
  if (mime === 'audio/wav') return buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WAVE'
  if (mime === 'video/webm') return starts(buffer, [0x1a, 0x45, 0xdf, 0xa3])
  if (mime === 'text/plain') return !buffer.subarray(0, 8192).includes(0)
  return false
}
