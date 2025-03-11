import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDate, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePromoDto {
    @ApiProperty({ required: true, type: String, example: 'Titulo de la promoción' })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ required: true, type: String, example: 'Descripción corta de la promoción' })
    @IsString()
    @IsNotEmpty()
    short_desc!: string;

    @ApiProperty({ required: true, type: String, example: '<p>Contenido de la promoción<p>' })
    @IsString()
    @IsNotEmpty()
    html!: string;

    @ApiProperty({ required: true, type: Date, example: '2024-07-01T00:00:00Z' })
    @IsDate()
    @IsNotEmpty()
    dateActivation!: Date;

    @ApiProperty({ required: true, type: Date, example: '2024-07-31T00:00:00Z' })
    @IsDate()
    @IsNotEmpty()
    dateDeactivated!: Date;

    @ApiProperty({ required: false, type: String, example: '60d5ec49f1a5c8001c8d98a2' })
    @IsMongoId()
    @IsOptional()
    author!: string;

    @ApiProperty({ required: true, type: String, example: '60d5ec49f1a5c8001c8d98b3' })
    @IsMongoId()
    @IsNotEmpty()
    categoryId?: string;

    @ApiProperty({ required: true, type: String, example: 'Titulo SEO' })
    @IsString()
    @IsNotEmpty()
    titulo!: string;

    @ApiProperty({ required: true, type: String, example: 'Alt SEO' })
    @IsString()
    @IsNotEmpty()
    alt!: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    image!: any

    feature?: any;
    date?: Date;
}

export class UpdatePromoDto extends PartialType(CreatePromoDto) {
    @ApiProperty({ required: true, type: Date, example: '2024-07-01T00:00:00Z' })
    @IsDate()
    @IsNotEmpty()
    dateActivation!: Date;

    @ApiProperty({ required: true, type: Date, example: '2024-07-31T00:00:00Z' })
    @IsDate()
    @IsNotEmpty()
    dateDeactivated!: Date;
}