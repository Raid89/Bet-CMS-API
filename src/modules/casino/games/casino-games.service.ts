import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CasinoLive, CasinoLiveDocument } from '../schemas/casino-live.schema';
import { CreateCasinoLiveDto, UpdateCasinoLiveDto } from '../dto/casino-live.dto';
import { FileStorageService } from '../../../common/file-storage.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CasinoGamesService {
  constructor(
    @InjectModel(CasinoLive.name) private casinoLiveModel: Model<CasinoLiveDocument>,
    private fileStorageService: FileStorageService,
    private configService: ConfigService
  ) {}

  async createGame(createGameDto: CreateCasinoLiveDto, files: any): Promise<CasinoLive> {
    try {
      console.log('Creating casino live game with data:', createGameDto);
      console.log('Files received:', files);

      if (!files || (!files.image && !files.icon)) {
        throw new BadRequestException('Both image and icon files are required');
      }      const gameData: any = { ...createGameDto };

      // Handle image upload
      if (files.image) {
        console.log('Processing image file...');
        const imageFileName = `${Date.now()}_${files.image.originalname || files.image.name || 'image.jpg'}`;
        const imagePath = await this.fileStorageService.saveFile(imageFileName, 'cl', files.image);
        gameData.image = imageFileName;
      }

      // Handle icon upload
      if (files.icon) {
        console.log('Processing icon file...');
        const iconFileName = `${Date.now()}_${files.icon.originalname || files.icon.name || 'icon.jpg'}`;
        const iconPath = await this.fileStorageService.saveFile(iconFileName, 'cl', files.icon);
        gameData.icon = iconFileName;
      }

      gameData.date = new Date();

      const createdGame = new this.casinoLiveModel(gameData);
      const result = await createdGame.save();
      
      console.log('Casino live game created successfully:', result._id);
      return result;
    } catch (error) {
      console.error('Error creating casino live game:', error);
      throw error;
    }
  }

  async updateGame(id: string, updateGameDto: UpdateCasinoLiveDto, files?: any): Promise<CasinoLive> {
    try {
      console.log(`Updating casino live game ${id} with data:`, updateGameDto);
      console.log('Files received:', files);

      const existingGame = await this.casinoLiveModel.findById(id);
      if (!existingGame) {
        throw new NotFoundException(`Casino live game with ID ${id} not found`);
      }      const updateData: any = { ...updateGameDto };

      // Handle image upload
      if (files?.image) {
        console.log('Processing new image file...');
        const imageFileName = `${Date.now()}_${files.image.originalname || files.image.name || 'image.jpg'}`;
        
        // Delete old image if exists
        if (existingGame.image) {
          try {
            await this.fileStorageService.deleteFile('cl', existingGame.image);
          } catch (deleteError) {
            console.warn('Could not delete old image:', deleteError);
          }
        }
        
        await this.fileStorageService.saveFile(imageFileName, 'cl', files.image);
        updateData.image = imageFileName;
      }

      // Handle icon upload
      if (files?.icon) {
        console.log('Processing new icon file...');
        const iconFileName = `${Date.now()}_${files.icon.originalname || files.icon.name || 'icon.jpg'}`;
        
        // Delete old icon if exists
        if (existingGame.icon) {
          try {
            await this.fileStorageService.deleteFile('cl', existingGame.icon);
          } catch (deleteError) {
            console.warn('Could not delete old icon:', deleteError);
          }
        }
        
        await this.fileStorageService.saveFile(iconFileName, 'cl', files.icon);
        updateData.icon = iconFileName;
      }

      const updatedGame = await this.casinoLiveModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      console.log('Casino live game updated successfully');
      return updatedGame!;
    } catch (error) {
      console.error('Error updating casino live game:', error);
      throw error;
    }
  }

  async deleteGame(id: string): Promise<{ deleted: boolean; message: string }> {
    try {
      console.log(`Deleting casino live game ${id}`);

      const existingGame = await this.casinoLiveModel.findById(id);
      if (!existingGame) {
        throw new NotFoundException(`Casino live game with ID ${id} not found`);
      }

      // Delete associated files
      if (existingGame.image) {
        try {
          await this.fileStorageService.deleteFile('cl', existingGame.image);
        } catch (deleteError) {
          console.warn('Could not delete image file:', deleteError);
        }
      }

      if (existingGame.icon) {
        try {
          await this.fileStorageService.deleteFile('cl', existingGame.icon);
        } catch (deleteError) {
          console.warn('Could not delete icon file:', deleteError);
        }
      }

      await this.casinoLiveModel.findByIdAndDelete(id);

      console.log('Casino live game deleted successfully');
      return {
        deleted: true,
        message: 'Casino live game deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting casino live game:', error);
      throw error;
    }
  }

  async getGamesCMS(limit: number = 30, skip: number = 0): Promise<{ games: CasinoLive[]; total: number; base_url: string }> {
    try {
      console.log(`Getting casino live games for CMS. Limit: ${limit}, Skip: ${skip}`);

      const games = await this.casinoLiveModel
        .find({})
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 });

      const total = await this.casinoLiveModel.countDocuments({});

      const baseUrl = `${this.configService.get('IMAGE_HOST')}/cl/`;

      return {
        games,
        total,
        base_url: baseUrl
      };
    } catch (error) {
      console.error('Error getting casino live games for CMS:', error);
      throw error;
    }
  }

  async getActiveGames(): Promise<{ games: CasinoLive[]; base_url: string }> {
    try {
      console.log('Getting active casino live games');

      const games = await this.casinoLiveModel
        .find({ state: 'active' })
        .sort({ position: 1, date: -1 });

      const baseUrl = `${this.configService.get('IMAGE_HOST')}/cl/`;

      return {
        games,
        base_url: baseUrl
      };
    } catch (error) {
      console.error('Error getting active casino live games:', error);
      throw error;
    }
  }

  async getGameById(id: string): Promise<CasinoLive> {
    try {
      console.log(`Getting casino live game by ID: ${id}`);

      const game = await this.casinoLiveModel.findById(id);
      if (!game) {
        throw new NotFoundException(`Casino live game with ID ${id} not found`);
      }

      return game;
    } catch (error) {
      console.error('Error getting casino live game by ID:', error);
      throw error;
    }
  }

  async setImage(id: string, req: any): Promise<{ message: string; imagePath: string }> {
    try {
      console.log('Setting image for casino live game ID:', id);
      console.log('Request object received:', JSON.stringify(req, null, 2));
      
      const files = req.files;
      console.log('Files object:', JSON.stringify(files, null, 2));
      
      // Try different possible file locations
      let imageFile = null;
      if (files?.image) {
        imageFile = files.image;
      } else if (files?.file) {
        imageFile = files.file;
      } else if (Array.isArray(files) && files.length > 0) {
        // Handle case where files is an array
        imageFile = files[0];
      } else if (files && Object.keys(files).length > 0) {
        // Take the first available file
        const firstKey = Object.keys(files)[0];
        imageFile = files[firstKey];
      }
      
      if (!imageFile) {
        console.error('No image file found. Available files:', Object.keys(files || {}));
        throw new BadRequestException('No image file provided');
      }

      console.log('Image file found:', imageFile);

      const existingGame = await this.casinoLiveModel.findById(id);
      if (!existingGame) {
        throw new NotFoundException(`Casino live game with ID ${id} not found`);
      }

      // Delete old image if exists
      if (existingGame.image) {
        try {
          await this.fileStorageService.deleteFile('cl', existingGame.image);
        } catch (deleteError) {
          console.warn('Could not delete old image:', deleteError);
        }
      }

      // Save new image
      const imageFileName = `${Date.now()}_${imageFile.originalname || imageFile.name || 'image.jpg'}`;
      const imagePath = await this.fileStorageService.saveFile(imageFileName, 'cl', imageFile);

      // Update game record
      await this.casinoLiveModel.findByIdAndUpdate(id, { image: imageFileName });

      console.log('Image set successfully:', imagePath);
      return {
        message: 'Image updated successfully',
        imagePath
      };
    } catch (error) {
      console.error('Error in setImage:', error);
      throw error;
    }
  }

  async setIcon(id: string, req: any): Promise<{ message: string; iconPath: string }> {
    try {
      console.log('Setting icon for casino live game ID:', id);
      console.log('Request object received:', JSON.stringify(req, null, 2));
      
      const files = req.files;
      console.log('Files object:', JSON.stringify(files, null, 2));
      
      // Try different possible file locations
      let iconFile = null;
      if (files?.icon) {
        iconFile = files.icon;
      } else if (files?.file) {
        iconFile = files.file;
      } else if (Array.isArray(files) && files.length > 0) {
        // Handle case where files is an array
        iconFile = files[0];
      } else if (files && Object.keys(files).length > 0) {
        // Take the first available file
        const firstKey = Object.keys(files)[0];
        iconFile = files[firstKey];
      }
      
      if (!iconFile) {
        console.error('No icon file found. Available files:', Object.keys(files || {}));
        throw new BadRequestException('No icon file provided');
      }

      console.log('Icon file found:', iconFile);

      const existingGame = await this.casinoLiveModel.findById(id);
      if (!existingGame) {
        throw new NotFoundException(`Casino live game with ID ${id} not found`);
      }

      // Delete old icon if exists
      if (existingGame.icon) {
        try {
          await this.fileStorageService.deleteFile('cl', existingGame.icon);
        } catch (deleteError) {
          console.warn('Could not delete old icon:', deleteError);
        }
      }

      // Save new icon
      const iconFileName = `${Date.now()}_${iconFile.originalname || iconFile.name || 'icon.jpg'}`;
      const iconPath = await this.fileStorageService.saveFile(iconFileName, 'cl', iconFile);

      // Update game record
      await this.casinoLiveModel.findByIdAndUpdate(id, { icon: iconFileName });

      console.log('Icon set successfully:', iconPath);
      return {
        message: 'Icon updated successfully',
        iconPath
      };
    } catch (error) {
      console.error('Error in setIcon:', error);
      throw error;
    }
  }
}
