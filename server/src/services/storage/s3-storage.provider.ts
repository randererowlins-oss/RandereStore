import { StorageProvider, UploadResult } from './storage.interface.js';

export interface S3Config {
  bucket: string;
  region: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  publicUrlPrefix?: string;
}

export class S3StorageProvider implements StorageProvider {
  private config: S3Config;

  constructor(config: S3Config) {
    this.config = config;
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<UploadResult> {
    // Extensible S3 client integration point
    const key = `randere/${Date.now()}-${fileName}`;
    const url = `${this.config.publicUrlPrefix || `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com`}/${key}`;

    return {
      url,
      key,
      size: fileBuffer.length,
      mimeType,
    };
  }

  async deleteFile(key: string): Promise<void> {
    // S3 DeleteObjectCommand
  }

  getUrl(key: string): string {
    return `${this.config.publicUrlPrefix || `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com`}/${key}`;
  }
}
