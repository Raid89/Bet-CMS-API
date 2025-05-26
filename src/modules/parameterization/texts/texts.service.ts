import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Texts } from './texts.schema';
import { CreateTextDto, UpdateTextDto } from './dto/texts.dto';
import { NextLoggerService } from '../../logger/logger.service';

@Injectable()
export class TextsService {
  constructor(
    @InjectModel(Texts.name) private textsModel: Model<Texts>,
    private logger: NextLoggerService
  ) {}

  async getJSON() {
    try {
      const result = await this.textsModel.find().sort('date').limit(1).exec();
      return result.length > 0 ? result[0] : null;
    } catch (err) {
      this.logger.error('Error al obtener JSON', 'getJSON', JSON.stringify(err));
      throw err;
    }
  }

  async initJSON() {
    try {
      const jsonEx = {
        playerValidationError: {
          Undefined: 'No definido.',
          EmptyFirstName: 'El nombre no puede ser vacío.',
          // ... sigue igual al ejemplo original
          PlayerUnderAge: 'Debes ser mayor de edad.',
        },
      };

      const jsonString = JSON.stringify(jsonEx);
      const doc = new this.textsModel({ json: jsonString, date: new Date().getTime() });
      await doc.save();
      return { code: '100', message: 'Texts creado con éxito!' };
    } catch (err) {
      this.logger.error('Error al inicializar JSON', 'initJSON', JSON.stringify(err));
      throw err;
    }
  }

  async updateJSON(id: string, dto: UpdateTextDto) {
    try {
      await this.textsModel.findByIdAndUpdate(
        id,
        { json: dto.json, date: new Date().getTime() },
        { new: true }
      );
      return { code: '100', message: 'Texts actualizado con éxito!' };
    } catch (err) {
      this.logger.error('Error al actualizar JSON', 'updateJSON', JSON.stringify(err));
      throw err;
    }
  }
}