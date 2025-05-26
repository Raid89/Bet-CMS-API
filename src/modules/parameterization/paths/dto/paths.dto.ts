import { IsString, IsNotEmpty, IsDate, IsMongoId, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreatePathDto {
    @ApiProperty({ required: true, type: String, example: 'Nombre ruta' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ required: true, type: String, example: '/ruta-necesaria' })
    @IsString()
    @IsNotEmpty()
    path!: string;

    @ApiProperty({ required: false, type: Boolean, example: true, default: false })
    @IsBoolean()
    @IsOptional()
    status!: boolean;
}

export class UpdatePathDto extends PartialType(CreatePathDto) {}