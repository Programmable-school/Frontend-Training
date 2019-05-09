import StorageFile from './StorageFile'

export default abstract class StorageDetailFile implements StorageFile {
  name: string | null
  url: string | null
  fileType: string | null
  size: number

  constructor() {
    this.name = null
    this.url = null
    this.fileType = null
    this.size = 0
  }
}
