import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({ 
        type: String, 
        description: 'Email del usuario', 
        example: 'admin@betplay.com' 
    })
    @IsEmail()
    email!: string;

    @ApiProperty({ 
        type: String, 
        description: 'Contraseña del usuario', 
        example: 'example123*' 
    })
    @IsString()
    password!: string;
}