import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { BannerSlotsDocument } from './schemas/slots-banners.controller';
import { Model } from 'mongoose';
import { NextLoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class SlotsBannersService {

  constructor(
    @InjectModel(BannerSlotsDocument.name)
    private readonly bannerSlotsModel: Model<BannerSlotsDocument>,

    private readonly logger: NextLoggerService
  ) {}

  create(createBannerDto: CreateBannerDto) {
    return 'This action adds a new banner';
  }

  findAll() {
    return `This action returns all banners`;
  }

  findOne(id: number) {
    return `This action returns a #${id} banner`;
  }

  update(id: number, updateBannerDto: UpdateBannerDto) {
    return `This action updates a #${id} banner`;
  }

  remove(id: number) {
    return `This action removes a #${id} banner`;
  }

  async findBannersSlots(withDestionationUrl: number): Promise<BannerSlotsDocument[]> {
    this.logger.log('Buscando todos los banners', 'findBannersSlots');

    try {
      return this.bannerSlotsModel
        .find({}, { destinationUrl: withDestionationUrl })
        .sort({ sort: 1, _id: 1});
    } catch (error) {
      this.logger.error('Error buscando todos los banners', 'findBannersSlots', JSON.stringify(error));
      throw error;
    }
  }
}
