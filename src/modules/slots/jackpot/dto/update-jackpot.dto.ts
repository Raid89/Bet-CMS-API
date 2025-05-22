import { PartialType } from '@nestjs/swagger';
import { CreateJackpotDto } from './create-jackpot.dto';

export class UpdateJackpotDto extends PartialType(CreateJackpotDto) {}
