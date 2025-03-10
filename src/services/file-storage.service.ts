import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileStorageService {

    constructor(private configService: ConfigService) {}

    private readonly baseUploadPath = path.join(__dirname, '../../uploads');

    public async saveFile(fileName: string, folder: string, fileBuffer: Buffer): Promise<string> {
        const dirPath = path.join(this.baseUploadPath, folder);
        const fullPath = path.join(dirPath, fileName);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(fullPath, fileBuffer);

        const hostPath = `${this.configService.get('IMAGE_HOST')}/${folder}/${fileName}`;
        console.log('hostPath', hostPath);
        return hostPath;
    }

    public async deleteFile(folder: string, savedPath: string): Promise<void> {
        const fileName = path.basename(savedPath);
        const fullPath = path.join(this.baseUploadPath, folder, fileName);
        
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
}
