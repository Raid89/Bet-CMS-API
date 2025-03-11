import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Promotions } from './promotions.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NextLoggerService } from '../../logger/logger.service';
import { CreatePromoDto, UpdatePromoDto } from './dto/promotions.dto';
import { FileStorageService } from '../../../services/file-storage.service';
import { PromotionCategories } from '../promo-categories/promo-categories.schema';
var moment = require("moment");

@Injectable()
export class PromoService {

    public folderPath = 'promos';

    constructor(
        @InjectModel(Promotions.name) private promosModel: Model<Promotions>,
        @InjectModel(PromotionCategories.name) private promosCategoriesModel: Model<PromotionCategories>,
        private logger: NextLoggerService,
        private fileStorageService: FileStorageService,
    ) {}

    private async findPromoByName(PromoName: string){
        return this.promosModel.findOne({title: PromoName}).exec();
    }

    // Promociones

    public async getPromosCMS(start: number, limit: number) {
        try {
            const [count, data] = await Promise.all([
                this.promosModel.countDocuments(),
                this.promosModel
                    .find()
                    .sort({ date: 'desc' })
                    .skip(start * limit)
                    .limit(limit)
                    .select('-short_desc -html -categoryId -titulo -alt -__v')
            ]);
            return {count, data}
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las promociones', 'getPromosCMS', JSON.stringify(error));
            throw error;
        }
    }

    public async getSinglePromoById(promoId: string) {
        try {
            return await this.promosModel.findById(promoId)
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las promociones', 'getSinglePromoById', JSON.stringify(error));
            throw error;
        }
    }

    public async getSinglePromoByName(promoName: string) {
        try {
            return await this.promosModel.findOne({title: promoName})
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las promociones', 'getSinglePromoByName', JSON.stringify(error));
            throw error;
        }
    }

    public async getFilterPromosCMS(start: number, limit: number, criteria: string) {
        try {
            let filter = [{ title: { $regex: new RegExp(criteria, "i") }}]
            const [count, data] = await Promise.all([
                this.promosModel.countDocuments(),
                this.promosModel
                    .find({ $and: filter})
                    .sort({ date: 'desc' })
                    .skip(start * limit)
                    .limit(limit)
                    .select('-short_desc -html -categoryId -titulo -alt -__v')
            ]);
            return {count, data}
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las promociones', 'getFilterPromosCMS', JSON.stringify(error));
            throw error;
        }
    }

    public async createPromo(promoData: CreatePromoDto) {
        try {
            const validatePromoExist = await this.findPromoByName(promoData.title)
            if (validatePromoExist){
                throw new BadRequestException('Ya se encuentra una promoción creada con este titulo')
            }

            promoData.date = new Date(Date.now() - 5 * 60 * 60 * 1000);
            promoData.dateActivation = new Date(promoData.dateActivation.getTime() - (5 * 60 * 60 * 1000));
            promoData.dateDeactivated = new Date(promoData.dateDeactivated.getTime() - (5 * 60 * 60 * 1000));

            const newPromo = new this.promosModel(promoData);
            return await newPromo.save();
        } catch (error) {
            this.logger.error('Ha ocurrido un error al agregar la promoción', 'createPromo', JSON.stringify(error));
            throw error;
        }
    }

    public async setPromoImage(promoId: string, file: any){
        try {
            if (!file) {
                throw new NotFoundException('No hay imagenes');
            }
            const extension = file.originalname.split('.')[1]
            const fileName = `${promoId}.${extension}`;
            const filePath = await this.fileStorageService.saveFile(fileName, this.folderPath, file.buffer);

            return await this.promosModel.findByIdAndUpdate(promoId, {feature: filePath}, {new: true});
        } catch (error) {
            this.logger.error('Ha ocurrido un error al insertar la imagen de la promoción', 'setPromoImage', JSON.stringify(error));
            throw error;
        }
    }

    public async updatePromo(promoId: string, promoData: UpdatePromoDto) {
        try {
            promoData.date = new Date(Date.now() - 5 * 60 * 60 * 1000);
            promoData.dateActivation = new Date(promoData.dateActivation.getTime() - (5 * 60 * 60 * 1000));
            promoData.dateDeactivated = new Date(promoData.dateDeactivated.getTime() - (5 * 60 * 60 * 1000));

            return await this.promosModel.findByIdAndUpdate(promoId, promoData, {new: true});
        } catch (error) {
            this.logger.error('Ha ocurrido un error al modificar la promoción', 'updatePromo', JSON.stringify(error));
            throw error;
        }
    }

    public async deletePromo(promoId: string) {
        try {
            const imageToDelete = await this.promosModel.findById(promoId);
            if (!imageToDelete) {
                throw new NotFoundException('Recurso no encontrado');
            } else {
                this.fileStorageService.deleteFile(this.folderPath, imageToDelete.feature);
                return await this.promosModel.findByIdAndDelete(promoId);
            }
        } catch (error) {
            this.logger.error('Ha ocurrido un error al eliminar la promoción', 'deletePromo', JSON.stringify(error));
            throw error;
        }
    }


    // Funciones de utilidad
    public async deleteFinalizedPromos() {
        try {
            const date = new Date();
            const filter = {
                $and: [
                    { dateDeactivated: { $exists: true } },
                    { $expr: { $lt: [{ $add: [{ $toDate: "$dateDeactivated" }, 30 * 24 * 60 * 60 * 1000] }, date] } }
                ]
            };
            // Validar si existen registros que cumplen la condición
            const count = await this.promosModel.countDocuments(filter);

            if (count > 0) {
                await this.promosModel.deleteMany(filter);
            }
        } catch (error) {
            console.error("Error in promotions validation: ", error);
        }
    }

    public async updateFinalizedPromos() {
        try {
            const date = new Date();
            const count = await this.promosModel.countDocuments({
                dateDeactivated: { $exists: true, $lt: date },
            });

            if (count > 0) {
                const getFinalizedCategory = await this.promosCategoriesModel.findOneAndUpdate(
                    { category: { $regex: new RegExp("^" + "FINALIZADA" + "$", "i") } },
                    { category: "FINALIZADA", sort: 12 },
                    { upsert: true, new: true }
                );

                await this.promosModel.updateMany({ dateDeactivated: { $exists: true, $lt: date } }, { categoryId: getFinalizedCategory._id });
            }
        } catch (error) {
            console.error(error);
        }
    }
}
