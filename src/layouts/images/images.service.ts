import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageDocument } from './schemas/images.schema';
import { NextLoggerService } from 'src/modules/logger/logger.service';
import { FileStorageService } from 'src/common/file-storage.service';
import { CreateImagesDto } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
    constructor(
        @InjectModel(ImageDocument.name) private ImagesModel: Model<ImageDocument>,
        private readonly logger: NextLoggerService,
        private readonly fileService: FileStorageService
    ) {}

    async findAllImages(limit: number, skip: number) {
        this.logger.log('Obteniendo todas las imagenes', 'findAllImages');
        try {
            const count = await this.ImagesModel.countDocuments();
            const data =  await this.ImagesModel.find().limit(limit).skip(skip * limit).exec();
            return {count, data};
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las imagenes', 'findAllImages', JSON.stringify(error));
            throw error;
        }
    }

    async createImage(imageData: CreateImagesDto, image: any) {
        this.logger.log('Creando una nueva imagen', 'createImage', JSON.stringify(imageData));
        try {
            const imageSaved = new this.ImagesModel(imageData);
            const fileName = ` ${imageSaved._id}.${image.mimetype.replace('image/', '')}`;
            const folderPath = './';
            const filePath = await this.fileService.saveFile(fileName, folderPath, image.buffer);
            imageSaved.path = filePath;
            return await imageSaved.save();
        } catch(error) {
            this.logger.error('Ha ocurrido un error al crear una imagen', 'createImage', JSON.stringify(error));
            throw error;
        }
    }

    async updateImage(id: string, imageData: any) {
        this.logger.log('Actualizando una imagen', 'updateImage', JSON.stringify(imageData));
        try {
            return await this.ImagesModel.findByIdAndUpdate(id, imageData, {new: true}).exec();
        } catch (error) {
            this.logger.error('Ha ocurrido un error al actualizar una imagen', 'updateImage', JSON.stringify(error));
            throw error;
        }
    }
}