import { Injectable } from '@nestjs/common';
import { PokerImages, PokerUrl } from './poker.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NextLoggerService } from '../../../modules/logger/logger.service';
import { FileStorageService } from '../../../common/file-storage.service';
import { CreatedPokerImageDto, UpdatePokerDtoUrl, UpdatePokerImageDto } from './dto/poker.dto';

@Injectable()
export class PokerService {


    constructor(
        @InjectModel(PokerImages.name) private pokerImageModel: Model<PokerImages>,
        @InjectModel(PokerUrl.name) private pokerUrlModel: Model<PokerUrl>,
        private logger: NextLoggerService,
        private fileStorageService: FileStorageService,
    ) {

    }

    public async getImagesPoker() {
        try {
            const images = await this.pokerImageModel
                .find()
                .sort({ sort: 'asc', date: 'asc' })
            return images;
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las imagenes para el home', 'getHomeImages', JSON.stringify(error));
            throw error;
        }
    }

    public async gePokerImagesToCms(skip: number, limit: number) {
        try {
            const total = await this.pokerImageModel.countDocuments();
            const images = await this.pokerImageModel
                .find()
                .sort({ sort: 'asc', date: 'asc' })
                .skip(skip * limit)
                .limit(limit)

            return { images, total };
        } catch (error) {
        }
    }

    public async createPokerImage(data: CreatedPokerImageDto, image: any) {
        try {
            const fileName = `banner-${new Date().getTime()}.${image.mimetype.replace('image/', '')}`;
            const folderPath = 'PokerImages';

            const filePath = await this.fileStorageService.saveFile(fileName, folderPath, image.buffer);

            data.path = filePath;
            data.date = new Date();

            const newImage = new this.pokerImageModel(data);
            return await newImage.save();
        } catch (error) {
            this.logger.error('Ha ocurrido un error al crear una imagen para el home', 'createHomeImage', JSON.stringify(error));
            throw error;
        }
    }

    public async updatePokerImage(id: string, data: UpdatePokerImageDto) {
        try {
            return await this.pokerImageModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            this.logger.error('Ha ocurrido un error al actualizar una imagen para el home', 'updateHomeImage', JSON.stringify(error));
            throw error;
        }
    }

    
    public async pokerPosition(id: string, data: UpdatePokerImageDto) {
        try {
            return await this.pokerImageModel.findByIdAndUpdate(id, {position: data.position}, { new: true });
        } catch (error) {
            this.logger.error('Ha ocurrido un error al actualizar una imagen para el home', 'updateHomeImage', JSON.stringify(error));
            throw error;
        }
    }

    public async updateImagePokerUrl(id: string, data: UpdatePokerImageDto) {
        try {
            return await this.pokerImageModel.findByIdAndUpdate(id, data, { new : true });
        } catch (error) {
            this.logger.error('Ha ocurrido un error al actualizar una imagen para el home', 'updateHomeImage', JSON.stringify(error));
            throw error;
        }
    }

    public async changePokerImageState(id: string) {
        try {
            const image = await this.pokerImageModel.findById(id);

            const state = image?.state === 'active' ? 'inactive' : 'active';

            return await this.pokerImageModel.findByIdAndUpdate(id, { state }, { new: true });
        } catch (error) {
            this.logger.error('Ha ocurrido un error al activar una imagen para el home', 'activeHomeImage', JSON.stringify(error));
            throw error;
        }
    }

    public async deletePokerImage(id: string) {
        try {
            return await this.pokerImageModel.findByIdAndDelete(id);
        } catch (error) {
            this.logger.error('Ha ocurrido un error al eliminar una imagen para el home', 'deleteHomeImage', JSON.stringify(error));
            throw error;
        }
    }  

    public async getPokerUrl() {
        try {
            const url = await this.pokerUrlModel
                .findOne({ state: 'active' })
                .sort({ date: 'asc', sort: 'asc' });
                
            return url;

        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener la url para el poker', 'getPokerUrl', JSON.stringify(error));
            throw error;
        }
    }

    public async updatePokerUrl(data: UpdatePokerDtoUrl) {
        try {
            const currentUrl = await this.pokerUrlModel.findOne({ state: 'active' });
            
            if (!currentUrl) {
                data.date = new Date();
                return await this.pokerUrlModel.create(data);
            }

            return await this.pokerUrlModel.findByIdAndUpdate(currentUrl._id, data, { new: true });

        } catch (error) {
            this.logger.error('Ha ocurrido un error al actualizar la url para el poker', 'updatePokerUrl', JSON.stringify(error));
            throw error;
        }
    }

}
