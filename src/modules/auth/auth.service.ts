import { Injectable, NotFoundException } from '@nestjs/common';
import { NextLoggerService } from '../logger/logger.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/auth.shema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from '../role/role.schema';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './dto/register.dto';
import { ValidatePasswordService } from 'src/common/validate-password.service';
@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private authModel: Model<User>,
        @InjectModel(Role.name) private roleModel: Model<Role>,
        private readonly logger: NextLoggerService,
        private readonly jwtService: JwtService,
        private readonly validatePasswordService: ValidatePasswordService
    ) { }

    async register(userInformation: UserRegisterDto) {
        try {
            const user = await this.authModel.findOne({ email: userInformation.email });

            if (user) { throw new NotFoundException('User already exists'); }

            const role = await this.roleModel.findById(userInformation.role);

            if (!role) { throw new NotFoundException('Role not found'); }

            const hashedPassword = await bcrypt.hash(userInformation.password, 10);

            const newUser = new this.authModel({
                username: userInformation.username,
                email: userInformation.email,
                password: hashedPassword,
                rol: userInformation.role,
                register_date: new Date(),
                isactive: true
            });

            await newUser.save();

            const token = this.jwtService.sign({ id: newUser._id, email: newUser.email, role: role.name });
            
            return token;
        } catch (error) {
            this.logger.error('Error al registrar usuario', 'register', JSON.stringify(error));
            throw error;
        }
    }

    async login(email: string, password: string) {
        try {
            const user = await this.authModel.findOne({ email });

            if (!user) { throw new NotFoundException('User not found'); }
            const isPasswordValid = await this.validatePasswordService.validatePassword(password, user.password);

            if (!isPasswordValid) { throw new NotFoundException('Password not match'); }
            if (!user.isactive) { throw new NotFoundException('User is not active'); }

            if (!user.rol) { throw new NotFoundException('User has no role'); }
            const role = await this.roleModel.findById(user.rol);

            const sessionToken = this.jwtService.sign({ id: user._id, email: user.email, role: role?.name });
            return { token: sessionToken , role};
        } catch (error) {
            this.logger.error('Error al hacer login', 'login', JSON.stringify(error));
            throw error;
        }
    }

    async getMeInfo(email: string) {
        try {
            const user = await this.authModel.findOne({ email });
            if (!user) { throw new NotFoundException('User not found'); }
            return user;
        } catch (error) {
            this.logger.error('Error al obtener usuario actual', 'me', JSON.stringify(error));
            throw error;
        }
    }
}
