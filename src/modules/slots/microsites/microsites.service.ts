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
    const savedFiles: any = {}
    let msIllustrativeCount = 0;

    // Función auxiliar para procesar un archivo individual
    const processSingleFile = async (
      file: any,
      prefix: string,
      folder: string
    ): Promise<string> => {
      const extension = file.mimetype.split('/')[1];
      if(prefix === 'msIllustrative') {
        prefix = `${prefix}_${msIllustrativeCount}`;
        msIllustrativeCount++
      }
      const fileName = `${prefix}_${gameId}.${extension}`;
      // Se asume que el archivo tiene la propiedad 'buffer'
      return this.fileStorageService.saveFile(fileName, folder, file.buffer);
    };

    // Arreglo de promesas para ejecutar en paralelo (porque el tiempo es oro)
    const tasks: Promise<void>[] = [];
    files.forEach((file: any) => {
      if (file?.fieldname === 'msBanner') {
        tasks.push(
          processSingleFile(file, 'msBanner', 'slots').then((path) => {
            savedFiles.msBanner = path;
          })
        );
      }
  
      // Procesa msBannerMod
      if (file?.fieldname === 'msBannerMod') {
        tasks.push(
          processSingleFile(file, 'msBannerMod', 'slots').then((path) => {
            savedFiles.msBannerMod = path;
          })
        );
      }
  
      // Procesa msIllustrative (si es un array)
      if (file?.fieldname === 'msIllustrative[]') {
        if (savedFiles.msIllustrative === undefined) savedFiles.msIllustrative = [];
        tasks.push(
          processSingleFile(file, `msIllustrative`, 'slots').then((path) => {
            savedFiles.msIllustrative.push(path);
          })
        );
      }
    });
    // Procesa msBanner


    // Espera a que todas las tareas finalicen
    await Promise.all(tasks);
    console.log(savedFiles);
    return savedFiles;
  }
}
