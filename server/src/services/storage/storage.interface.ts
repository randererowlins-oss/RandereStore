export interface UploadResult {
  url: string;
  key: string;
  size?: number;
  mimeType?: string;
}

export interface StorageProvider {
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<UploadResult>;
  deleteFile(key: string): Promise<void>;
  getUrl(key: string): string;
}
