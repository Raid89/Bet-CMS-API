import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Paths } from './paths.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NextLoggerService } from '../../logger/logger.service';
import { CreatePathDto, UpdatePathDto } from './dto/paths.dto';

@Injectable()
export class PathsService {

    constructor(
        @InjectModel(Paths.name) private pathsModel: Model<Paths>,
        private logger: NextLoggerService,
    ) {}

    public async getAllPaths() {
        try {
            return this.pathsModel.find().select('-__v');
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las rutas', 'getAllPaths', JSON.stringify(error));
            throw error;
        }
    }

    public async getPathById(id: string) {
        try {
            return this.pathsModel.findOne({_id: id}).select('-__v');
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las rutas', 'getPathById', JSON.stringify(error));
            throw error;
        }
    }

    public async getActivePaths() {
        try {
            return this.pathsModel.find({ status: true }).select('-__v');
        } catch (error) {
            this.logger.error('Ha ocurrido un error al obtener las rutas', 'getActivePaths', JSON.stringify(error));
            throw error;
        }
    }

    public async createPath(pathData: CreatePathDto) {
        try {
            await this.pathsModel.create(pathData);
            return { message: "Se creo correctamente", status: 201 };
        } catch (error) {
            this.logger.error('Ha ocurrido un error al crear la ruta', 'createPath', JSON.stringify(error));
            throw error;
        }
    }

    public async updatePath(id: string, pathData: UpdatePathDto) {
        try {
            await this.pathsModel.updateOne({ _id: id }, { $set: pathData });
            return { message: "Se edito correctamente", status: 201 };
        } catch (error) {
            this.logger.error('Ha ocurrido un error al editar la ruta', 'updatePath', JSON.stringify(error));
            throw error;
        }
    }

    public async deletePath(id: string) {
        try {
            await this.pathsModel.deleteOne({ _id: id });
            return { message: "Se elimino correctamente", status: 201 };
        } catch (error) {
            this.logger.error('Ha ocurrido un error al eliminar la ruta', 'deletePath', JSON.stringify(error));
            throw error;
        }
    }
}