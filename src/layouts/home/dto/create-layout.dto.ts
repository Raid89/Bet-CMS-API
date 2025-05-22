import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, isNumber } from "class-validator";

export class CreateLayoutDto {
    @ApiProperty({ type: Date })
    @IsNotEmpty()
    activationDate!: Date;
    
    @ApiProperty({ type: Number })
    @IsNumber()
    @IsNotEmpty()
    idLayout!: number;

    @ApiProperty({ type: [String] })
    @IsNotEmpty() 
    layout!: string[];
}