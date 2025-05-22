import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateIntegrationChannelDto {
    @ApiProperty({ required: true, type: String, example: 'EGT-GAMES' })
    @IsString()
    @IsNotEmpty()
    integrationChannel!: string;
}