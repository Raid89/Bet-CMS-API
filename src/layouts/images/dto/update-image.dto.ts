import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateImagesDto } from "./create-image.dto";
import { IsOptional } from "class-validator";

export class UpdateImageDto extends PartialType(CreateImagesDto) {
    @ApiProperty({ type: String, description: 'Link de la imagen' })
    @IsOptional()
    link?: string;
}