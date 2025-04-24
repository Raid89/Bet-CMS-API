import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTextDto {
  @ApiProperty({ required: true, description: 'JSON de configuración en string' })
  @IsString()
  @IsNotEmpty()
  json!: string;
}

export class UpdateTextDto extends PartialType(CreateTextDto) {}