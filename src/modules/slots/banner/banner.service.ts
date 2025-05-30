import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { FileStorageService } from '../../../common/file-storage.service';
import { Banner } from '../schemas/banner.schema';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<Banner>,
    private configService: ConfigService,
    private fileStorageService: FileStorageService,
  ) {}

  async addSlotBanner(data: any) {
    try {
      if (!data.files) {
        throw { message: "No hay imagenes" };
      }

      const banner = new this.bannerModel({
        date: new Date(),
        sort: 0
      });

      const savedBanner = await banner.save();
      
      if (data.files.image) {
        const image = data.files.image;
        const fileName = `${savedBanner._id}.jpg`;
        const imagePath = await this.fileStorageService.saveFile(fileName, 'slots', image.buffer);
        
        const localchange = {
          path: imagePath,
          titulo: data.body.titulo,
          alt: data.body.alt,
          destinationUrl: data.body.destinationUrl,
          sort: data.body.sort ? parseInt(data.body.sort) : 0
        };

        const result = await this.bannerModel.findByIdAndUpdate(
          savedBanner._id,
          localchange,
          { new: true }
        );
        
        return result;
      }

      return savedBanner;
    } catch (error) {
      throw error;
    }
  }

  async getSlotBanners() {
    try {
      const banners = await this.bannerModel
        .find()
        .sort({ sort: 1, _id: 1 })
        .exec();
      return banners;
    } catch (error) {
      throw error;
    }
  }

  async removeSlotBanner(id: string) {
    try {
      const banner = await this.bannerModel.findById(id).exec();
      
      if (!banner) {
        return { code: "404", message: "Recurso no encontrado" };
      }

      // Delete the banner from database
      await this.bannerModel.deleteOne({ _id: id });

      // Try to delete the physical file
      try {
        const fileName = `${id}.jpg`;
        await this.fileStorageService.deleteFile(fileName, 'slots');
      } catch (fileError) {
        console.log('File deletion error:', fileError);
        // Continue even if file deletion fails
      }

      return {
        code: "100",
        message: "Recurso eliminado"
      };
    } catch (error) {
      throw error;
    }
  }
}
