import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ 
    description: 'Título de la categoría',
    example: 'Nueva Categoria'
  })
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({ 
    description: 'Orden de la categoría',
    example: 100,
    default: 100
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @IsOptional()
  sort?: number = 100;

  @ApiProperty({
    description: 'Imagen de la categoría (requerida)',
    type: 'string',
    format: 'binary',
    required: true
  })
  image: any;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({ 
    description: 'ID de la categoría a actualizar',
    example: '60c72b2f9b1d8c001c8e4f3a'
  })
  @IsString()
  @IsOptional()
  currentLabel?: string;
 
}
