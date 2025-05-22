import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePromoCategoryDto {
    @ApiProperty({ required: true, type: String, example: 'Nuevas' })
    @IsString()
    @IsNotEmpty()
    category!: string;

    @ApiProperty({ required: true, type: Number, example: 0 })
    @IsNumber()
    @IsNotEmpty()
    sort!: number;
}

export class UpdatePromoCategoryDto extends PartialType(CreatePromoCategoryDto) {}