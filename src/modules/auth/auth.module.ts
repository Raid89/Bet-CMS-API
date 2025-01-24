import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, AuthSchema } from './auth.shema';
import { Role, RoleSchema } from '../role/role.schema';
import { NextLoggerService } from '../logger/logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '../logger/logger.module';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: AuthSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '12h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    LoggerModule
  ],
  controllers: [ AuthController ],
  providers: [AuthService]
})
export class AuthModule { 
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/me', method: RequestMethod.GET }
      )
  }
}
