import { MicrositesService } from './../microsites/microsites.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NextLoggerService } from 'src/modules/logger/logger.service';
import { SlotsDocument } from './schemas/games.schema';

@Injectable()
export class SlotsGamesService {
    constructor(
        @InjectModel(SlotsDocument.name)
        private readonly slotsModel: Model<SlotsDocument>,
        private readonly logger: NextLoggerService,
        private readonly MicrositesService: MicrositesService,
    ) {}

    // Definiciones de metodos de busqueda

    async SlotsGamesFindOne(gameId: string): Promise<SlotsDocument> {
        this.logger.log('Buscando un juego', 'SlotsGamesFindOne');
        try {
            const game = await this.slotsModel.findById(gameId);
            if (!game) throw new NotFoundException('Juego no encontrado');
            game.roules = process.env.IMAGESHOST + "/pdf/" + game.roules;
            return game;
        } catch(error) {
            this.logger.error(
                'Error buscando un juego',
                'SlotsGamesFindOne',
                JSON.stringify(error),
            );
            throw error;
        }
    }

    async SlotsGamesFindAll(isSisplay: boolean): Promise<SlotsDocument[]> {
        this.logger.log('Buscando todos los juegos', 'SlotsGamesFindAll');
        try {
            return await this.slotsModel
                .find(
                    { isSisplay },
                    {
                        msIllustrative: 0,
                        msBanner: 0,
                        msBannerMod: 0,
                        gDescTitle: 0,
                        gDescSubtitle: 0,
                        gDescText: 0,
                        wGameTitle: 0,
                        wGameDesc: 0,
                    },
                )
                .sort({ sort: 1, title: 1 })
                .lean();
        } catch (error) {
            this.logger.error(
                'Error buscando todos los juegos',
                'SlotsGamesFindAll',
                JSON.stringify(error),
            );
            throw error;
        }
    }

    async SlotsGamesFindAllCms(
        limit: number,
        skip: number,
        criteria?: string,
        integrationChannelCode?: string,
        categoryId?: string,
    ) {
        this.logger.log(
            'Buscando todos los juegos para el cms',
            'SlotsGamesFindAllCms',
        );
        try {
            const filter: any[] = [
                { title: { $regex: new RegExp(criteria || '', 'i') } },
            ];

            if (integrationChannelCode) {
                filter.push({ integrationChannelCode });
            }

            if (categoryId) {
                filter.push({ category: new Types.ObjectId(categoryId) });
            }

            const count = await this.slotsModel.countDocuments({
                $and: filter,
            });

            const response = await this.slotsModel.aggregate([
                { $match: { $and: filter } },
                { $sort: { sort: 1, date: -1 } },
                { $skip: skip * limit },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        feature: 1,
                        sort: 1,
                        gameCode: 1,
                        gameId: 1,
                        category: 1,
                        buttonText: 1,
                        additionalParam: 1,
                        flashClient: 1,
                        state: 1,
                        integrationChannelCode: 1,
                        urlDemo: 1,
                        typeDemoGameUrl: 1,
                        alt: 1,
                        titulo: 1,
                        roules: {
                            $concat: [
                                process.env.IMAGE_HOST + '/pdf/',
                                '$roules',
                            ],
                        },
                        date: 1,
                    },
                },
            ]);

            if (categoryId === '' || categoryId === undefined) {
                return { count: count, data: response };
            } else {
                const response2 = await this.SlotsGamesFindAllArrayCms(
                    limit,
                    skip,
                    criteria,
                    integrationChannelCode,
                    categoryId,
                );
                return {
                    count: count,
                    data: [...response, ...response2.data].sort((a, b) => {
                        if (a.sort !== b.sort) {
                            return a.sort - b.sort;
                        }
                        return (
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        );
                    }),
                };
            }
        } catch(error) {
          this.logger.error( 
            'Error buscando todos los juegos para el cms',
            'SlotsGamesFindAllCms',
            JSON.stringify(error),
          );
          throw error;
        }
    }

    async SlotsGamesFindAllArrayCms(
        limit: number,
        skip: number,
        criteria?: string,
        integrationChannelCode?: string,
        categoryId?: string,
    ) {
        try {
            // Array de condiciones para armar el $and
            const filters: any[] = [];

            // Si hay criterio de búsqueda, se añade la condición de title con regex
            if (criteria) {
                filters.push({ title: { $regex: new RegExp(criteria, 'i') } });
            }

            // Si hay canal de integración
            if (integrationChannelCode) {
                filters.push({ integrationChannelCode });
            }

            // Si hay categoría
            if (categoryId) {
                filters.push({ category: new Types.ObjectId(categoryId) });
            }

            // Si no hay ningún filtro, no queremos que sea un $and vacío
            const matchStage = filters.length
                ? { $match: { $and: filters } }
                : { $match: {} };

            // Primero obtenemos el total de documentos que cumplen las condiciones
            const count = await this.slotsModel.countDocuments(
                matchStage.$match.$and || {},
            );

            // Armamos el pipeline de agregación
            const response = await this.slotsModel.aggregate([
                matchStage,
                { $sort: { sort: 1, date: -1 } },
                { $skip: skip * limit },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        feature: 1,
                        sort: 1,
                        gameCode: 1,
                        gameId: 1,
                        category: 1,
                        buttonText: 1,
                        additionalParam: 1,
                        flashClient: 1,
                        state: 1,
                        integrationChannelCode: 1,
                        urlDemo: 1,
                        typeDemoGameUrl: 1,
                        alt: 1,
                        titulo: 1,
                        // Aquí usamos ConfigService para recuperar la URL base. Si prefieres process.env, adelante.
                        roules: {
                            $concat: [
                                process.env.IMAGE_HOST + '/pdf/',
                                '$roules',
                            ],
                        },
                        date: 1,
                    },
                },
            ]);

            return { data: response };
        } catch (error) {
            // Lanza una excepción genérica de Nest con el error original
            throw new InternalServerErrorException(error);
        }
    }

    async SlotsGamesFindWithFilter(
        filter: any,
        start = 0,
        limit = 9999,
    ): Promise<SlotsDocument[]> {
        this.logger.log(
            'Buscando todos los juegos con filtro',
            'SlotsGamesFindWithFilter',
        );
        try {
            return await this.slotsModel
                .find(filter, {
                    msIllustrative: 0,
                    msBanner: 0,
                    msBannerMod: 0,
                    gDescTitle: 0,
                    gDescSubtitle: 0,
                    gDescText: 0,
                    wGameTitle: 0,
                    wGameDesc: 0,
                })
                .sort({ sort: 1, title: 1 })
                .skip(start)
                .limit(limit)
                .lean();
        } catch (error) {
            this.logger.error(
                'Error buscando todos los juegos con filtro',
                'SlotsGamesFindWithFilter',
                JSON.stringify(error),
            );
            throw error;
        }
    }

    async TotalGamesFindWithFilter(filter: any): Promise<number> {
        this.logger.log(
            'Buscando todos los juegos con filtro',
            'TotalGamesFindWithFilter',
        );
        try {
            return await this.slotsModel.countDocuments(filter);
        } catch (error) {
            this.logger.error(
                'Error buscando todos los juegos con filtro',
                'TotalGamesFindWithFilter',
                JSON.stringify(error),
            );
            throw error;
        }
    }

    // Definicion de metodos de actualizacion y creacion

    async SlotsGamesUpdate(gameId: string, gameData: any, gameFiles: any) {
        this.logger.log('Actualizando un juego', 'SlotsGamesUpdate', JSON.stringify(gameData));
        try {
            if(gameData.microSite === 'true') {
                const savedFiles = await this.MicrositesService.saveMicroSiteImage(gameFiles, gameId);
                gameData = { ...gameData, ...savedFiles };
                console.log(savedFiles)
            } else {
                delete gameData.gDescTitle;
                delete gameData.gDescSubtitle;
                delete gameData.gDescText;
                delete gameData.wGameTitle;
                delete gameData.wGameDesc;
            }

            if (gameData.category) {
                gameData.category = gameData.category.split(",");
            }
        
            if(gameData.tags) {
                gameData.tags = gameData.tags.split(',');
            }
        
            if (gameData.feature && gameData.feature === "") {
                delete gameData.feature;
            }

            const gameUpdated = await this.slotsModel.findByIdAndUpdate(gameId, gameData, { new: true });
            
            return {
                code: "100",
                message: "Slot actualizado con exito!",
                data: gameUpdated,
            }
        } catch (error) {
            this.logger.error(
                'Error actualizando un juego',
                'SlotsGamesUpdate',
                JSON.stringify(error),
            );
            throw error;
        }
    }
}
