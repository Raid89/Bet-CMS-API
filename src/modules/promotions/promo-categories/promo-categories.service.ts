import { HttpStatus, Injectable } from '@nestjs/common';
import { PromotionCategories } from './promo-categories.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NextLoggerService } from '../../../modules/logger/logger.service';
import { CreatePromoCategoryDto, UpdatePromoCategoryDto } from './dto/promo-categories.dto';
import { PromoService } from '../promotions/promotions.service';

@Injectable()
export class PromoCategoriesService {

    constructor(
        @InjectModel(PromotionCategories.name) private promoCategoriesModel: Model<PromotionCategories>,
        private logger: NextLoggerService,
        private promoService: PromoService,
    ) {}

    public async getCategoriesAndPromos() {
        try {
            await this.promoService.deleteFinalizedPromos();
            await this.promoService.updateFinalizedPromos();

            const categories = await this.promoCategoriesModel.aggregate([
                {
                    $lookup: {
                        from: "promos",
                        foreignField: "categoryId",
                        localField: "_id",
                        as: "promotions",
                    },
                },
                { $unwind: "$promotions" },
                {
                    $group: {
                        _id: "$_id",
                        category: { $first: "$category" },
                        sort: { $first: "$sort" },
                        promotions: { $push: "$promotions" },
                    },
                },
                { $project: { category: 1, sort: 1, promotions: 1 } },
                { $sort: { sort: 1 } },
            ]);

            return categories.map((category) => {
                category.promotions.sort(
                    (a: any, b: any) => new Date(b.dateActivation).getTime() - new Date(a.dateActivation).getTime()
                );
                return category;
            });
        } catch (error: any) {
            this.logger.error('Ha ocurrido un error al obtener las categorias y promociones', 'getCategoriesAndPromos', JSON.stringify(error));
            throw error;
        }
    }

    public async getPromoCategories(start: number, limit: number) {
        try {
            const [total, categories] = await Promise.all([
                this.promoCategoriesModel.countDocuments(),
                this.promoCategoriesModel
                    .find()
                    .sort({ sort: 'asc' })
                    .skip(start * limit)
                    .limit(limit)
            ]);
            return {statusCode: HttpStatus.OK, ok: true, data: { categories, total }};
        } catch (error: any) {
            this.logger.error('Ha ocurrido un error al obtener las categorias de promoción', 'getPromoCategories', JSON.stringify(error));
            throw error;
        }
    }

    public async createPromoCategory(PromoCategoryData: CreatePromoCategoryDto) {
        try {
            return await this.promoCategoriesModel.create(PromoCategoryData)
        } catch (error: any) {
            this.logger.error('Ha ocurrido un error al agregar la categoria', 'createPromoCategory', JSON.stringify(error));
            throw error;
        }
    }

    public async updatePromoCategory(categoryId: string, PromoCategoryData: UpdatePromoCategoryDto) {
        try {
            return await this.promoCategoriesModel.findByIdAndUpdate(categoryId, PromoCategoryData, {new: true})
        } catch (error: any) {
            this.logger.error('Ha ocurrido un error al editar la categoria', 'updatePromoCategory', JSON.stringify(error));
            throw error;
        }
    }

    public async deletePromoCategory(categoryId: string) {
        try {
            return await this.promoCategoriesModel.findByIdAndDelete(categoryId)
        } catch (error: any) {
            this.logger.error('Ha ocurrido un error al eliminar la categoria', 'deletePromoCategory', JSON.stringify(error));
            throw error;
        }
    }
}
