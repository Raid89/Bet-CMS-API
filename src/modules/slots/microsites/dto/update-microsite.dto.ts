import { PartialType } from '@nestjs/swagger';
import { CreateMicrositeDto } from './create-microsite.dto';

export class UpdateMicrositeDto extends PartialType(CreateMicrositeDto) {}
