import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserRegisterDto {
    @ApiProperty({ 
        type: String, 
        description: 'Nombre del usuario', 
        example: 'betplayUser' 
    })
    @IsString()
    username!: string;

    @ApiProperty({ 
        type: String, 
        description: 'Email del usuario', 
        example: 'betplay@correo.com'
    })
    @IsString()
    email!: string;

    @ApiProperty({
        type: String,
        description: 'Contraseña del usuario',
        example: 'example123*'
    })
    @IsString()
    password!: string;

    @ApiProperty({
        type: String,
        description: 'Rol del usuario',
        example: '6595c5a6c5d8bc7'
    })
    @IsString()
    role!: string;

    register_date!: Date;
}

export class UpdateUserDto extends PartialType(UserRegisterDto) {}