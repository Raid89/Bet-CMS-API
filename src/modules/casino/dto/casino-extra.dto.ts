import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class CreateBannerDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsString()
  destinationUrl?: string;

  @IsOptional()
  @IsNumber()
  sort?: number;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  path?: string;
}

export class UpdateBannerDto extends CreateBannerDto {}

export class CreateCategoryDto {
  @IsString()
  category!: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsNumber()
  position?: number;
}

export class UpdateCategoryDto extends CreateCategoryDto {}

export class CreateChannelCodeDto {
  @IsString()
  integrationChannelCode!: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsDate()
  date?: Date;
}
