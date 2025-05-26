import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banners } from './banners.schema';
import { CreateBannerDto, UpdateBannerDto } from './dto/banners.dto';
import { FileStorageService } from '../../../common/file-storage.service';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banners.name) private bannersModel: Model<Banners>,
    private readonly fileStorageService: FileStorageService
  ) {}

  async create(dto: CreateBannerDto, imageBuffer: Buffer) {
    const banner = new this.bannersModel({
      ...dto,
      createdAt: new Date(),
    });

    const saved = await banner.save();

    const fileName = `${saved._id}.jpg`;
    const folderPath = 'banners2';
    const filePath = await this.fileStorageService.saveFile(fileName, folderPath, imageBuffer);

    saved.image = filePath;
    return saved.save();
  }

  async findAllCms(limit: number, skip: number) {
    return this.bannersModel.find().limit(limit).skip(skip * limit).sort({ createdAt: -1 }).lean();
  }

  async findAll() {
    return this.bannersModel.find({ active: true }).sort({ createdAt: -1 }).lean();
  }

  async update(id: string, dto: UpdateBannerDto) {
    return this.bannersModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async activate(id: string) {
    return this.bannersModel.findByIdAndUpdate(id, { active: true }, { new: true });
  }

  async inactivate(id: string) {
    return this.bannersModel.findByIdAndUpdate(id, { active: false }, { new: true });
  }

  async remove(id: string) {
    return this.bannersModel.findByIdAndDelete(id);
  }
}