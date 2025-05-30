import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileStorageService {

    constructor(private configService: ConfigService) {}

    private readonly baseUploadPath = path.join(__dirname, '../../uploads');    public async saveFile(fileName: string, folder: string, fileData: Buffer | any): Promise<string> {
        const dirPath = path.join(this.baseUploadPath, folder);
        const fullPath = path.join(dirPath, fileName);
      
        try {
          await fs.promises.access(dirPath);
        } catch (error) {
          await fs.promises.mkdir(dirPath, { recursive: true });
        }

        // Handle different file data types
        let fileBuffer: Buffer;
        
        if (Buffer.isBuffer(fileData)) {
            fileBuffer = fileData;
        } else if (fileData && fileData.buffer && Buffer.isBuffer(fileData.buffer)) {
            fileBuffer = fileData.buffer;
        } else if (fileData && fileData.data && Buffer.isBuffer(fileData.data)) {
            fileBuffer = fileData.data;
        } else if (fileData && typeof fileData.mv === 'function') {
            // Handle express-fileupload style files
            throw new Error('Express-fileupload files not supported in NestJS context. Use multer files.');
        } else {
            console.error('Invalid file data received:', typeof fileData);
            throw new Error(`Invalid file data type: ${typeof fileData}`);
        }
      
        await fs.promises.writeFile(fullPath, fileBuffer as NodeJS.ArrayBufferView);
        
        let hostPath: string;

        if(folder === './') hostPath = `${this.configService.get('IMAGE_HOST')}/${fileName}`;
        else hostPath = `${this.configService.get('IMAGE_HOST')}/${folder}/${fileName}`;
        console.log('File saved successfully. Host path:', hostPath);
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
