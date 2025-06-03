import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CasinoLive, CasinoLiveDocument } from '../schemas/casino-live.schema';
import { BannerCL, BannerCLDocument } from '../schemas/banner-cl.schema';
import { ClCategory, ClCategoryDocument } from '../schemas/cl-category.schema';
import { CLIntegrationChannelCodes, CLIntegrationChannelCodesDocument } from '../schemas/cl-integration-channel-codes.schema';
import { CreateCasinoLiveDto, UpdateCasinoLiveDto } from '../dto/casino-live.dto';
import { CreateBannerDto, UpdateBannerDto, CreateCategoryDto, UpdateCategoryDto, CreateChannelCodeDto } from '../dto/casino-extra.dto';
import { FileStorageService } from '../../../common/file-storage.service';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
const XLSX = require('exceljs');

@Injectable()
export class CasinoGamesService {
  constructor(
    @InjectModel(CasinoLive.name) private casinoLiveModel: Model<CasinoLiveDocument>,
    @InjectModel(BannerCL.name) private bannerCLModel: Model<BannerCLDocument>,
    @InjectModel(ClCategory.name) private clCategoryModel: Model<ClCategoryDocument>,
    @InjectModel(CLIntegrationChannelCodes.name) private clIntegrationChannelCodesModel: Model<CLIntegrationChannelCodesDocument>,
    private fileStorageService: FileStorageService,
    private configService: ConfigService
  ) {}
  // ============= INTEGRATION CHANNEL CODES =============
  
  async getChannelCodes(): Promise<CLIntegrationChannelCodes[]> {
    return await this.clIntegrationChannelCodesModel.find({ state: 'active' });
  }

  async newIntegrationChannelCode(data: CreateChannelCodeDto): Promise<CLIntegrationChannelCodes> {
    const channelData = {
      ...data,
      date: new Date(),
      state: data.state || 'active'
    };
    return await this.clIntegrationChannelCodesModel.create(channelData);
  }

  async deleteChannelCode(id: string): Promise<{ deleted: boolean; message: string }> {
    const deletedChannel = await this.clIntegrationChannelCodesModel.findByIdAndDelete(id);
    if (!deletedChannel) {
      throw new NotFoundException(`Channel code with ID ${id} not found`);
    }
    return {
      deleted: true,
      message: 'Channel code deleted successfully'
    };
  }

  // ============= BANNERS =============

  async addPromoBanner(data: CreateBannerDto, files: any): Promise<BannerCL> {
    if (!files?.image) {
      throw new BadRequestException('No hay imagenes');
    }

    const banner = new this.bannerCLModel({
      date: new Date(),
    });

    const savedBanner = await banner.save();

    try {
      // Save image file
      const imageFileName = `${savedBanner._id}.jpg`;
      await this.fileStorageService.saveFile(imageFileName, 'cl', files.image);
      
      const imageHost = this.configService.get('IMAGE_HOST') || process.env.IMAGESHOST;
      const updateData = {
        path: `${imageHost}/cl/${imageFileName}`,
        titulo: data.titulo,
        alt: data.alt,
        destinationUrl: data.destinationUrl,
      };

      return await this.bannerCLModel.findByIdAndUpdate(savedBanner._id, updateData, { new: true }) as BannerCL;
    } catch (error) {
      await this.bannerCLModel.findByIdAndDelete(savedBanner._id);
      throw error;
    }
  }
  async updatePromoBanner(id: string, data: UpdateBannerDto, files?: any): Promise<{ code: string; message: string; data: BannerCL }> {
    const updateData = { ...data };
    
    // Handle file upload if provided
    if (files?.image) {
      const imageFileName = `${id}.jpg`;
      await this.fileStorageService.saveFile(imageFileName, 'cl', files.image);
      
      const imageHost = this.configService.get('IMAGE_HOST') || process.env.IMAGESHOST;
      updateData.path = `${imageHost}/cl/${imageFileName}`;
    }

    const result = await this.bannerCLModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!result) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return {
      code: '100',
      message: 'Promo actualizado con exito!',
      data: result,
    };
  }

  async removePromoBanner(id: string): Promise<{ code: string; message: string }> {
    const banner = await this.bannerCLModel.findById(id);
    if (!banner) {
      return { code: '404', message: 'Recurso no encontrado' };
    }

    try {
      // Try to delete the physical file
      await this.fileStorageService.deleteFile('cl', `${id}.jpg`);
    } catch (error) {
      console.warn('Could not delete banner file:', error);
    }

    await this.bannerCLModel.findByIdAndDelete(id);
    return {
      code: '100',
      message: 'Recurso eliminado',
    };
  }

  async getCLBanners(): Promise<BannerCL[]> {
    return await this.bannerCLModel.find({}, { destinationUrl: 0 }).sort({ sort: 1 });
  }

  async newGetCLBanners(): Promise<BannerCL[]> {
    return await this.bannerCLModel.find({}).sort({ sort: 1 });
  }

  // ============= CATEGORIES =============

  async getCategories(): Promise<ClCategory[]> {
    return await this.clCategoryModel.find({ state: 'active' }).sort({ position: 1 });
  }

  async newCategory(data: CreateCategoryDto): Promise<ClCategory> {
    const categoryData = {
      ...data,
      date: new Date(),
      state: data.state || 'active'
    };
    return await this.clCategoryModel.create(categoryData);
  }

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<ClCategory> {
    const result = await this.clCategoryModel.findByIdAndUpdate(id, data, { new: true });
    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return result;
  }

  async deleteCategory(id: string): Promise<{ deleted: boolean; message: string }> {
    const result = await this.clCategoryModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return {
      deleted: true,
      message: 'Category deleted successfully'
    };
  }  async getCategoriesCL(iosVersion?: string): Promise<any> {
    const categories = await this.clCategoryModel.find().lean();
    const allGames = await this.casinoLiveModel.find({}, {
      msIllustrative: 0,
      msBanner: 0,
      msBannerMod: 0,
      gDescTitle: 0,
      gDescSubtitle: 0,
      gDescText: 0,
      wGameTitle: 0,
      wGameDesc: 0,
    }).lean();

    categories.forEach((category: any) => {
      const categoryClnd = allGames.filter((game: any) => {
        if (Array.isArray(game.category)) {
          return game.category.map((c: any) => c.toString()).includes(category._id.toString());
        } else {
          if (game.category === null || game.category === undefined) return false;
          return game.category.toString() === category._id.toString();
        }
      });

      const gamesClnd = categoryClnd.map((game: any) => ({
        ...game,
        category: game.category?.[0] ?? game.category
      }));

      gamesClnd.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));

      if (process.env.IOS_VERSION_TEST === iosVersion && process.env.IOS_TEST_ACTIVE) {
        category.clnds = gamesClnd.slice(0, 1);
        category.total = categoryClnd.length;
      } else {
        category.clnds = gamesClnd;
        category.total = categoryClnd.length;
      }
    });    let result;
    if (process.env.IOS_VERSION_TEST === iosVersion && process.env.IOS_TEST_ACTIVE) {
      result = categories.slice(0, 1);
    } else {
      result = categories;
    }

    // Return only the categories array, just like the original Express.js service
    return result;
  }

  // ============= GAMES =============

  async newGameCasinoLive(data: any, files: any): Promise<CasinoLive> {
    try {
      // Handle microsite files if needed
      if (data.microSite === 'true') {
        const savedFiles = await this.saveMicroSiteImageCLND(files, data.gameId);
        data = { ...data, ...savedFiles };
      } else {
        delete data.gDescTitle;
        delete data.gDescSubtitle;
        delete data.gDescText;
        delete data.wGameTitle;
        delete data.wGameDesc;
      }

      // Handle main image and icon
      console.log('Files received:', files);
      if (!files?.image || !files?.icon) {
        throw new BadRequestException('Both image and icon files are required');
      }

      const imageName = `${Date.now()}_${files.image.originalname || files.image.name}`;
      const iconName = `${Date.now()}_${files.icon.originalname || files.icon.name}`;

      await this.fileStorageService.saveFile(imageName, 'cl', files.image);
      await this.fileStorageService.saveFile(iconName, 'cl', files.icon);

      data.image = imageName;
      data.icon = iconName;
      data.tags = data.tags ? data.tags.split(',') : null;
      data.category = data.category ? data.category.split(',') : null;

      // Validate game doesn't exist
      const gameExists = await this.validationGameExistClnd(data.gameCode, data.integrationChannelCode);
      if (gameExists) {
        throw new BadRequestException('Error: El registro juego ya existe usa otro GameCode o Canal de integración.');
      }

      return await this.casinoLiveModel.create(data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      throw error;
    }
  }

  async getSingleCLGame(id: string): Promise<CasinoLive> {
    const game = await this.casinoLiveModel.findById(id);
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }

  private async saveMicroSiteImageCLND(files: any, gameId: string): Promise<any> {
    const savedFiles: any = {};

    if (files?.msBanner) {
      const extension = files.msBanner.mimetype.split('/')[1];
      const fileName = `msBanner_${gameId}.${extension}`;
      await this.fileStorageService.saveFile(fileName, 'cl', files.msBanner);
      savedFiles.msBanner = `${this.configService.get('IMAGE_HOST')}/cl/${fileName}`;
    }

    if (files?.msBannerMod) {
      const extension = files.msBannerMod.mimetype.split('/')[1];
      const fileName = `msBannerMod_${gameId}.${extension}`;
      await this.fileStorageService.saveFile(fileName, 'cl', files.msBannerMod);
      savedFiles.msBannerMod = `${this.configService.get('IMAGE_HOST')}/cl/${fileName}`;
    }

    if (files && files['msIllustrative[]'] && Array.isArray(files['msIllustrative[]'])) {
      savedFiles.msIllustrative = await Promise.all(
        files['msIllustrative[]'].map(async (file: any, index: number) => {
          const extension = file.mimetype.split('/')[1];
          const fileName = `msIllustrative_${index}_${gameId}.${extension}`;
          await this.fileStorageService.saveFile(fileName, 'cl', file);
          return `${this.configService.get('IMAGE_HOST')}/cl/${fileName}`;
        })
      );
    }

    return savedFiles;
  }

  private async validationGameExistClnd(gameCode: string, channel: string): Promise<boolean> {
    try {
      const game = await this.casinoLiveModel.findOne({
        gameCode: gameCode,
        integrationChannelCode: new RegExp(channel, 'i'),
      });
      return !!game;
    } catch (error) {
      return false;
    }
  }

  async updateGame(id: string, data: any, files?: any): Promise<CasinoLive> {
    const currentGame = await this.casinoLiveModel.findById(id);
    if (!currentGame) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    if (data.microSite === 'true') {
      const savedFiles = await this.saveMicroSiteImageCLND(files, data.gameId);
      data = { ...data, ...savedFiles };
    } else {
      delete data.gDescTitle;
      delete data.gDescSubtitle;
      delete data.gDescText;
      delete data.wGameTitle;
      delete data.wGameDesc;
    }

    // Handle image upload
    if (files?.image) {
      const imageName = `${Date.now()}_${files.image.originalname || files.image.name}`;
      await this.fileStorageService.saveFile(imageName, 'cl', files.image);
      data.image = imageName;
      
      // Delete old image
      if (currentGame.image) {
        try {
          await this.fileStorageService.deleteFile('cl', currentGame.image);
        } catch (error) {
          console.warn('Could not delete old image:', error);
        }
      }
    }

    // Handle icon upload
    if (files?.icon) {
      const iconName = `${Date.now()}_${files.icon.originalname || files.icon.name}`;
      await this.fileStorageService.saveFile(iconName, 'cl', files.icon);
      data.icon = iconName;
      
      // Delete old icon
      if (currentGame.icon) {
        try {
          await this.fileStorageService.deleteFile('cl', currentGame.icon);
        } catch (error) {
          console.warn('Could not delete old icon:', error);
        }
      }
    }

    if (data.category) {
      data.category = data.category.split(',');
    }

    if (data.tags) {
      data.tags = data.tags.split(',');
    }

    return await this.casinoLiveModel.findByIdAndUpdate(id, data, { new: true }) as CasinoLive;
  }

  async deleteGame(id: string): Promise<{ deleted: boolean; message: string }> {
    const currentGame = await this.casinoLiveModel.findById(id);
    if (!currentGame) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    // Delete associated files
    if (currentGame.image) {
      try {
        await this.fileStorageService.deleteFile('cl', currentGame.image);
      } catch (error) {
        console.warn('Could not delete image:', error);
      }
    }

    if (currentGame.icon) {
      try {
        await this.fileStorageService.deleteFile('cl', currentGame.icon);
      } catch (error) {
        console.warn('Could not delete icon:', error);
      }
    }

    await this.casinoLiveModel.findByIdAndDelete(id);

    return {
      deleted: true,
      message: 'Game deleted successfully'
    };
  }  async getGamesCLCMS(limit: number, skip: number): Promise<any> {
    const games = await this.casinoLiveModel.find({}).skip(skip).limit(limit);
    const total = await this.casinoLiveModel.countDocuments({});
    
    // Return only games and total, just like the original Express.js service
    return { games, total };
  }async getFilterGamesCLCMS(limit: number, skip: number, criteria: string, integrationChannelCode: string, categoryId: string): Promise<any> {
    const filter: any[] = [{ title: new RegExp(criteria, 'i') }];

    if (integrationChannelCode !== '') {
      filter.push({ integrationChannelCode: integrationChannelCode });
    }

    if (categoryId !== '') {
      filter.push({ category: new this.casinoLiveModel.base.Types.ObjectId(categoryId) });
    }

    const games = await this.casinoLiveModel
      .find({ $and: filter })
      .skip(skip * limit)
      .limit(limit)
      .sort({ position: 1, title: 1 });

    const total = await this.casinoLiveModel.find({ $and: filter }).countDocuments();
    
    // Return only games and total, just like the original Express.js service
    return { games, total };
  }

  async getFilterGamesCLCMSArray(limit: number, skip: number, criteria: string, integrationChannelCode: string, categoryId: string): Promise<any> {
    const filter: any[] = [{ title: new RegExp(criteria, 'i') }];

    if (integrationChannelCode !== '') {
      filter.push({ integrationChannelCode: integrationChannelCode });
    }

    if (categoryId !== '') {
      filter.push({ category: categoryId });
    }

    const games = await this.casinoLiveModel
      .find({ $and: filter })
      .skip(skip * limit)
      .limit(limit)
      .sort({ position: 1, title: 1 });

    const total = await this.casinoLiveModel.find({ $and: filter }).countDocuments();
    
    // Return only games and total, just like the original Express.js service
    return { games, total };
  }  async getCLGames(iosVersion?: string): Promise<any> {
    let limit = 10000;
    if (process.env.IOS_VERSION_TEST === iosVersion && process.env.IOS_TEST_ACTIVE) limit = 1;

    const games = await this.casinoLiveModel
      .find(
        { state: 'active' },
        {
          msIllustrative: 0,
          msBanner: 0,
          msBannerMod: 0,
          gDescTitle: 0,
          gDescSubtitle: 0,
          gDescText: 0,
          wGameTitle: 0,
          wGameDesc: 0,
        }
      )
      .limit(limit);

    games.forEach((game: any, index: number) => {
      games[index].category = Array.isArray(game.category) ? game.category[0] : game.category;
    });

    // Return only the games array, just like the original Express.js service
    return games;
  }  async getGamesByTags(tags: string[], limit: number): Promise<any> {
    try {
      const result = await this.casinoLiveModel.aggregate([
        {
          $match: {
            tags: { $in: tags }
          }
        },
        {
          $addFields: {
            matchCount: {
              $size: {
                $filter: {
                  input: '$tags',
                  as: 'tag',
                  cond: { $in: ['$$tag', tags] }
                }
              }
            }
          }
        },
        {
          $sort: { matchCount: -1 }
        },
        {
          $limit: limit
        }
      ]);

      // Return only the result array, just like the original Express.js service
      return result;
    } catch (err) {
      throw err;
    }
  }  async getGamesCriteria(limit: number, skip: number, criteria: string, iosVersion?: string): Promise<any> {
    if (process.env.IOS_VERSION_TEST === iosVersion && process.env.IOS_TEST_ACTIVE) limit = 1;

    const count = await this.casinoLiveModel.find({
      $or: [
        { title: new RegExp(criteria, 'i') },
        { integrationChannelCode: new RegExp(criteria, 'i') },
      ],
    }, {
      msIllustrative: 0,
      msBanner: 0,
      msBannerMod: 0,
      gDescTitle: 0,
      gDescSubtitle: 0,
      gDescText: 0,
      wGameTitle: 0,
      wGameDesc: 0,
    }).countDocuments();

    const response = await this.casinoLiveModel.aggregate([
      {
        $match: {
          $or: [
            { title: new RegExp(criteria, 'i') },
            { integrationChannelCode: new RegExp(criteria, 'i') },
          ],
        },
      },
      { $skip: parseInt(skip.toString()) * parseInt(limit.toString()) },
      { $limit: parseInt(limit.toString()) },
      { $sort: { sort: 1, date: 1 } },
    ]);

    response.forEach((game: any, index: number) => {
      response[index].category = Array.isArray(game.category) ? game.category[0] : game.category;
    });

    // Return only {count, data}, just like the original Express.js service
    return { count, data: response };
  }

  // ============= MASSIVE OPERATIONS =============

  async clGameMasiveCharge(file: any): Promise<any> {
    // Excel reading logic would go here
    // This is a complex operation that would need proper Excel handling
    // For now, return a placeholder
    throw new BadRequestException('Massive charge functionality not yet implemented');
  }

  async deleteClGameMasive(file: any): Promise<any> {
    // Excel reading logic would go here
    // This is a complex operation that would need proper Excel handling
    // For now, return a placeholder
    throw new BadRequestException('Massive delete functionality not yet implemented');
  }
}
