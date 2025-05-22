import { Injectable } from '@nestjs/common';
import { CreateJackpotDto } from './dto/create-jackpot.dto';
import { UpdateJackpotDto } from './dto/update-jackpot.dto';

@Injectable()
export class JackpotService {
  create(createJackpotDto: CreateJackpotDto) {
    return 'This action adds a new jackpot';
  }

  findAll() {
    return `This action returns all jackpot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jackpot`;
  }

  update(id: number, updateJackpotDto: UpdateJackpotDto) {
    return `This action updates a #${id} jackpot`;
  }

  remove(id: number) {
    return `This action removes a #${id} jackpot`;
  }
}
