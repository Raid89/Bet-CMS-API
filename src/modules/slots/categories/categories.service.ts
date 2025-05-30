import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { FileStorageService } from 'src/common/file-storage.service';
import { NextLoggerService } from 'src/modules/logger/logger.service';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument, CategorySchema } from '../schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {

  private readonly FOLDER_PATH = 'slots/categories';

  constructor(
    @InjectModel(Category.name) 
    private readonly categoryModel: Model<CategoryDocument>,
    private readonly fileStorageService: FileStorageService,
    private readonly logger: NextLoggerService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, image: any): Promise<CategoryDocument> {
    try {
      // Create category document first
      const newCategory = new this.categoryModel({
        title: createCategoryDto.title,
        sort: createCategoryDto.sort || 100,
        date: new Date()
      });

      // Save to get the document ID
      const savedCategory = await newCategory.save();
      
      // Save image with the document ID as filename
      const fileExtension = image.mimetype.replace('image/', '');
      const fileName = `${savedCategory._id}.${fileExtension}`;
      
      try {
        const filePath = await this.fileStorageService.saveFile(fileName, this.FOLDER_PATH, image.buffer);
        this.logger.log(`Image saved for category ${savedCategory._id}: ${filePath}`);
        return savedCategory;
      } catch (fileError: any) {
        this.logger.error(`Failed to save image for category ${savedCategory._id}:`, fileError);
        
        // Rollback: delete the created document since image save failed
        await this.categoryModel.findByIdAndDelete(savedCategory._id);
        this.logger.log(`Rolled back category creation for ID ${savedCategory._id} due to image save failure`);
        
        throw new BadRequestException('Failed to save category image. Category creation has been rolled back.');
      }

    } catch (error: any) {
      // If it's already a BadRequestException, re-throw it
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error('Error creating category:', error);
      
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation error: ${error.message}`);
      }
      
      throw new BadRequestException('Failed to create category');
    }
  }

  async findPaginated(limit: number, skip: number): Promise<CategoryDocument[]> {
    try {
      const categories = await this.categoryModel.find()
        .sort({ sort: 1, date: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      return categories;
    } catch (error: any) {
      this.logger.error('Error fetching paginated categories:', error);
      throw new BadRequestException('Failed to fetch categories');
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDocument> {
    try {
      const existingCategory = await this.categoryModel.findById(id);
      if (!existingCategory) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      // Update the category fields
      existingCategory.title = updateCategoryDto.title || existingCategory.title;
      existingCategory.sort = updateCategoryDto.sort ?? existingCategory.sort;

      return await existingCategory.save();
    } catch (error: any) {
      this.logger.error('Error updating category:', error);
      throw new BadRequestException('Failed to update category');
    }
  }

  async delete (id: string): Promise<void> {
    try {
      const category = await this.categoryModel.findById(id);
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      // Delete the category document
      await this.categoryModel.findByIdAndDelete(id);
      this.logger.log(`Category with ID ${id} deleted successfully`);

      // Optionally, delete the associated image file
      const fileName = `${id}.jpg`; // Assuming the image is saved as .jpg
      await this.fileStorageService.deleteFile(fileName, this.FOLDER_PATH);
      this.logger.log(`Image file for category ${id} deleted successfully`);

    } catch (error: any) {
      this.logger.error('Error deleting category:', error);
      throw new BadRequestException('Failed to delete category');
    }
  }

  async findAll(): Promise<CategoryDocument[]> {
    try {
      return await this.categoryModel.find().sort({ sort: 1, date: -1 }).exec();
    } catch (error: any) {
      this.logger.error('Error fetching all categories:', error);
      throw new BadRequestException('Failed to fetch categories');
    }
  }
}
