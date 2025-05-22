import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema, User } from './schemas/auth.shema';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { ValidatePasswordService } from 'src/common/validate-password.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: AuthSchema }]),
    LoggerModule,
    ConfigModule,
    JwtModule
  ],
  controllers: [UsersController],
  providers: [UsersService, ValidatePasswordService],
})
export class UsersModule {}
