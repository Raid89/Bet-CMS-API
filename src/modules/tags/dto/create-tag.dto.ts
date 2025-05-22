import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTagDto {
    @ApiProperty({
        description: 'Tag name',
        type: String,
        required: true
    })
    @IsString()
    @IsNotEmpty()
    tag!: string;

    @ApiProperty({
        description: 'Tag description',
        type: String,
        required: true
    })
    @IsString()
    @IsOptional()
    description!: string;

    
}