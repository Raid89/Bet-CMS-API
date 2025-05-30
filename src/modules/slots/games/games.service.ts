import { ConflictException, Injectable } from '@nestjs/common';
import { SlotsDto } from '../dto/slots.dto';
import { FileStorageService } from 'src/common/file-storage.service';
import moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { Slot } from '../schemas/slot.schema';
import { Model } from 'mongoose';

@Injectable()
export class GamesService {

  private readonly FOLDER_PATH = 'slots';

  constructor(
    @InjectModel(Slot.name)
    private readonly slotModel: Model<Slot>,
    private readonly fileStorageService: FileStorageService
  ) { }

  async create(gameData: SlotsDto, files: any) {
    try {
      console.log('Received gameData:', typeof gameData.microSite);
      const isMicroSite = gameData.microSite + '';
      if (isMicroSite == 'true' && gameData.gameId) {
        const savedFiles = await this.saveMicroSiteImage(files, gameData.gameId);
        console.log('Saved files:', savedFiles);
        gameData = { ...gameData, ...savedFiles };
      } else {
        delete gameData.gDescTitle;
        delete gameData.gDescSubtitle;
        delete gameData.gDescText;
        delete gameData.wGameTitle;
        delete gameData.wGameDesc;
      }

      gameData.tags = gameData.tags ? gameData.tags.split(',') : null;
      gameData.date = moment().unix() * 1000;
      gameData.sort = 0;
      gameData.category = gameData.category ? gameData.category.split(',') : null;

      if (files.pdf) {
        const pdf = files.pdf;
        const prefix = new Date().getTime();
        const pdfName = `${prefix}-${pdf.name}`;
        gameData.roules = await this.fileStorageService.saveFile(pdfName, 'pdf', pdf);
      }

      const validationSlotExist = await this.validationSlotExist(gameData.gameCode, gameData.integrationChannelCode);

      if (validationSlotExist) {
        throw new ConflictException(`Slot with gameCode ${gameData.gameCode} and channel ${gameData.integrationChannelCode} already exists.`);
      }

      const newGame = new this.slotModel(gameData);
      const savedGame = await newGame.save();
      return savedGame;
    } catch (error) {
      throw error;
    }
  }

  async saveMicroSiteImage(files: any, gameId: string) {
    const saveFile = (file: any, fileName: any) => {
      if (!file) {
        console.error(`Invalid file or file.mv method: ${file}`);
        throw new Error(`Invalid file or file.mv method: ${file}`);
      }
      return this.fileStorageService.saveFile(fileName, this.FOLDER_PATH, file);
    };

    const savedFiles: any = {};

    if (files?.msBanner) {
      const extension = files.msBanner.mimetype.split("/")[1];
      savedFiles.msBanner = await saveFile(files.msBanner, `msBanner_${gameId}.${extension}`);
    }
    if (files?.msBannerMod) {
      const extension = files.msBannerMod.mimetype.split("/")[1];
      savedFiles.msBannerMod = await saveFile(files.msBannerMod, `msBannerMod_${gameId}.${extension}`);
    }
    if (files && files['msIllustrative[]'] && Array.isArray(files['msIllustrative[]'])) {
      savedFiles.msIllustrative = await Promise.all(files['msIllustrative[]'].map((file, index) => {
        const extension = file.mimetype.split("/")[1];
        return saveFile(file, `msIllustrative_${index}_${gameId}.${extension}`);
      }));
    }

    return savedFiles;
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
}
