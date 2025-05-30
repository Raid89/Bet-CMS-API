import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileStorageService {

    constructor(private configService: ConfigService) {}

    private readonly baseUploadPath = path.join(__dirname, '../../uploads');    public async saveFile(fileName: string, folder: string, fileData: Buffer | any): Promise<string> {
        console.log('FileStorageService.saveFile called with:', { fileName, folder, fileDataType: typeof fileData });
        
        const dirPath = path.join(this.baseUploadPath, folder);
        const fullPath = path.join(dirPath, fileName);
      
        try {
          await fs.promises.access(dirPath);
        } catch (error) {
          console.log('Creating directory:', dirPath);
          await fs.promises.mkdir(dirPath, { recursive: true });
        }

        // Handle different file data types
        let fileBuffer: Buffer;
        
        if (Buffer.isBuffer(fileData)) {
            console.log('File data is already a Buffer');
            fileBuffer = fileData;
        } else if (fileData && fileData.buffer && Buffer.isBuffer(fileData.buffer)) {
            console.log('File data has buffer property');
            fileBuffer = fileData.buffer;
        } else if (fileData && fileData.data && Buffer.isBuffer(fileData.data)) {
            console.log('File data has data property with Buffer');
            fileBuffer = fileData.data;
        } else if (fileData && typeof fileData.mv === 'function') {
            // Handle express-fileupload style files
            console.error('Express-fileupload files not supported in NestJS context');
            throw new Error('Express-fileupload files not supported in NestJS context. Use multer files.');
        } else if (fileData && fileData.buffer && typeof fileData.buffer === 'object') {
            // Handle case where buffer might be an object that needs to be converted
            console.log('Converting object buffer to Buffer');
            try {
                fileBuffer = Buffer.from(fileData.buffer);
            } catch (bufferError) {
                console.error('Failed to convert object buffer:', bufferError);
                throw new Error(`Failed to convert buffer object: ${bufferError}`);
            }
        } else {
            console.error('Invalid file data received. Type:', typeof fileData);
            console.error('File data keys:', fileData ? Object.keys(fileData) : 'null/undefined');
            throw new Error(`Invalid file data type: ${typeof fileData}`);
        }
      
        console.log('Writing file to:', fullPath);
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
