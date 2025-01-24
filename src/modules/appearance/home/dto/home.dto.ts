import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { HomeImagesStates, HomeImagesValidTypes } from '../home.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHomeImageDto {
    @ApiProperty({ enum: HomeImagesValidTypes })
    @IsEnum(HomeImagesValidTypes)
    @IsNotEmpty()
    type!: HomeImagesValidTypes;

    @ApiProperty({ required: true, type: String, example: 'https://betplay.com.co' })
    @IsString()
    @IsNotEmpty()
    link!: string;

    @ApiProperty({ required: false, type: Number, example: 0 })
    @IsNumber()
    @IsOptional()
    sort!: number;

    @ApiProperty({ required: false, type: String, example: 'Titulo de la imagen' })
    @IsString()
    @IsOptional()
    titulo?: string;

    @ApiProperty({ required: false, type: String, example: 'Texto alternativo' })
    @IsString()
    @IsOptional()
    alt?: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: any;

    path?: string;

    date?: Date;
}

export class UpdateHomeImageDto {
    @ApiProperty({ required: false, enum: HomeImagesValidTypes })
    @IsEnum(HomeImagesValidTypes)
    @IsOptional()
    type!: HomeImagesValidTypes;

    @ApiProperty({ required: true, type: String, example: 'https://betplay.com.co' })
    @IsString()
    @IsOptional()
    link!: string;

    @ApiProperty({ required: false, type: String, example: 'Titulo de la imagen' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ required: false, type: String, example: 'Texto alternativo' })
    @IsString()
    @IsOptional()
    alt?: string;

    @ApiProperty({ required: false, type: String, example: 'Texto alternativo' })
    @IsString()
    @IsOptional()
    state?: string;

    @ApiProperty({ required: false, type: Number, example: 0 })
    @IsNumber()
    @IsOptional()
    sort!: number;
}