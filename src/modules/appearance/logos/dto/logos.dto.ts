import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateLogoDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    image: any;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    alt?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    titulo?: string;
}

export class UpdateLogoDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    type!: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    alt!: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    titulo!: string;
}

export class UpdateCarouselImageTitleAltDto {
    @ApiProperty()
    titulo!: string;

    @ApiProperty()
    alt!: string;
}
