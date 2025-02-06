import { SlotsGamesService } from './../games/games.service';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CategoriesDocument } from './schemas/categories.schema';
import { Model, Types } from 'mongoose';
import { NextLoggerService } from 'src/modules/logger/logger.service';
import { isMongoId } from 'class-validator';
import { ResponseCategoriesDto } from './dto/response-categories.dto';
import { SlotsBannersService } from '../banners/banners.service';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(CategoriesDocument.name)
        private readonly categoriesModel: Model<CategoriesDocument>,

        private readonly slotsBannersService: SlotsBannersService,
        private readonly SlotsGamesService: SlotsGamesService,
        private readonly logger: NextLoggerService,
    ) {}

    async SlotsCategoriescreate(
        createCategoryDto: CreateCategoryDto,
    ): Promise<ResponseCategoriesDto> {
        this.logger.log(
            'Creating a new category',
            'SlotsCategoriescreate',
            JSON.stringify(createCategoryDto),
        );
        try {
            const newCategory =
                await this.categoriesModel.create(createCategoryDto);
            return { ok: true, data: newCategory };
        } catch (error) {
            this.logger.error(
                'Error creating a new category',
                'SlotsCategoriescreate',
                JSON.stringify(error),
            );
            return { ok: false, data: error };
        }
    }

    async SlotsCategoriesFind({
        limit,
        skip,
    }: {
        limit: number;
        skip: number;
    }): Promise<ResponseCategoriesDto> {
        this.logger.log('Buscando todas las categorias', 'SlotsCategoriesFind');
        try {
            const categories = await this.categoriesModel
                .find()
                .limit(limit)
                .skip(skip)
                .sort('sort');
            const totalCategories = await this.categoriesModel.countDocuments();

            return { ok: true, data: categories, total: totalCategories };
        } catch (error) {
            this.logger.error(
                'Error buscando todas las categorias',
                'SlotsCategoriesFind',
                JSON.stringify(error),
            );
            return { ok: false, data: error };
        }
    }

    async SlotsCategoriesupdate(
        id: string,
        updateCategoryDto: UpdateCategoryDto,
    ) {
        const idIsMongoId = isMongoId(id);
        if (!idIsMongoId) {
            this.logger.error('ID invalido', 'SlotsCategoriesupdate', id);
            throw new BadRequestException('Invalid ID');
        }

        try {
            const updatedCategory =
                await this.categoriesModel.findByIdAndUpdate(
                    id,
                    updateCategoryDto,
                    { new: true },
                );
            return { ok: true, data: updatedCategory };
        } catch (error) {
            this.logger.error(
                'Error updating category',
                'SlotsCategoriesupdate',
                JSON.stringify(error),
            );
            return { ok: false, data: error };
        }
    }

    async SlotsCategoriesremove(id: string): Promise<ResponseCategoriesDto> {
        this.logger.log(
            'Eliminando canal de integracion',
            'SlotsCategoriesremove',
            id,
        );
        const idIsMongoId = isMongoId(id);
        if (!idIsMongoId) {
            this.logger.error('ID invalido', 'SlotsCategoriesremove', id);
            throw new BadRequestException('Invalid ID');
        }

        try {
            const categoryDeleted = await this.categoriesModel.deleteOne({
                _id: id,
            });
            if (categoryDeleted.deletedCount === 0) {
                this.logger.error(
                    'Recurso no encontrado',
                    'SlotsCategoriesremove',
                    id,
                );
                throw new NotFoundException('Recurso no encontrado');
            }

            this.logger.log(
                'Recurso eliminado con exito',
                'SlotsCategoriesremove',
                id,
            );
            return { ok: true, data: categoryDeleted };
        } catch (error) {
            this.logger.error(
                'Ha ocurrido un error al eliminar el canal de integracion',
                'SlotsCategoriesremove',
                JSON.stringify(error),
            );
            return { ok: false, data: error };
        }
    }

    async findAllCategoryWithGames(bannersUrl: number, isSisplay: boolean): Promise<ResponseCategoriesDto> {
        this.logger.log(
            'Buscando todas las categorias con juegos',
            'findAllCategoryWithGames',
        );
        try {
            let categories = await this.categoriesModel.find().lean();
            const allSlots = await this.SlotsGamesService.SlotsGamesFindAll(isSisplay);

            // Distribuye los slots en las categorías correspondientes
            categories = this.orderGamesByCategory(categories, allSlots);

            const banner = await this.slotsBannersService.findBannersSlots(bannersUrl);
            return {
              ok:true,
              imagePath:process.env.IMAGE_HOST+'/slots/',
              banner,
              data: categories,
            }
        } catch (error) {
            this.logger.error(
                'Error buscando todas las categorias con juegos',
                'findAllCategoryWithGames',
                JSON.stringify(error),
            );
            return { ok: false, data: error };
        }
    }



    async SlotsByCategoryFindAll(categoryId: string): Promise<ResponseCategoriesDto> {
        this.logger.log('Buscando todos los juegos con filtro', 'SlotsGamesFindWithFilter');
        try {
            const stringGames = await this.SlotsGamesService.SlotsGamesFindWithFilter({ category: categoryId });
            const objectIdGames = await this.SlotsGamesService.SlotsGamesFindWithFilter({ category: new Types.ObjectId(categoryId) });

            const games = [...stringGames, ...objectIdGames].sort((a,b) => { return a.sort === b.sort ? a.title.localeCompare(b.title) : a.sort - b.sort;});

            for(let i = 0; i < games.length; i++) {
                games[i].category = games[i].category[0];
            }

            return { ok:true, data: games };
        } catch (error) {
            this.logger.error('Error buscando todos los juegos con filtro', 'SlotsGamesFindWithFilter', JSON.stringify(error));
            return { ok: false, data: error };
        }
    }

    async SlotsByCategoryFindPaginate(categoryId: string, start: number, limit: number): Promise<ResponseCategoriesDto> {
        this.logger.log('Buscando todos los juegos con filtro', 'SlotsGamesFindWithFilter');
        try {
            const stringGames = await this.SlotsGamesService.SlotsGamesFindWithFilter({ category: categoryId, isSisplay: true });
            const objectIdGames = await this.SlotsGamesService.SlotsGamesFindWithFilter({ category: new Types.ObjectId(categoryId), isSisplay: true });
            const stringGamesTotal = await this.SlotsGamesService.TotalGamesFindWithFilter({ category: categoryId, isSisplay: true });
            const objectIdGamesTotal = await this.SlotsGamesService.TotalGamesFindWithFilter({ category: new Types.ObjectId(categoryId), isSisplay: true });

            let games = [...stringGames, ...objectIdGames].sort((a,b) => { return a.sort === b.sort ? a.title.localeCompare(b.title) : a.sort - b.sort;});

            for(let i = 0; i < games.length; i++) {
                games[i].category = games[i].category[0];
            }

            games = games.slice(start, limit);

            return { 
                ok:true, 
                data: games, 
                imagePath:process.env.IMAGE_HOST+'/slots/', 
                total: stringGamesTotal + objectIdGamesTotal
            };

        } catch (error) {
            this.logger.error('Error buscando todos los juegos con filtro', 'SlotsGamesFindWithFilter', JSON.stringify(error));
            return { ok: false, data: error };
        }
    }

    //UTILITIES
    private orderGamesByCategory(categories: any, allSlots: any) {
        categories.forEach((category: any) => {
            const categorySlots = allSlots.filter((slot: any) => {
                if (Array.isArray(slot.category)) {
                    return slot.category
                        .map((c: any) => c.toString())
                        .includes(category._id.toString());
                } else {
                    if (
                        slot.category === null ||
                        slot.category === undefined
                    )
                        return false; //Valida si el dato viene vacío y no lo incluye dentro del filtro
                    return (
                        slot.category.toString() === category._id.toString()
                    );
                }
            });

            // Limita el número de slots por categoría a 8
            category.slots = categorySlots.slice(0, 8);

            // Agrega el campo "total" a la información de la categoría
            category.total = categorySlots.length;
        });

        categories.map((category: any) => {
            category.slots.map((slot: any) => {
                slot.category = Array.isArray(slot.category)
                    ? slot.category[0]
                    : slot.category;
            });
        });

        return categories;
    }
}
