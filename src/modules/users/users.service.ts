import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NextLoggerService } from '../logger/logger.service';
import { User } from './schemas/auth.shema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private authModel: Model<User>,
    private readonly logger: NextLoggerService,
  ) { }

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
    } catch (error) {
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
}
