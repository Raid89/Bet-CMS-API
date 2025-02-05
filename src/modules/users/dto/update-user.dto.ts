import { PartialType } from '@nestjs/swagger';
import { UserRegisterDto } from 'src/modules/auth/dto/register.dto';

export class UpdateUserDto extends PartialType(UserRegisterDto) {}
