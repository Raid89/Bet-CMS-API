import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class ResponseCategoriesDto {
    @ApiProperty({ type: Boolean })
    ok!: boolean;

    @ApiProperty()
    data!: unknown;

    @ApiProperty()
    @IsOptional()
    total?: number;

    @ApiProperty()
    @IsOptional()
    banner?: any;

    @ApiProperty()
    @IsOptional()
    imagePath?: string;

}