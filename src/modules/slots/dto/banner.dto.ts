import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateSlotBannerDto {
  @ApiProperty({ description: 'Título del banner', required: false })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({ description: 'Texto alternativo del banner', required: false })
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiProperty({ description: 'URL de destino del banner', required: false })
  @IsOptional()
  @IsString()
  destinationUrl?: string;

  @ApiProperty({ description: 'Orden de visualización', required: false })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiProperty({ 
    description: 'Imagen del banner', 
    type: 'string', 
    format: 'binary',
    required: true 
  })
  image: any;
}
