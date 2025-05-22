import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Applications } from './applications.schema';
import { CreateApplicationDto, UpdateApplicationDto } from './dto/applications.dto';
import { FileStorageService } from '../../common/file-storage.service';
import { NextLoggerService } from '../../modules/logger/logger.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectModel(Applications.name) private applicationsModel: Model<Applications>,
        private logger: NextLoggerService,
        private fileStorageService: FileStorageService,
    ) {}

    public async getApplications(start: number, limit: number) {
        try {
            const applications = await this.applicationsModel
                .find()
                .sort('-date')
                .skip(start)
                .limit(limit)
                .exec();
            return applications;
        } catch (error) {
            this.logger.error('Error fetching applications', 'getApplications', JSON.stringify(error));
            throw error;
        }
    }

    public async getActiveApplication() {
        try {
            const activeApplications = await this.applicationsModel
                .find({ active: true })
                .sort('-date')
                .exec();
            return activeApplications;
        } catch (error) {
            this.logger.error('Error fetching active applications', 'getActiveApplication', JSON.stringify(error));
            throw error;
        }
    }

    public async switchStateApplication(id: string) {
        try {
            await this.applicationsModel.updateMany({ active: true }, { active: false });
            const updatedApplication = await this.applicationsModel.findByIdAndUpdate(id, { active: true }, { new: true });
            return updatedApplication;
        } catch (error) {
            this.logger.error('Error switching application state', 'switchStateApplication', JSON.stringify(error));
            throw error;
        }
    }

    public async deleteApplication(id: string) {
        try {
            const application = await this.applicationsModel.findById(id).exec();
            if (application) {
                const fileName = application.path;
                const fullPath = path.join(__dirname, '../../../uploads/apks/', fileName);
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        this.logger.error('Error deleting file', 'deleteApplication', JSON.stringify(err));
                    }
                });
            }
            return await this.applicationsModel.findByIdAndDelete(id);
        } catch (error) {
            this.logger.error('Error deleting application', 'deleteApplication', JSON.stringify(error));
            throw error;
        }
    }

    public async createApplication(body: CreateApplicationDto, apk: any) {
        try {
            const fileName = `${body.version}-${new Date().getTime().toString()}.apk`;
            const folderPath = 'apks';

            await this.fileStorageService.saveFile(fileName, folderPath, apk.buffer);

            body.path = fileName;
            body.date = new Date();

            const newApplication = new this.applicationsModel(body);
            return await newApplication.save();
        } catch (error) {
            this.logger.error('Error creating application', 'createApplication', JSON.stringify(error));
            throw error;
        }
    }
}
