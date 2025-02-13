import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagDocument } from './schemas/tags.schema';
import { NextLoggerService } from '../logger/logger.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
    constructor(
        @InjectModel(TagDocument.name) private TagsModel: Model<TagDocument>,
        private readonly logger: NextLoggerService
        
    ) {}

    findAllTags(): Promise<TagDocument[]> {
        this.logger.log('Buscando todos los tags', 'TagsService');
        try {
            return this.TagsModel.find().exec();
        } catch (error) {
            this.logger.error('Error al buscar los tags', 'findAllTags', JSON.stringify(error));
            throw error;
        }   
    }

    createTag(tagData: CreateTagDto): Promise<TagDocument> {
        this.logger.log('Creando un nuevo tag', 'TagsService', JSON.stringify(tagData));
        try {
            const newTag = this.TagsModel.create(tagData);
            return newTag;
        } catch (error) {
            this.logger.error('Error al crear el tag', 'createTag', JSON.stringify(error));
            throw error;
        }
    }

    updateTag(tagId: string, tagData: UpdateTagDto) {
        this.logger.log('Actualizando un tag', 'TagsService', JSON.stringify(tagData));
        try {
            const updatedTag = this.TagsModel.findByIdAndUpdate(tagId, tagData, { new: true }).exec();
            if (!updatedTag) throw new NotFoundException('Tag no encontrado');
            return updatedTag;
        } catch (error) {
            this.logger.error('Error al actualizar el tag', 'updateTag', JSON.stringify(error));
            throw error;
        }
    }

    deleteTag(tagId: string) {
        this.logger.log('Eliminando un tag', 'TagsService', tagId);
        try {
            const deletedTag = this.TagsModel.findByIdAndDelete(tagId).exec();
            if (!deletedTag) throw new NotFoundException('Tag no encontrado');
            return deletedTag;
        } catch (error) {
            this.logger.error('Error al eliminar el tag', 'deleteTag', JSON.stringify(error));
            throw error;
        }
    }
}