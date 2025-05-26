import { Injectable, NotFoundException } from '@nestjs/common';
import { PromoBanners } from './promo-banners.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NextLoggerService } from '../../logger/logger.service';
import { CreatePromoBannerDto, UpdatePromoBannerDto } from './dto/promo-banners.dto';
import { FileStorageService } from '../../../common/file-storage.service';

@Injectable()
export class PromoBannerService {
    public folderPath = 'promos';

    constructor(
        @InjectModel(PromoBanners.name) private promosBannerModel: Model<PromoBanners>,
        private logger: NextLoggerService,
        private fileStorageService: FileStorageService,
    ) {}

    public async getPromoBanners() {
        try {
            return await this.promosBannerModel.find().sort({ sort: 'asc' });
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener la lista de banners', 'getPromoBanners', JSON.stringify(error));
            throw error;
        }
    }


    public async createPromoBanner(bannerData: CreatePromoBannerDto, file: any) {
        try {
            const newPromoBanner = new this.promosBannerModel(bannerData);
            const savedBanner = await newPromoBanner.save();

            const extension = file.originalname.split('.')[1]
            const fileName = `${savedBanner._id}.${extension}`;

            const filePath = await this.fileStorageService.saveFile(fileName, this.folderPath, file.buffer);

            return await this.promosBannerModel.findByIdAndUpdate(savedBanner._id, { path: filePath }, { new: true });
        } catch (error) {
            this.logger.error('Ha ocurrido un error al agregar el banner de promoción', 'createPromoBanner', JSON.stringify(error));
            throw error;
        }
    }

    public async updatePromoBanner(bannerId: string, bannerData: UpdatePromoBannerDto) {
        try {
            return await this.promosBannerModel.findByIdAndUpdate(bannerId, bannerData, {new: true});
        } catch (error) {
            this.logger.error('Ha ocurrido un error al modificar  el banner de promoción', 'updatePromoBanner', JSON.stringify(error));
            throw error;
        }
    }

    public async deletePromoBanner(bannerId: string) {
        try {
            const bannerToDelete = await this.promosBannerModel.findById(bannerId);
            if (!bannerToDelete) {
                throw new NotFoundException('Recurso no encontrado');
            } else {
                this.fileStorageService.deleteFile(this.folderPath, bannerToDelete.path);
                return await this.promosBannerModel.findByIdAndDelete(bannerId);
            }
        } catch (error) {
            this.logger.error('Ha ocurrido un error al eliminar el banner de promoción', 'deletePromoBanner', JSON.stringify(error));
            throw error;
        }
    }
}
