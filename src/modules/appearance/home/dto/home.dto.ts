import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { HomeImagesValidTypes } from '../home.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHomeImageDto {
    @ApiProperty({ enum: HomeImagesValidTypes })
    @IsEnum(HomeImagesValidTypes)
    @IsNotEmpty()
    type!: HomeImagesValidTypes;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    link!: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    titleImg?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    altImg?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    path?: string;

    @ApiProperty({ required: false })
    @IsDate()
    @IsOptional()
    date?: Date;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    sort?: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    state?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    alt?: string;
}