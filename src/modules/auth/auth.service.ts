import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextLoggerService } from '../logger/logger.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './auth.shema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from '../role/role.schema';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto, UpdateUserDto } from './dto/register.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private authModel: Model<User>,
        @InjectModel(Role.name) private roleModel: Model<Role>,
        private readonly configService: ConfigService,
        private readonly logger: NextLoggerService,
        private readonly jwtService: JwtService
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
            const isPasswordValid = await this.validatePassword(password, user.password);

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

    async updateUserByEmail(email: string, userInformation: UpdateUserDto) {
        try {

            const user = await this.authModel.findOne({ email });
            if (!user) { throw new NotFoundException('User not found'); }

            const updatedUser = await this.updateUser(user._id as string, userInformation);
            return updatedUser;
        } catch (error) {
            this.logger.error('Error al actualizar usuario actual', 'updateUser', JSON.stringify(error));
            throw error;
        }
    }

    async updateUser(id: string, userInformation: UpdateUserDto) {
        try {
            const user = await this.authModel.findById(id);
            if (!user) { throw new NotFoundException('User not found'); }

            const validateEmail = await this.authModel.findOne({ email: userInformation.email, _id: { $ne: user._id } });
            if (validateEmail) { throw new NotFoundException('Email already exists'); }

            if (userInformation.password) {
                const passwordHash = await bcrypt.hash(userInformation.password, 10);
                userInformation.password = passwordHash;
            }

            const updatedUser = await this.authModel.findByIdAndUpdate(id, userInformation, { new: true });
            return updatedUser;

        } catch (error) {
            this.logger.error('Error al actualizar usuario', 'updateUser', JSON.stringify(error));
            throw error;
        }
    }

    async deleteUser(id: string) {
        try {
            const user = await this.authModel.findByIdAndDelete(id);
            if (!user) { throw new NotFoundException('User not found'); }
            return user;
        } catch (error) {
            this.logger.error('Error al eliminar usuario', 'deleteUser', JSON.stringify(error));
            throw error;
        }
    }

    async getAllUsers(limit: number, skip: number) {
        try {
            const totalUsers = await this.authModel.countDocuments();
            const users = await this.authModel.find().limit(limit).skip(skip);
            return { count: totalUsers, data: users };
        } catch(error) {
            this.logger.error('Error al obtener los usuarios', 'getAllUsers', JSON.stringify(error));
            throw error;
        }
    }

    async getSingleUser(id: string) {
        try {
            const user = await this.authModel.findById(id);
            if (!user) { throw new NotFoundException('User not found'); }
            return user;
        } catch (error) {
            this.logger.error('Error al obtener usuario', 'getSingleUser', JSON.stringify(error));
            throw error;
        }
    }

    // UTILS FUNCTIONS

    async searchRole(id: string) {
        try {
            const role = await this.roleModel.findById(id);

            if (!role) { throw new NotFoundException('Role not found'); }

            return role;
        } catch (error) {
            this.logger.error('Error al buscar el rol', 'searchRole', JSON.stringify(error));
            throw error;
        }
    }

    private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
