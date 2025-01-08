import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileStorageService {
    private readonly baseUploadPath = path.join(__dirname, '../../uploads');

    public async saveFile(fileName: string, folder: string, fileBuffer: Buffer): Promise<string> {
        const dirPath = path.join(this.baseUploadPath, folder);
        const fullPath = path.join(dirPath, fileName);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(fullPath, fileBuffer);

        return fullPath;
    }
}
