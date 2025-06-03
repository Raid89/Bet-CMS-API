import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { FileStorageService } from '../../../common/file-storage.service';
import { CasinoLiveVip, CasinoLiveVipDocument } from '../schemas/casino-live-vip.schema';
import { BannerClVip, BannerClVipDocument } from '../schemas/banner-cl-vip.schema';
import { ClIntegrationChannelCodesVip, ClIntegrationChannelCodesVipDocument } from '../schemas/cl-integration-channel-codes-vip.schema';
import { ClCategoryVip, ClCategoryVipDocument } from '../schemas/cl-category-vip.schema';
import * as fs from 'fs';
import * as path from 'path';
import { Types } from 'mongoose';

@Injectable()
export class CasinoVipGamesService {
  private readonly uploadsPath: string;

  constructor(
    @InjectModel(CasinoLiveVip.name) private casinoLiveVipModel: Model<CasinoLiveVipDocument>,
    @InjectModel(BannerClVip.name) private bannerClVipModel: Model<BannerClVipDocument>,
    @InjectModel(ClIntegrationChannelCodesVip.name) private clIntegrationChannelCodesVipModel: Model<ClIntegrationChannelCodesVipDocument>,
    @InjectModel(ClCategoryVip.name) private clCategoryVipModel: Model<ClCategoryVipDocument>,
    private configService: ConfigService,
    private fileStorageService: FileStorageService,
  ) {
    this.uploadsPath = path.join(__dirname, '../../../../uploads/');
  }

  async addPromoBanner(data: any): Promise<any> {
    if (!data.files) {
      throw new Error('No hay imagenes');
    }    const banner = new this.bannerClVipModel({
      date: new Date(),
    });

    const createdBanner = await banner.save();
    
    // Handle file upload
    const image = data.files.image;
    const uploadPath = path.join(this.uploadsPath, 'cl', `${createdBanner._id}.jpg`);
    
    await image.mv(uploadPath);
    
    const updateData = {
      path: `${this.configService.get('IMAGESHOST')}/cl/${createdBanner._id}.jpg`,
      titulo: data.body.titulo,
      alt: data.body.alt,
    };

    return await this.bannerClVipModel.findByIdAndUpdate(createdBanner._id, updateData, { new: true });
  }

  async updatePromoBanner(id: string, data: any, files?: any): Promise<any> {
    if (files && files.image) {
      const uploadPath = path.join(this.uploadsPath, 'cl', `${id}.jpg`);
      await files.image.mv(uploadPath);
      data.path = `${this.configService.get('IMAGESHOST')}/cl/${id}.jpg`;
    }

    const result = await this.bannerClVipModel.findByIdAndUpdate(id, data, { new: true });
    
    if (result) {
      return {
        code: '100',
        message: 'Promo actualizado con exito!',
        data: result,
      };
    }
    
    throw new Error('Banner not found');
  }

  async removePromoBanner(id: string): Promise<any> {
    const banner = await this.bannerClVipModel.findById(id);
    
    if (!banner) {
      return { code: '404', message: 'Recurso no encontrado' };
    }

    const filePath = path.join(this.uploadsPath, 'cl', `${id}.jpg`);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      await this.bannerClVipModel.deleteOne({ _id: id });
      
      return {
        code: '100',
        message: 'Promo eliminado con exito!',
      };    } catch (error: any) {
      throw new Error(`Error al borrar el archivo fisico: ${error.message}`);
    }
  }

  async newGame(data: any, files?: any): Promise<any> {
    try {
      if (files) {
        const imageName = new Date().getTime() + files.image.name;
        const iconName = new Date().getTime() + files.icon.name;
        
        const imagePath = path.join(this.uploadsPath, 'cl', imageName);
        const iconPath = path.join(this.uploadsPath, 'cl', iconName);
        
        await files.image.mv(imagePath);
        await files.icon.mv(iconPath);
        
        data.image = imageName;
        data.icon = iconName;
      }

      data.date = new Date();
      data.position = 0;

      const game = new this.casinoLiveVipModel(data);
      return await game.save();    } catch (error: any) {
      throw new Error(`Error creating game: ${error.message}`);
    }
  }

  async updateGame(id: string, data: any, files?: any): Promise<any> {
    try {
      if (files) {
        if (files.image) {
          const imageName = new Date().getTime() + files.image.name;
          const imagePath = path.join(this.uploadsPath, 'cl', imageName);
          await files.image.mv(imagePath);
          data.image = imageName;
        }
        
        if (files.icon) {
          const iconName = new Date().getTime() + files.icon.name;
          const iconPath = path.join(this.uploadsPath, 'cl', iconName);
          await files.icon.mv(iconPath);
          data.icon = iconName;
        }
      }

      return await this.casinoLiveVipModel.findByIdAndUpdate(id, data, { new: true });    } catch (error: any) {
      throw new Error(`Error updating game: ${error.message}`);
    }
  }

  async deleteGame(id: string): Promise<any> {
    await this.casinoLiveVipModel.findByIdAndDelete(id);
    return true;
  }

  async deleteChannelCode(id: string): Promise<any> {
    await this.clIntegrationChannelCodesVipModel.findByIdAndDelete(id);
    return true;
  }

  async getGamesCLCMS(limit: number, skip: number): Promise<any> {
    const games = await this.casinoLiveVipModel.find({}).skip(skip).limit(limit);
    const total = await this.casinoLiveVipModel.countDocuments({});
    
    return { games, total };
  }

  async getFilterGamesCLCMS(limit: number, skip: number, criteria?: string, integrationChannelCode?: string, categoryId?: string): Promise<any> {
    const filter: any[] = [];
    
    if (criteria) {
      filter.push({ title: { $regex: new RegExp(criteria, 'i') } });
    }
    
    if (integrationChannelCode && integrationChannelCode !== '') {
      filter.push({ integrationChannelCode: integrationChannelCode });
    }
    
    if (categoryId && categoryId !== '') {
      filter.push({ category: new Types.ObjectId(categoryId) });
    }
    
    const query = filter.length > 0 ? { $and: filter } : {};
    
    const games = await this.casinoLiveVipModel
      .find(query)
      .skip(skip * limit)
      .limit(limit)
      .sort({ position: 1, title: 1 });
      
    const total = await this.casinoLiveVipModel.countDocuments(query);
    
    return { games, total };
  }

  async getCLGames(): Promise<any> {
    return await this.casinoLiveVipModel.find({ state: 'active' });
  }

  async getChannelCodes(): Promise<any> {
    return await this.clIntegrationChannelCodesVipModel.find({ state: 'active' });
  }

  async newIntegrationChannelCode(data: any, files?: any): Promise<any> {
    data.date = new Date();
    data.state = 'active';
    
    const channelCode = new this.clIntegrationChannelCodesVipModel(data);
    return await channelCode.save();
  }

  async getCLBanners(limit?: number, skip?: number): Promise<any> {
    const query = this.bannerClVipModel.find({}).sort({ date: -1 });
    
    if (limit) query.limit(limit);
    if (skip) query.skip(skip);
    
    return await query.exec();
  }

  async getCategories(): Promise<any> {
    return await this.clCategoryVipModel.find({ state: 'active' }).sort({ position: 1 });
  }

  async newCategory(data: any, files?: any): Promise<any> {
    const category = new this.clCategoryVipModel(data);
    return await category.save();
  }

  async updateCategory(id: string, data: any): Promise<any> {
    return await this.clCategoryVipModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteCategory(id: string): Promise<any> {
    await this.clCategoryVipModel.findByIdAndDelete(id);
    return true;
  }

  async getCategoriesCL(): Promise<any> {
    return await this.clCategoryVipModel.find({ state: 'active' }).sort({ position: 1 });
  }

  async getAllCLNDvipByCategoryId(categoryId: string): Promise<any> {
    return await this.casinoLiveVipModel.find({ 
      category: new Types.ObjectId(categoryId), 
      state: 'active' 
    }).sort({ position: 1 });
  }
}
