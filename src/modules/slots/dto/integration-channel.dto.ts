import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIntegrationChannelDto {
  @ApiProperty({ 
    description: 'Nombre del canal de integración',
    example: 'GREENTUBE'
  })
  @IsString()
  @IsNotEmpty()
  integrationChannel?: string;
}
