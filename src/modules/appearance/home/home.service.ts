import { Injectable, LoggerService } from '@nestjs/common';
import { HomeImages } from './home.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NextLoggerService } from '../../../modules/logger/logger.service';
import { CreateHomeImageDto } from './dto/home.dto';
import { FileStorageService } from '../../../services/file-storage.service';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class HomeService {

    constructor(
        @InjectModel(HomeImages.name) private homeImagesModel: Model<HomeImages>,
        private logger: NextLoggerService,
        private fileStorageService: FileStorageService,
    ) {

    }

    public async getHomeImages() {
        try {
            const images = await this.homeImagesModel
                .find({state: 'active'})
                .sort({sort: 'asc', date: 'asc'})
            return images;
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las imagenes para el home', 'getHomeImages', JSON.stringify(error));
            throw error;
        }
    }

    public async getHomeImagesToCms(skip: number, limit: number) {
        try {
            const total = await this.homeImagesModel.countDocuments();
            const images = await this.homeImagesModel
                .find()
                .sort({sort: 'asc', date: 'asc'})
                .skip(skip)
                .limit(limit)

            return {images, total};
        } catch (error) {
        }
    } 

    public async createHomeImage(data: CreateHomeImageDto, image: any) {
        try {
            const fileName = `logo-${data.type}-${new Date().getTime()}.${image.mimetype.replace('image/', '')}`;
            const folderPath = 'homeimages';

            const filePath = await this.fileStorageService.saveFile(fileName, folderPath, image.buffer);

            data.path = filePath;
            data.date = new Date();

            const newImage = new this.homeImagesModel(data);
            return await newImage.save();
            
        } catch (error) {
            this.logger.error('Ha ocurrido un error al crear una imagen para el home', 'createHomeImage', JSON.stringify(error));
            throw error;
        }
    }

    public async updateHomeImage(id: string, data: HomeImages) {
        try {
            return await this.homeImagesModel.findByIdAndUpdate(id, data, {new: true});
        } catch (error) {
            this.logger.error('Ha ocurrido un error al actualizar una imagen para el home', 'updateHomeImage', JSON.stringify(error));
            throw error;
        }
    }

    public async deleteHomeImage(id: string) {
        try {
            return await this.homeImagesModel.findByIdAndDelete(id);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al eliminar una imagen para el home', 'deleteHomeImage', JSON.stringify(error));
            throw error;
        }
    }
}
