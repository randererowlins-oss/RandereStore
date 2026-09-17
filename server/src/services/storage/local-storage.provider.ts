import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { StorageProvider, UploadResult } from './storage.interface.js';

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;
  private publicPath: string;

  constructor(uploadDir?: string, publicPath = '/uploads') {
    this.uploadDir = uploadDir || path.resolve(process.cwd(), 'public/uploads');
    this.publicPath = publicPath;
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(fileBuffer: Buffer, originalName: string, mimeType: string): Promise<UploadResult> {
    const ext = path.extname(originalName) || '.jpg';
    const hash = crypto.randomBytes(12).toString('hex');
    const fileName = `${Date.now()}-${hash}${ext}`;
    const filePath = path.join(this.uploadDir, fileName);

    await fs.promises.writeFile(filePath, fileBuffer);

    return {
      url: `${this.publicPath}/${fileName}`,
      key: fileName,
      size: fileBuffer.length,
      mimeType,
    };
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  getUrl(key: string): string {
    return `${this.publicPath}/${key}`;
  }
}
