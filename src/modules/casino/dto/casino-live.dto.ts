import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCasinoLiveDto {
  @ApiProperty({ description: 'Título del juego de casino live' })
  @IsString()
  @IsOptional()
  title!: string;

  @ApiProperty({ description: 'Código del juego' })
  @IsString()
  @IsOptional()
  gameCode!: string;

  @ApiProperty({ description: 'Estado del juego', default: 'active', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'Posición en el listado', required: false })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiProperty({ description: 'Nombre del archivo de imagen', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'Nombre del archivo de icono', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: 'Fecha de creación', required: false })
  @IsOptional()
  date?: Date;
}

export class UpdateCasinoLiveDto {
  @ApiProperty({ description: 'Título del juego de casino live', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Código del juego', required: false })
  @IsString()
  @IsOptional()
  gameCode?: string;

  @ApiProperty({ description: 'Estado del juego', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'Posición en el listado', required: false })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiProperty({ description: 'Nombre del archivo de imagen', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'Nombre del archivo de icono', required: false })
  @IsString()
  @IsOptional()
  icon?: string;
}
