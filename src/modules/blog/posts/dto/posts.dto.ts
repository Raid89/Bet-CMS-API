import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subtitle!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pageTitle!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shortDescription!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  html!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageDescription?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isFeature?: boolean;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  titulo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  alt?: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}