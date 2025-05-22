import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LayoutsDocument } from './schemas/layouts.schema';
import { NextLoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class LayoutService {
    constructor(
        @InjectModel(LayoutsDocument.name) private LayoutModel: Model<LayoutsDocument>,
        private readonly logger: NextLoggerService
    ) {}

    async getAllLayouts(limit: number, skip: number) {
        this.logger.log('Obtener todos los layouts', 'LayoutService');
        try {
            const count = await this.LayoutModel.countDocuments();
            const data = await this.LayoutModel.aggregate([
                { $skip: skip*limit },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'images',
                        localField: 'images',
                        foreignField: '_id',
                        as: 'images'
                    }
                }
            ])
            return { count, data };
        } catch (error) {
            this.logger.error('Error al obtener todos los layouts', 'LayoutService', JSON.stringify(error));
            return error;
        }
    }


}