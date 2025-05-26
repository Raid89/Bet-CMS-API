import { IsString, IsNotEmpty, IsDate, IsMongoId, IsOptional, IsBoolean, ValidateNested } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { CreatePathDto } from "../../paths/dto/paths.dto";

export class CreatePointDto {
    @ApiProperty({ required: true, type: String, example: 'Nombre ruta' })
    @IsString()
    @IsNotEmpty()
    marca!: string;
  
    @ApiProperty({ required: true, type: String, example: 'tipo' })
    @IsString()
    @IsNotEmpty()
    tipo!: string;
  
    @ApiProperty({ required: true, type: String, example: '11001' })
    @IsString()
    @IsNotEmpty()
    dane!: string;
  
    @ApiProperty({ required: true, type: String, example: 'Bogotá' })
    @IsString()
    @IsNotEmpty()
    ciudad!: string;
  
    @ApiProperty({ required: true, type: String, example: 'Cundinamarca' })
    @IsString()
    @IsNotEmpty()
    departamento!: string;
  
    @ApiProperty({ required: true, type: String, example: 'Calle 123 #45-67' })
    @IsString()
    @IsNotEmpty()
    direccion!: string;
  
    @ApiProperty({ required: false, type: () => GdDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => GdDto)
    gd?: GdDto;
}

export class GdDto {
    @ApiProperty({ required: true, type: String, example: '4.648283' })
    @IsString()
    @IsNotEmpty()
    latitud!: string;
  
    @ApiProperty({ required: true, type: String, example: '-74.247894' })
    @IsString()
    @IsNotEmpty()
    longitud!: string;
}

export class UpdatePointDto extends PartialType(CreatePointDto) {}