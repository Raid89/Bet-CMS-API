import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({ 
        example: 'Category title', 
        description: 'Category title', 
        type: String 
    })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({
        example: 'Category label',
        description: 'Category label',
        type: String
    })
    @IsString()
    @IsOptional()
    label?: string;

    @ApiProperty({
        example: 100,
        description: 'Category sort',
        type: Number
    })
    @IsOptional()
    sort?: number;
}
