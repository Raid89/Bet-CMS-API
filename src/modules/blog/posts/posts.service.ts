import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts } from './posts.schema';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { FileStorageService } from '../../../services/file-storage.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postsModel: Model<Posts>,
    private readonly fileStorageService: FileStorageService
  ) {}

  async create(createPostDto: CreatePostDto, userId: string, imageBuffer?: Buffer) {
    const newPost = new this.postsModel({
      ...createPostDto,
      author: userId,
      formattedTitle: this.normalizeTitle(createPostDto.title),
      date: new Date(),
    });

    const savedPost = await newPost.save();

    if (imageBuffer) {
      const fileName = `${savedPost._id}.jpg`;
      const folderPath = 'posts';
      const filePath = await this.fileStorageService.saveFile(fileName, folderPath, imageBuffer);
      savedPost.image = filePath;
      await savedPost.save();
    }

    return savedPost;
  }

  async findAll(limit: number, skip: number) {
    return this.postsModel.find()
      .limit(limit)
      .skip(skip * limit)
      .sort({ date: -1 })
      .populate('author')
      .populate('categoryId')
      .lean();
  }

  async findOne(id: string) {
    return this.postsModel.findById(id).populate('author').populate('categoryId').lean();
  }

  async findByFormattedTitle(title: string) {
    return this.postsModel.findOne({ formattedTitle: title }).lean();
  }

  async update(id: string, updateDto: UpdatePostDto) {
    return this.postsModel.findByIdAndUpdate(id, {
      ...updateDto,
      formattedTitle: this.normalizeTitle(updateDto.title || '')
    }, { new: true });
  }

  async remove(id: string) {
    return this.postsModel.findByIdAndDelete(id);
  }

  private normalizeTitle(str: string) {
    return str
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/ñ/g, 'n')
      .replace(/Ñ/g, 'N')
      .replace(/ /g, '-');
  }
}