import { Injectable } from '@nestjs/common';
import { CreateMicrositeDto } from './dto/create-microsite.dto';
import { UpdateMicrositeDto } from './dto/update-microsite.dto';

@Injectable()
export class MicrositesService {
  create(createMicrositeDto: CreateMicrositeDto) {
    return 'This action adds a new microsite';
  }

  findAll() {
    return `This action returns all microsites`;
  }

  findOne(id: number) {
    return `This action returns a #${id} microsite`;
  }

  update(id: number, updateMicrositeDto: UpdateMicrositeDto) {
    return `This action updates a #${id} microsite`;
  }

  remove(id: number) {
    return `This action removes a #${id} microsite`;
  }
}
