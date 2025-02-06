import { Injectable } from '@nestjs/common';
import { CreateMicrositeDto } from './dto/create-microsite.dto';
import { UpdateMicrositeDto } from './dto/update-microsite.dto';
import { FileStorageService } from 'src/common/file-storage.service';

@Injectable()
export class MicrositesService {

  constructor(
    private fileStorageService: FileStorageService,
  ) {}

  async saveMicroSiteImage(files: any, gameId: string) {
    const savedFiles: any = {};

    // Función auxiliar para procesar un archivo individual
    const processSingleFile = async (
      file: any,
      prefix: string,
      folder: string
    ): Promise<string> => {
      const extension = file.mimetype.split('/')[1];
      const fileName = `${prefix}_${gameId}.${extension}`;
      // Se asume que el archivo tiene la propiedad 'buffer'
      return this.fileStorageService.saveFile(fileName, folder, file.buffer);
    };

    // Arreglo de promesas para ejecutar en paralelo (porque el tiempo es oro)
    const tasks: Promise<void>[] = [];

    // Procesa msBanner
    if (files?.msBanner) {
      tasks.push(
        processSingleFile(files.msBanner, 'msBanner', 'msBanner').then((path) => {
          savedFiles.msBanner = path;
        })
      );
    }

    // Procesa msBannerMod
    if (files?.msBannerMod) {
      tasks.push(
        processSingleFile(files.msBannerMod, 'msBannerMod', 'msBannerMod').then((path) => {
          savedFiles.msBannerMod = path;
        })
      );
    }

    // Procesa msIllustrative (si es un array)
    if (files?.['msIllustrative[]'] && Array.isArray(files['msIllustrative[]'])) {
      tasks.push(
        Promise.all(
          files['msIllustrative[]'].map((file: any, index: number) => {
            const extension = file.mimetype.split('/')[1];
            const fileName = `msIllustrative_${index}_${gameId}.${extension}`;
            return this.fileStorageService.saveFile(fileName, 'msIllustrative', file.buffer);
          })
        ).then((paths) => {
          savedFiles.msIllustrative = paths;
        })
      );
    }

    // Espera a que todas las tareas finalicen
    await Promise.all(tasks);

    return savedFiles;
  }
}
