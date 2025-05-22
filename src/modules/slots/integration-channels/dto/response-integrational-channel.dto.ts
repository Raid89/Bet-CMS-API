import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ResponseIntegrationalChannelDto {
    @ApiProperty({ required: true, type: String, example: '54dsa4456dzxc' })
    @IsMongoId()
    @IsOptional()
    _id?: string;

    @ApiProperty({ required: true, type: String, example: '100' })
    @IsString()
    @IsNotEmpty()
    code!: string;

    @ApiProperty({ required: true, type: String, example: 'Channel creado con Extito!' })
    @IsString()
    @IsNotEmpty()
    message!: string;
}