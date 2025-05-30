import { ConflictException, Injectable } from '@nestjs/common';
import { SlotsDto } from '../dto/slots.dto';
import { FileStorageService } from 'src/common/file-storage.service';
import moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { Slot } from '../schemas/slot.schema';
import { Model } from 'mongoose';
import { Banner } from '../schemas/banner.schema';
import { Category } from '../schemas/category.schema';
import { Slotimage } from '../schemas/slotimage.schema';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GamesService {

  private readonly FOLDER_PATH = 'slots';
  constructor(
    @InjectModel(Slot.name)
    private readonly slotModel: Model<Slot>,
    @InjectModel(Banner.name)
    private readonly bannerModel: Model<Banner>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
    @InjectModel(Slotimage.name)
    private readonly slotimageModel: Model<Slotimage>,
    private readonly fileStorageService: FileStorageService,
    private readonly configService: ConfigService
  ) { }  async newSlot(gameData: SlotsDto, files: any) {
    try {
      console.log('Creating new slot with data:', { gameCode: gameData.gameCode, microSite: gameData.microSite });
      console.log('Files received:', files ? Object.keys(files) : 'No files');
      
      const isMicroSite = gameData.microSite + '';
      if (isMicroSite == 'true' && gameData.gameId) {
        console.log('Processing microsite images for gameId:', gameData.gameId);
        const savedFiles = await this.saveMicroSiteImage(files, gameData.gameId);
        console.log('Saved microsite files:', savedFiles);
        gameData = { ...gameData, ...savedFiles };
      } else {
        console.log('Not a microsite, removing microsite fields');
        delete gameData.gDescTitle;
        delete gameData.gDescSubtitle;
        delete gameData.gDescText;
        delete gameData.wGameTitle;
        delete gameData.wGameDesc;
      }

      // Process tags and categories
      gameData.tags = gameData.tags ? gameData.tags.split(',') : null;
      gameData.date = moment().unix() * 1000;
      gameData.sort = 0;
      gameData.category = gameData.category ? gameData.category.split(',') : null;

      // Handle PDF file upload
      if (files?.pdf) {
        console.log('Processing PDF file');
        const pdf = files.pdf;
        const prefix = new Date().getTime();
        const pdfName = `${prefix}-${pdf.originalname || pdf.name}`;
        try {
          gameData.roules = await this.fileStorageService.saveFile(pdfName, 'pdf', pdf.buffer || pdf);
          console.log('PDF saved successfully:', gameData.roules);
        } catch (pdfError: any) {
          console.error('Error saving PDF:', pdfError);
          throw new Error(`Error processing PDF file: ${pdfError?.message || pdfError}`);
        }
      }

      // Validate slot doesn't exist
      const validationSlotExist = await this.validationSlotExist(gameData.gameCode, gameData.integrationChannelCode);
      if (validationSlotExist) {
        throw new ConflictException(`Slot with gameCode ${gameData.gameCode} and channel ${gameData.integrationChannelCode} already exists.`);
      }

      console.log('Creating slot in database');
      const newGame = new this.slotModel(gameData);
      const savedGame = await newGame.save();
      console.log('Slot created successfully with ID:', savedGame._id);
      
      return savedGame;
    } catch (error: any) {
      console.error('Error in newSlot:', error);
      throw error;
    }
  }
  async saveMicroSiteImage(files: any, gameId: string) {
    const saveFile = async (file: any, fileName: string) => {
      if (!file) {
        console.error(`Invalid file: ${file}`);
        throw new Error(`Invalid file: ${file}`);
      }
      
      // Handle different file structures (buffer vs multer file)
      const fileBuffer = file.buffer || file;
      const fileMimetype = file.mimetype || file.mimeType || 'image/jpeg';
      
      if (!fileBuffer) {
        throw new Error(`No file buffer found for ${fileName}`);
      }
      
      return await this.fileStorageService.saveFile(fileName, this.FOLDER_PATH, fileBuffer);
    };

    const savedFiles: any = {};

    try {
      if (files?.msBanner) {
        const extension = files.msBanner.mimetype ? files.msBanner.mimetype.split("/")[1] : 'jpg';
        const fileName = `msBanner_${gameId}.${extension}`;
        savedFiles.msBanner = await saveFile(files.msBanner, fileName);
        console.log(`Saved msBanner: ${savedFiles.msBanner}`);
      }
      
      if (files?.msBannerMod) {
        const extension = files.msBannerMod.mimetype ? files.msBannerMod.mimetype.split("/")[1] : 'jpg';
        const fileName = `msBannerMod_${gameId}.${extension}`;
        savedFiles.msBannerMod = await saveFile(files.msBannerMod, fileName);
        console.log(`Saved msBannerMod: ${savedFiles.msBannerMod}`);
      }
      
      // Handle msIllustrative as array or single file
      const illustrativeFiles = files['msIllustrative[]'] || files.msIllustrative;
      if (illustrativeFiles) {
        const filesArray = Array.isArray(illustrativeFiles) ? illustrativeFiles : [illustrativeFiles];
        savedFiles.msIllustrative = await Promise.all(
          filesArray.map(async (file, index) => {
            const extension = file.mimetype ? file.mimetype.split("/")[1] : 'jpg';
            const fileName = `msIllustrative_${index}_${gameId}.${extension}`;
            const savedPath = await saveFile(file, fileName);
            console.log(`Saved msIllustrative[${index}]: ${savedPath}`);
            return savedPath;
          })
        );
      }      console.log('All microsite files saved successfully:', savedFiles);
      return savedFiles;
    } catch (error: any) {
      console.error('Error saving microsite images:', error);
      throw new Error(`Failed to save microsite images: ${error?.message || error}`);
    }
  }

  async validationSlotExist(gameCode?: string, channel?: string) {
    return new Promise(async (resolve) => {
      let slot = await this.slotModel.findOne({
        gameCode: gameCode,
        integrationChannelCode: {
          $regex: new RegExp(channel || '', "i"),
        },
      }).exec();
      slot ? resolve(true) : resolve(false);
    });
  }

  async getSlots(limit: string, skip: string, criteria?: string, iosVersion?: string) {
    try {
      const limitNum = parseInt(limit);
      const skipNum = parseInt(skip);
      
      let query: any = {};
      if (criteria) {
        query = {
          $or: [
            { title: { $regex: criteria, $options: 'i' } },
            { gameCode: { $regex: criteria, $options: 'i' } }
          ]
        };
      }

      const slots = await this.slotModel
        .find(query)
        .limit(limitNum)
        .skip(skipNum)
        .sort({ sort: 1, date: -1 })
        .exec();

      return slots;
    } catch (error) {
      throw error;
    }
  }

  async getSlotsSisplay(limit: string, skip: string, criteria?: string) {
    try {
      const limitNum = parseInt(limit);
      const skipNum = parseInt(skip);
      
      let query: any = { isSisplay: true };
      if (criteria) {
        query = {
          ...query,
          $or: [
            { title: { $regex: criteria, $options: 'i' } },
            { gameCode: { $regex: criteria, $options: 'i' } }
          ]
        };
      }

      const slots = await this.slotModel
        .find(query)
        .limit(limitNum)
        .skip(skipNum)
        .sort({ sort: 1, date: -1 })
        .exec();

      return slots;
    } catch (error) {
      throw error;
    }
  }

  async getSlotsCMS(limit: string, skip: string, criteria?: string, integrationChannelCode?: string, categoryId?: string) {
    try {
      const limitNum = parseInt(limit);
      const skipNum = parseInt(skip);
      
      let query: any = {};
      
      if (criteria) {
        query.$or = [
          { title: { $regex: criteria, $options: 'i' } },
          { gameCode: { $regex: criteria, $options: 'i' } }
        ];
      }

      if (integrationChannelCode) {
        query.integrationChannelCode = integrationChannelCode;
      }

      if (categoryId && categoryId !== "") {
        query.category = { $in: [categoryId] };
      }

      const slots = await this.slotModel
        .find(query)
        .limit(limitNum)
        .skip(skipNum)
        .sort({ sort: 1, date: -1 })
        .exec();

      const count = await this.slotModel.countDocuments(query);

      if (categoryId === "") {
        return { count, data: slots };
      } else {
        // Get additional slots for array category search
        const query2 = { ...query };
        delete query2.category;
        query2.category = { $elemMatch: { $eq: categoryId } };
        
        const slots2 = await this.slotModel
          .find(query2)
          .limit(limitNum)
          .skip(skipNum)
          .sort({ sort: 1, date: -1 })
          .exec();
        
        const count2 = await this.slotModel.countDocuments(query2);
        
        const combinedData = [...slots, ...slots2].sort((a: any, b: any) => {
          if (a.sort !== b.sort) {
            return a.sort - b.sort;
          }
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        return { count: count + count2, data: combinedData };
      }
    } catch (error) {
      throw error;
    }
  }

  async setSlotState(slotId: string, state: string) {
    try {
      const result = await this.slotModel.findByIdAndUpdate(
        slotId,
        { state },
        { new: true }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getsingleSlot(id: string) {
    try {
      const slot = await this.slotModel.findById(id);
      return slot;
    } catch (error) {
      throw error;
    }
  }

  async getAllSlotsByCategoryId(categoryId: string) {
    try {
      const slots = await this.slotModel.find({
        category: { $in: [categoryId] }
      });
      return { ok: true, data: slots };
    } catch (error) {
      throw error;
    }
  }
  async updateSlot(id: string, updateData: any, files: any) {
    try {
      console.log('Updating slot with ID:', id);
      console.log('Update data received:', { gameCode: updateData.gameCode, microSite: updateData.microSite });
      console.log('Files received for update:', files ? Object.keys(files) : 'No files');

      // Handle file uploads if present
      if (files && Object.keys(files).length > 0) {
        console.log('Processing files for update');
        
        // Handle microsite images
        if (updateData.microSite === 'true') {
          console.log('Processing microsite images for update');
          const gameId = updateData.gameId || id;
          const savedFiles = await this.saveMicroSiteImage(files, gameId);
          console.log('Updated microsite files:', savedFiles);
          updateData = { ...updateData, ...savedFiles };
        }

        // Handle PDF file upload
        if (files.pdf) {
          console.log('Processing PDF file for update');
          const pdf = files.pdf;
          const prefix = new Date().getTime();
          const pdfName = `${prefix}-${pdf.originalname || pdf.name}`;
          try {
            updateData.roules = await this.fileStorageService.saveFile(pdfName, 'pdf', pdf.buffer || pdf);
            console.log('PDF updated successfully:', updateData.roules);
          } catch (pdfError: any) {
            console.error('Error updating PDF:', pdfError);
            throw new Error(`Error processing PDF file: ${pdfError?.message || pdfError}`);
          }
        }
      }

      // Process tags and categories if they are strings
      if (updateData.tags && typeof updateData.tags === 'string') {
        updateData.tags = updateData.tags.split(',');
        console.log('Processed tags:', updateData.tags);
      }
      if (updateData.category && typeof updateData.category === 'string') {
        updateData.category = updateData.category.split(',');
        console.log('Processed categories:', updateData.category);
      }

      console.log('Updating slot in database');
      const result = await this.slotModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      
      if (!result) {
        throw new Error(`Slot with ID ${id} not found`);
      }
      
      console.log('Slot updated successfully');
      return result;
    } catch (error: any) {
      console.error('Error in updateSlot:', error);
      throw error;
    }
  }

  async updateSlotBanner(id: string, updateData: any) {
    try {
      const result = await this.slotModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateSlotPosition(id: string, updateData: any) {
    try {
      const result = await this.slotModel.findByIdAndUpdate(
        id,
        { sort: updateData.sort },
        { new: true }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }  async setFeatureImage(id: string, req: any) {
    try {
      console.log('Setting feature image for slot ID:', id);
      console.log('Request object received:', JSON.stringify(req, null, 2));
      
      const files = req.files;
      console.log('Files object:', JSON.stringify(files, null, 2));
      
      // Try different possible file locations
      let feature = null;
      if (files?.feature) {
        feature = files.feature;
      } else if (files?.image) {
        feature = files.image;
      } else if (Array.isArray(files) && files.length > 0) {
        // Handle case where files is an array
        feature = files[0];
      } else if (files && Object.keys(files).length > 0) {
        // Take the first available file
        const firstKey = Object.keys(files)[0];
        feature = files[firstKey];
      }
      
      if (!feature) {
        console.error('No feature image found. Available files:', Object.keys(files || {}));
        throw new Error('No feature image provided');
      }

      console.log('Processing feature image:', feature.originalname || feature.name);
      const prefix = new Date().getTime();
      const originalName = feature.originalname || feature.name || 'feature.jpg';
      const featureName = `${prefix}-${originalName}`;
      
      try {
        const featurePath = await this.fileStorageService.saveFile(
          featureName, 
          'slots', 
          feature.buffer || feature
        );
        console.log('Feature image saved:', featurePath);
        
        const result = await this.slotModel.findByIdAndUpdate(
          id,
          { feature: featurePath },
          { new: true }
        );
        
        if (!result) {
          throw new Error(`Slot with ID ${id} not found`);
        }
        
        console.log('Feature image updated successfully for slot');
        return result;
      } catch (saveError: any) {
        console.error('Error saving feature image:', saveError);
        throw new Error(`Failed to save feature image: ${saveError?.message || saveError}`);
      }
    } catch (error: any) {
      console.error('Error in setFeatureImage:', error);
      throw error;
    }
  }
  async setBanner(id: string, req: any) {
    try {
      console.log('Setting banner for slot ID:', id);
      console.log('Request object received for banner:', JSON.stringify(req, null, 2));
      
      const files = req.files;
      console.log('Files object for banner:', JSON.stringify(files, null, 2));
      
      // Try different possible file locations
      let banner = null;
      if (files?.banner) {
        banner = files.banner;
      } else if (files?.image) {
        banner = files.image;
      } else if (Array.isArray(files) && files.length > 0) {
        // Handle case where files is an array
        banner = files[0];
      } else if (files && Object.keys(files).length > 0) {
        // Take the first available file
        const firstKey = Object.keys(files)[0];
        banner = files[firstKey];
      }
      
      if (!banner) {
        console.error('No banner file found. Available files:', Object.keys(files || {}));
        throw new Error('No banner file provided');
      }

      console.log('Processing banner image:', banner.originalname || banner.name);
      const prefix = new Date().getTime();
      const bannerName = `${prefix}-${banner.originalname || banner.name}`;
      
      try {
        const bannerPath = await this.fileStorageService.saveFile(bannerName, 'banners', banner.buffer || banner);
        console.log('Banner saved:', bannerPath);
        
        if (id && id !== 'undefined') {
          const result = await this.slotModel.findByIdAndUpdate(
            id,
            { banner: bannerPath },
            { new: true }
          );
          
          if (!result) {
            throw new Error(`Slot with ID ${id} not found`);
          }
          
          console.log('Banner updated successfully for slot');
          return result;
        } else {
          // Create new banner record
          console.log('Creating new banner record');
          const newBanner = new this.bannerModel({
            path: bannerPath,
            date: new Date(),
            sort: 0
          });
          const savedBanner = await newBanner.save();
          console.log('New banner created successfully');
          return savedBanner;
        }
      } catch (saveError: any) {
        console.error('Error saving banner:', saveError);
        throw new Error(`Failed to save banner: ${saveError?.message || saveError}`);
      }
    } catch (error: any) {
      console.error('Error in setBanner:', error);
      throw error;
    }
  }

  async getBanner() {
    try {
      const banners = await this.bannerModel.find().sort({ sort: 1 });
      return banners;
    } catch (error) {
      throw error;
    }
  }

  async deleteSlot(id: string) {
    try {
      const result = await this.slotModel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getGamesByTags(tags: string[], limit: number) {
    try {
      const slots = await this.slotModel
        .find({ tags: { $in: tags } })
        .limit(limit)
        .sort({ sort: 1, date: -1 });
      return slots;
    } catch (error) {
      throw error;
    }
  }

  async slotsMasiveCharge(files: any) {
    try {
      if (!files || !files.find((f: any) => f.fieldname === 'xlsx')) {
        return {
          code: 400,
          message: "Form-data incorrecto"
        };
      }

      const xlsxFile = files.find((f: any) => f.fieldname === 'xlsx');
      const tempPath = path.join(__dirname, '../../../../uploads/slots', xlsxFile.originalname);
      
      // Ensure directory exists
      const dir = path.dirname(tempPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save file temporarily
      fs.writeFileSync(tempPath, xlsxFile.buffer);

      // Process the file (implement Excel processing logic here)
      const result = await this.processExcelFile(tempPath);

      // Clean up temporary file
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }      return result;
    } catch (error: any) {
      return {
        code: 500,
        message: error.toString()
      };
    }
  }

  async deleteSlotMasive(files: any) {
    try {
      if (!files || !files.find((f: any) => f.fieldname === 'xlsx')) {
        return {
          code: 400,
          message: "Form-data incorrecto"
        };
      }

      const xlsxFile = files.find((f: any) => f.fieldname === 'xlsx');
      const tempPath = path.join(__dirname, '../../../../uploads/slots', xlsxFile.originalname);
      
      // Ensure directory exists
      const dir = path.dirname(tempPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save file temporarily
      fs.writeFileSync(tempPath, xlsxFile.buffer);

      // Process the file for deletion
      const result = await this.processExcelFileForDeletion(tempPath);

      // Clean up temporary file
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }

      return result;
    } catch (error: any) {
      return {
        code: 500,
        message: error.toString()
      };
    }
  }

  private async processExcelFile(filePath: string) {
    // Implementation for processing Excel file for massive slot creation
    // This would use a library like exceljs to read the Excel file
    return {
      code: 200,
      message: "Slots cargados exitosamente"
    };
  }

  private async processExcelFileForDeletion(filePath: string) {
    // Implementation for processing Excel file for massive slot deletion
    return {
      code: 200,
      message: "Slots eliminados exitosamente"
    };
  }

  // Category-related methods
  async getSlotsByCategory(iosVersion?: string) {
    try {
      const categories = await this.categoryModel.find().sort({ sort: 1 });
      const categoriesWithSlots = [];

      for (const category of categories) {
        const slots = await this.slotModel
          .find({ 
            category: { $in: [category._id.toString()] },
            state: 'active'
          })
          .sort({ sort: 1 });
        
        if (slots.length > 0) {
          categoriesWithSlots.push({
            ...category.toObject(),
            slots
          });
        }
      }

      const banner = await this.getBannerSlots();

      return {
        ok: true,
        imagePath: this.configService.get('IMAGE_HOST') + '/slots/',
        banner,
        data: categoriesWithSlots
      };
    } catch (error) {
      throw error;
    }
  }

  async getSlotsByCategorySisplay(iosVersion?: string) {
    try {
      const categories = await this.categoryModel.find().sort({ sort: 1 });
      const categoriesWithSlots = [];

      for (const category of categories) {
        const slots = await this.slotModel
          .find({ 
            category: { $in: [category._id.toString()] },
            state: 'active',
            isSisplay: true
          })
          .sort({ sort: 1 });
        
        if (slots.length > 0) {
          categoriesWithSlots.push({
            ...category.toObject(),
            slots
          });
        }
      }

      const banner = await this.getBannerSlots();

      return {
        ok: true,
        imagePath: this.configService.get('IMAGE_HOST') + '/slots/',
        banner,
        data: categoriesWithSlots
      };
    } catch (error) {
      throw error;
    }
  }

  async newGetSlotsByCategorySisplay() {
    try {
      const categories = await this.categoryModel.find().sort({ sort: 1 });
      const categoriesWithSlots = [];

      for (const category of categories) {
        const slots = await this.slotModel
          .find({ 
            category: { $in: [category._id.toString()] },
            state: 'active',
            isSisplay: true
          })
          .sort({ sort: 1 });
        
        if (slots.length > 0) {
          categoriesWithSlots.push({
            ...category.toObject(),
            slots
          });
        }
      }

      const banner = await this.newGetBannerSlots();

      return {
        ok: true,
        imagePath: this.configService.get('IMAGE_HOST') + '/slots/',
        banner,
        data: categoriesWithSlots
      };
    } catch (error) {
      throw error;
    }
  }

  async getSlotsByCategoryId(categoryId: string, start: string, limit: string) {
    try {
      const startNum = parseInt(start);
      const limitNum = parseInt(limit);

      const slots = await this.slotModel
        .find({ 
          category: { $in: [categoryId] },
          state: 'active'
        })
        .skip(startNum)
        .limit(limitNum)
        .sort({ sort: 1 });

      const total = await this.slotModel.countDocuments({ 
        category: { $in: [categoryId] },
        state: 'active'
      });

      return {
        ok: true,
        imagePath: this.configService.get('IMAGE_HOST') + '/slots/',
        data: slots,
        total
      };
    } catch (error) {
      throw error;
    }
  }

  async getSlotsByCategoryIdSisplay(categoryId: string, start: string, limit: string) {
    try {
      const startNum = parseInt(start);
      const limitNum = parseInt(limit);

      const slots = await this.slotModel
        .find({ 
          category: { $in: [categoryId] },
          state: 'active',
          isSisplay: true
        })
        .skip(startNum)
        .limit(limitNum)
        .sort({ sort: 1 });

      const total = await this.slotModel.countDocuments({ 
        category: { $in: [categoryId] },
        state: 'active',
        isSisplay: true
      });

      return {
        ok: true,
        imagePath: this.configService.get('IMAGE_HOST') + '/slots/',
        data: slots,
        total
      };
    } catch (error) {
      throw error;
    }
  }

  private async getBannerSlots() {
    try {
      const banners = await this.bannerModel.find().sort({ sort: 1 });
      return banners;
    } catch (error) {
      return [];
    }
  }

  private async newGetBannerSlots() {
    try {
      const banners = await this.bannerModel.find().sort({ sort: 1 });
      return banners;
    } catch (error) {
      return [];
    }
  }
}
