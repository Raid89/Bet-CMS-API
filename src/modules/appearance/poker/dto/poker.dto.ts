import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber } from "class-validator";

export class CreatedPokerImageDto {
    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: any;

    @ApiProperty({ required: false, type: String, example: 'Titulo de la imagen' })
    @IsString()
    @IsOptional()
    titulo?: string;

    @ApiProperty({ required: false, type: String, example: 'Texto alternativo' })
    @IsString()
    @IsOptional()
    alt?: string;

    date?: Date;
    path?: string;
}

export class UpdatePokerImageDto {
    @ApiProperty({ required: false, type: String, example: 'Titulo de la imagen' })
    @IsString()
    @IsOptional()
    titulo?: string;

    @ApiProperty({ required: false, type: String, example: 'Texto alternativo' })
    @IsString()
    @IsOptional()
    alt?: string;

    @ApiProperty({ required: false, type: String, example: 'Texto alternativo' })
    @IsString()
    @IsOptional()
    link?: string;

    @ApiProperty({ required: false, type: String, example: 'Estado de la imagen' })
    @IsString()
    @IsOptional()
    state?: string;

    @ApiProperty({ required: false, type: Number, example: '1' })
    @IsNumber()
    @IsOptional()
    position?: number;
}

export class UpdatePokerDtoUrl {
    @ApiProperty({ required: false, type: String, example: 'Url del poker' })
    @IsString()
    @IsOptional()
    url?: string;

    @ApiProperty({ required: false, type: String, example: 'Estado de la url' })
    @IsString()
    @IsOptional()
    state?: string;

    date!: Date;
}