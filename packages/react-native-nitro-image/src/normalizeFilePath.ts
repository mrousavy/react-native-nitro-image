const FILE_URL_PREFIX = 'file://'

export function normalizeFilePath(filePath: string): string {
  if (!filePath.startsWith(FILE_URL_PREFIX)) {
    return filePath
  }

  let path = filePath.slice(FILE_URL_PREFIX.length)
  if (path.startsWith('localhost/')) {
    path = path.slice('localhost'.length)
  }

  try {
    return decodeURIComponent(path)
  } catch {
    return path
  }
}
