import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blogs } from './blogs.schema';
import { BlogsDto } from './dto/blogs.dto';
import { FileStorageService } from '../../../common/file-storage.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blogs.name) private blogsModel: Model<Blogs>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async create(dto: BlogsDto, userId: string) {
    const blog = new this.blogsModel({ ...dto, author: userId, date: new Date() });
    return blog.save();
  }

  async findAll(limit: number, skip: number) {
    return this.blogsModel.find().limit(limit).skip(skip * limit).sort({ date: -1 }).populate('author').lean();
  }

  async findOne(id: string) {
    return this.blogsModel.findById(id).populate('author').lean();
  }

  async update(id: string, dto: Partial<BlogsDto>) {
    return this.blogsModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async setFeatureImage(id: string, fileBuffer: Buffer) {
    const filePath = await this.fileStorageService.saveFile(`${id}.jpg`, 'blogs', fileBuffer);
    return this.blogsModel.findByIdAndUpdate(id, { image: filePath }, { new: true });
  }

  async remove(id: string) {
    return this.blogsModel.findByIdAndDelete(id);
  }
}