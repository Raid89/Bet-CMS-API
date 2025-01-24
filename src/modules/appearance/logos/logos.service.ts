import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NextLoggerService } from '../../logger/logger.service';
import { FileStorageService } from '../../../services/file-storage.service';
import { Logos, Slides } from './logos.schema';
import path from 'path';
import * as fs from 'fs';
@Injectable()
export class LogosService { 
    constructor(
        @InjectModel(Logos.name) private logosModel: Model<Logos>,
        @InjectModel(Slides.name) private slidesModel: Model<Slides>,
        private logger: NextLoggerService,
        private fileStorageService: FileStorageService,
    ) {}

    public async newLogo(data: any, file: any) {
        if (!file) {
            throw new NotFoundException('No hay imagenes');
        }
        try {
            const newLogoDoc = new this.logosModel({ date: new Date() });
            const savedLogo = await newLogoDoc.save();

            const fileName = `${savedLogo._id}.png`;
            const folderPath = 'logos';

            const filePath = await this.fileStorageService.saveFile(fileName, folderPath, file.buffer);

            await this.logosModel.findByIdAndUpdate(
                savedLogo._id,
                {
                    path: filePath,
                    alt: data.alt,
                    titulo: data.titulo
                },
                { new: true }
            );

            return { code: "100", message: "Imagen creada con Éxito!" };
        } catch (error) {
            this.logger.error('Error al crear la imagen del logo', 'newLogo', JSON.stringify(error));
            throw error;
        }
    }

    public async getLogos(limit: number, skip: number) {
        try {
            const total = await this.logosModel.countDocuments();
            const data = await this.logosModel
                .find()
                .sort({ date: -1 })
                .limit(limit)
                .skip(skip * limit)
                .exec();

            return { count: total, data };
        } catch (error) {
            this.logger.error('Error al obtener los logos', 'getLogos', JSON.stringify(error));
            throw error;
        }
    }

    public async getCurrentLogo(type: string) {
        try {
            return await this.logosModel.find({ type, isCurrent: true }).exec();
        } catch (error) {
            this.logger.error('Error al obtener el logo actual', 'getCurrentLogo', JSON.stringify(error));
            throw error;
        }
    }

    public async setFeatureLogo(id: string, type: number) {
        try {
            await this.logosModel.updateMany({ type }, { $set: { isCurrent: false } });
            const result = await this.logosModel.findByIdAndUpdate(
                id,
                { $set: { isCurrent: true } },
                { new: true }
            );
            return { code: "100", message: "Logo actualizado con exito!", data: result };
        } catch (error) {
            this.logger.error('Error al actualizar el logo destacado', 'setFeatureLogo', JSON.stringify(error));
            throw error;
        }
    }

    public async updateLogo(id: string, data: any) {
        try {
            const updatedLogo = await this.logosModel.findByIdAndUpdate(
                id,
                { type: data.type, alt: data.alt, titulo: data.titulo },
                { new: true }
            );
            return { code: "100", message: "logo actualizado con exito!", data: updatedLogo };
        } catch (error) {
            this.logger.error('Error al actualizar el logo', 'updateLogo', JSON.stringify(error));
            throw error;
        }
    }

    public async removeLogo(id: string) {
        try {
            const logo = await this.logosModel.findById(id);
            if (!logo) {
                return { code: "404", message: "Recurso no encontrado" };
            }
            
            const fileName = logo.path?.split('/').pop();
            const fullPath = path.join('logos', fileName || `${id}.png`);
            try {
                await fs.promises.unlink(fullPath);
            } catch (err) {
                this.logger.error('Error al borrar el archivo', 'removeLogo', JSON.stringify(err));
            }
            await this.logosModel.deleteOne({ _id: id });
            return { code: "100", message: "Recurso eliminado" };
        } catch (error) {
            this.logger.error('Error al eliminar el logo', 'removeLogo', JSON.stringify(error));
            throw error;
        }
    }

    public async getCarousel(type: string, start: number, limit: number) {
        return await this.slidesModel
            .find({ type })
            .limit(limit)
            .skip(start * limit);
    }

    public async getActiveCarousel(type: string) {
        return await this.slidesModel.find({ type, state: 'active' });
    }

    public async getTotalCarousel(type: string) {
        return await this.slidesModel.countDocuments({ state: 'active', type });
    }

    public async updateCarouselImage(id: string, state: string) {
        return await this.slidesModel.findByIdAndUpdate(id, { state });
    }

    public async deleteCarouselImage(id: string) {
        const image = await this.slidesModel.findById(id);
        if (!image) {
            return;
        }
        const pathr = path.join(__dirname, '../../../../uploads/');

        fs.unlink(pathr + image.path, () => {});
        fs.unlink(pathr + 'compressed_' + image.path, () => {});
        fs.unlink(pathr + '1382_compressed_' + image.path, () => {});
        fs.unlink(pathr + '992_compressed_' + image.path, () => {});
        fs.unlink(pathr + '768_compressed_' + image.path, () => {});
        fs.unlink(pathr + '480_compressed_' + image.path, () => {});

        return await this.slidesModel.deleteOne({ _id: id });
    }

    public async setCarouselImage(files: any, type: string, data: any) {
        if (!files || !files.image) {
            throw new Error('No se encontró el archivo enviado');
        }
        const image = files.image;
        const fileName = 'carousel' + new Date().getTime() + '.jpg';
        
        const slide = new this.slidesModel({
            path: fileName,
            type,
            date: new Date().toISOString(),
            titulo: data.titulo,
            alt: data.alt
        });
        await slide.save();
        return fileName;
    }

    public async updateCarouselImageTitleAlt(data: any) {
        const id = data.params.id;
        const body = data.body;
        const changes = { titulo: body.titulo, alt: body.alt };
        const result = await this.slidesModel.findByIdAndUpdate(id, changes, { new: false });
        if (!result) {
            return;
        }
        return { code: "100", message: "Propiedades actualizadas con exito!", data: result };
    }
}
