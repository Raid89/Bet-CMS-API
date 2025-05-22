import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateImagesDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    titulo!: string;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    alt!: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    image!: any
}