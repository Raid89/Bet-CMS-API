import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Videos } from './videos.schema';
import { CreateVideoDto, UpdateVideoDto } from './dto/videos.dto';
import { FileStorageService } from '../../../common/file-storage.service';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Videos.name) private videosModel: Model<Videos>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async create(dto: CreateVideoDto, userId: string, fileBuffer?: Buffer, previewBuffer?: Buffer) {
    const newVideo = new this.videosModel({
      ...dto,
      author: userId,
      date: new Date(),
    });

    const savedVideo = await newVideo.save();

    if (fileBuffer) {
      const filePath = await this.fileStorageService.saveFile(`${savedVideo._id}.mp4`, 'videos', fileBuffer);
      savedVideo.file = filePath;
    }

    if (previewBuffer) {
      const previewPath = await this.fileStorageService.saveFile(`${savedVideo._id}-preview.jpg`, 'videos/previews', previewBuffer);
      savedVideo.preview = previewPath;
    }

    return savedVideo.save();
  }

  async findAll(limit: number, skip: number) {
    return this.videosModel.find().limit(limit).skip(skip * limit).sort({ date: -1 }).lean();
  }

  async findActive(limit: number, skip: number) {
    return this.videosModel.find({ active: true }).limit(limit).skip(skip * limit).sort({ date: -1 }).lean();
  }

  async findOne(id: string) {
    return this.videosModel.findById(id).lean();
  }

  async update(id: string, dto: UpdateVideoDto) {
    return this.videosModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return this.videosModel.findByIdAndDelete(id);
  }
}