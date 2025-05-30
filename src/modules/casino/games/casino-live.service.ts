import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CasinoLive, CasinoLiveDocument } from '../schemas/casino-live.schema';
import { CreateCasinoLiveDto, UpdateCasinoLiveDto } from '../dto/casino-live.dto';
import { FileStorageService } from '../../../common/file-storage.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CasinoLiveService {
  constructor(
    @InjectModel(CasinoLive.name) private casinoLiveModel: Model<CasinoLiveDocument>,
    private fileStorageService: FileStorageService,
    private configService: ConfigService
  ) {}

  async newGame(data: CreateCasinoLiveDto, files: any): Promise<CasinoLive> {
    try {
      console.log('Service newGame - Data:', data);
      console.log('Service newGame - Files:', files);

      if (!files || !files.image || !files.icon) {
        throw new BadRequestException('Both image and icon files are required');
      }

      // Process files similar to Express.js version
      const imageName = new Date().getTime() + (files.image.originalname || files.image.name || '.jpg');
      const iconName = new Date().getTime() + (files.icon.originalname || files.icon.name || '.jpg');

      console.log('Processing image:', imageName);
      console.log('Processing icon:', iconName);

      // Save files
      await this.fileStorageService.saveFile(imageName, 'cl', files.image);
      await this.fileStorageService.saveFile(iconName, 'cl', files.icon);

      // Create game data
      const gameData: any = {
        ...data,
        image: imageName,
        icon: iconName,
        date: new Date()
      };

      console.log('Creating game with data:', gameData);

      const createdGame = new this.casinoLiveModel(gameData);
      const result = await createdGame.save();
      
      console.log('Game created successfully:', result._id);
      return result;
    } catch (error) {
      console.error('Error in newGame:', error);
      throw error;
    }
  }

  async updateGame(id: string, data: UpdateCasinoLiveDto, files?: any): Promise<CasinoLive> {
    try {
      console.log(`Service updateGame - ID: ${id}`);
      console.log('Service updateGame - Data:', data);
      console.log('Service updateGame - Files:', files);

      const currentImage = await this.casinoLiveModel.findById(id);
      if (!currentImage) {
        throw new NotFoundException(`Casino live game with ID ${id} not found`);
      }

      const updateData: any = { ...data };

      // Handle image upload
      if (files && files.image) {
        const imageName = new Date().getTime() + (files.image.originalname || files.image.name || '.jpg');
        console.log('Updating image to:', imageName);
        
        await this.fileStorageService.saveFile(imageName, 'cl', files.image);
        updateData.image = imageName;
        
        // Delete old image
        if (currentImage.image) {
          try {
            await this.fileStorageService.deleteFile('cl', currentImage.image);
          } catch (deleteError) {
            console.warn('Could not delete old image:', deleteError);
          }
        }
      }

      // Handle icon upload
      if (files && files.icon) {
        const iconName = new Date().getTime() + (files.icon.originalname || files.icon.name || '.jpg');
        console.log('Updating icon to:', iconName);
        
        await this.fileStorageService.saveFile(iconName, 'cl', files.icon);
        updateData.icon = iconName;
        
        // Delete old icon
        if (currentImage.icon) {
          try {
            await this.fileStorageService.deleteFile('cl', currentImage.icon);
          } catch (deleteError) {
            console.warn('Could not delete old icon:', deleteError);
          }
        }
      }

      const updatedGame = await this.casinoLiveModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      console.log('Game updated successfully');
      return updatedGame!;
    } catch (error) {
      console.error('Error in updateGame:', error);
      throw error;
    }
  }

  async deleteGame(id: string): Promise<any> {
    try {
      console.log(`Service deleteGame - ID: ${id}`);

      const currentImage = await this.casinoLiveModel.findById(id);
      if (!currentImage) {
        throw new NotFoundException(`Casino live game with ID ${id} not found`);
      }

      // Delete files
      if (currentImage.image) {
        try {
          await this.fileStorageService.deleteFile('cl', currentImage.image);
        } catch (deleteError) {
          console.warn('Could not delete image file:', deleteError);
        }
      }

      if (currentImage.icon) {
        try {
          await this.fileStorageService.deleteFile('cl', currentImage.icon);
        } catch (deleteError) {
          console.warn('Could not delete icon file:', deleteError);
        }
      }

      const deletedGame = await this.casinoLiveModel.deleteOne({ _id: id });

      console.log('Game deleted successfully');
      return deletedGame;
    } catch (error) {
      console.error('Error in deleteGame:', error);
      throw error;
    }
  }

  async getGamesCLCMS(limit: number, skip: number): Promise<{ games: CasinoLive[]; total: number; base_url: string }> {
    try {
      console.log(`Service getGamesCLCMS - Limit: ${limit}, Skip: ${skip}`);

      const games = await this.casinoLiveModel
        .find({})
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 });

      const total = await this.casinoLiveModel.countDocuments({});

      const base_url = `${this.configService.get('IMAGE_HOST') || process.env.IMAGESHOST}/cl/`;

      console.log(`Found ${games.length} games, total: ${total}`);

      return {
        games,
        total,
        base_url
      };
    } catch (error) {
      console.error('Error in getGamesCLCMS:', error);
      throw error;
    }
  }

  async getFilterGamesCLCMS(limit: number, skip: number): Promise<{ games: CasinoLive[]; total: number; base_url: string }> {
    try {
      console.log('Service getFilterGamesCLCMS called with limit:', limit, 'skip:', skip);

      // Filtros adicionales para games filtrados (pueden incluir filtros específicos)
      const filter = { 
        state: 'active',
        // Agrega aquí filtros adicionales según necesidades del negocio
      };

      const [games, total] = await Promise.all([
        this.casinoLiveModel
          .find(filter)
          .sort({ position: 1, date: -1 })
          .limit(limit)
          .skip(skip),
        this.casinoLiveModel.countDocuments(filter)
      ]);

      const base_url = `${this.configService.get('IMAGE_HOST') || process.env.IMAGESHOST}/cl/`;

      console.log(`Found ${games.length} filtered games of ${total} total`);

      return {
        games,
        total,
        base_url
      };
    } catch (error) {
      console.error('Error in getFilterGamesCLCMS:', error);
      throw error;
    }
  }
  async getCLGames(): Promise<{ games: CasinoLive[]; base_url: string }> {
    try {
      console.log('Service getCLGames called');

      const games = await this.casinoLiveModel
        .find({ state: 'active' })
        .sort({ position: 1, date: -1 });

      const base_url = `${this.configService.get('IMAGE_HOST') || process.env.IMAGESHOST}/cl/`;

      console.log(`Found ${games.length} active games`);

      return {
        games,
        base_url
      };
    } catch (error) {
      console.error('Error in getCLGames:', error);
      throw error;
    }
  }

  // Channels methods
  async getChannelCodes(): Promise<any> {
    // Implementar lógica para obtener códigos de canal
    return { channelCodes: [] };
  }

  async newIntegrationChannelCode(channelData: any): Promise<any> {
    // Implementar lógica para crear nuevo código de canal
    return { channelCode: channelData };
  }

  async deleteChannelCode(id: string): Promise<any> {
    // Implementar lógica para eliminar código de canal
    return { deleted: true };
  }

  // Banners methods
  async addPromoBanner(bannerData: any, files: any): Promise<any> {
    // Implementar lógica para añadir banner promocional
    return { banner: bannerData };
  }

  async newGetCLBanners(): Promise<any> {
    // Implementar lógica para obtener banners CL
    return { banners: [] };
  }

  async removePromoBanner(id: string): Promise<any> {
    // Implementar lógica para eliminar banner promocional
    return { deleted: true };
  }

  async updatePromoBanner(id: string, bannerData: any, files: any): Promise<any> {
    // Implementar lógica para actualizar banner promocional
    return { updated: true };
  }

  // Categories methods
  async getCategories(): Promise<any> {
    // Implementar lógica para obtener categorías
    return { categories: [] };
  }

  async newCategory(categoryData: any): Promise<any> {
    // Implementar lógica para crear nueva categoría
    return { category: categoryData };
  }

  async deleteCategory(id: string): Promise<any> {
    // Implementar lógica para eliminar categoría
    return { deleted: true };
  }

  async updateCategory(id: string, categoryData: any): Promise<any> {
    // Implementar lógica para actualizar categoría
    return { updated: true };
  }

  async getCategoriesCL(): Promise<any> {
    // Implementar lógica para obtener categorías CL
    return { categories: [] };
  }

  // Masive operations methods
  async clGameMasiveCharge(gameData: any): Promise<any> {
    // Implementar lógica para carga masiva de juegos
    return { charged: true };
  }

  async deleteClGameMasive(gameData: any): Promise<any> {
    // Implementar lógica para eliminación masiva de juegos
    return { deleted: true };
  }

  // Additional methods
  async getSingleCLGame(id: string): Promise<any> {
    try {
      const game = await this.casinoLiveModel.findById(id);
      if (!game) {
        throw new NotFoundException('Game not found');
      }
      return game;
    } catch (error) {
      throw new NotFoundException('Game not found');
    }
  }

  async getGamesByTags(tagData: any): Promise<any> {
    // Implementar lógica para obtener juegos por tags
    return { games: [] };
  }

  async getGamesCriteria(limit: number, skip: number): Promise<any> {
    try {
      const games = await this.casinoLiveModel
        .find()
        .limit(limit)
        .skip(skip)
        .exec();

      const total = await this.casinoLiveModel.countDocuments();

      return {
        games,
        total,
        base_url: this.configService.get<string>('BASE_URL') || 'http://localhost:3000'
      };
    } catch (error) {
      throw new BadRequestException('Error fetching games by criteria');
    }
  }
}
