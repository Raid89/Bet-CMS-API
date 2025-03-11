import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePromoBannerDto {
    @ApiProperty({ required: false, type: String, example: 0 })
    @IsNumber()
    @IsOptional()
    sort!: number;

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

    path?: any;
    date?: Date;
}

export class UpdatePromoBannerDto extends PartialType(CreatePromoBannerDto) {
}