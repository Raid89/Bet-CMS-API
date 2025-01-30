import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { NextLoggerService } from '../logger/logger.service';
import { LoginDto } from './dto/auth.dto';
import { UserRegisterDto, UpdateUserDto } from './dto/register.dto';
import { AuthGuard } from '../..//guards/auth.guard';

interface CustomRequest extends Request {
    user: JwtPayload;
}


@ApiTags('Auth')
@Controller('')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly logger: NextLoggerService,
    ) {}

    @ApiTags('Get Token')
    @Post('auth/login')
    @ApiOperation({ summary: 'Login de usuario' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Login exitoso' })
    @ApiResponse({ status: 400, description: 'Error al hacer login' })
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        try {
            const sessionInfo = await this.authService.login(loginDto.email, loginDto.password);
            const response = {
                token: sessionInfo.token,
                code: 100,
                role: sessionInfo.role
            }
            res.status(200).json(response);
        } catch (error) {
            this.logger.error('Error al hacer login', 'login', JSON.stringify(error));
            res.status(400).json({ code: 400, message: 'Error al hacer login' });
        }
    }

    @Post('auth/register')
    @ApiOperation({ summary: 'Registro de usuario' })
    @ApiSecurity('bearer')
    @ApiBody({ type: UserRegisterDto })
    @ApiResponse({ status: 200, description: 'Registro exitoso' })
    @ApiResponse({ status: 400, description: 'Error al registrar usuario' })
    async register(@Body() userRegisterDto: UserRegisterDto, @Res() res: Response) {
        try {
            const token = await this.authService.register(userRegisterDto);
            res.status(200).json({ code: 100, message: "User creado con exito!", token });
        } catch (error) {
            this.logger.error('Error al registrar usuario', 'register', JSON.stringify(error));
            res.status(400).json({ code: 400, message: 'Error al registrar usuario' });
        }
    }

    @Get('auth/me')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Obtener usuario actual' })
    @ApiSecurity('bearer')
    @ApiResponse({ status: 200, description: 'Usuario actual' })
    @ApiResponse({ status: 400, description: 'Error al obtener usuario actual' })
    async getMeInfo(@Req() req: CustomRequest, @Res() res: Response) {
        try {
            const email = req.user.email;
            console.log(email)
            const user = await this.authService.getMeInfo(email);
            res.status(200).json( user );
        } catch (error) {
            this.logger.error('Error al obtener usuario actual', 'me', JSON.stringify(error));
            res.status(400).json({ code: 400, message: 'Error al obtener usuario actual' });
        }
    }

    @Post('auth/update-me')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Actualizar usuario actual' })
    @ApiSecurity('bearer')
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'Usuario actualizado' })
    @ApiResponse({ status: 400, description: 'Error al actualizar usuario actual' })
    async updateMeUser(@Req() req: CustomRequest, @Body() userInformation: UpdateUserDto, @Res() res: Response) {
        try {
            const email = req.user.email;
            const updatedUser = await this.authService.updateUserByEmail(email, userInformation);
            res.status(200).json( updatedUser );
        } catch (error) {
            this.logger.error('Error al actualizar usuario actual', 'update-me', JSON.stringify(error));
            res.status(400).json({ code: 400, message: 'Error al actualizar usuario actual' });
        }
    }

    @Post('users/update-user/:id')
    @ApiOperation({ summary: 'Actualizar usuario actual' })
    @ApiSecurity('bearer')
    @ApiParam({ name: 'id', type: String, description: 'Id del usuario' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'Usuario actualizado' })
    @ApiResponse({ status: 400, description: 'Error al actualizar usuario actual' })
    async updateUser(@Param('id') id: string, @Body() userInformation: UpdateUserDto, @Res() res: Response) {
        try {
            const updatedUser = await this.authService.updateUser(id, userInformation);
            res.status(200).json( updatedUser );
        } catch (error) {
            this.logger.error('Error al actualizar usuario actual', 'update-me', JSON.stringify(error));
            res.status(400).json({ code: 400, message: 'Error al actualizar usuario actual' });
        }
    }

    @Delete('users/delete-user/:id')
    @ApiOperation({ summary: 'Eliminar usuario' })
    @ApiSecurity('bearer')
    @ApiParam({ name: 'id', type: String, description: 'Id del usuario' })
    @ApiResponse({ status: 200, description: 'Usuario eliminado' })
    @ApiResponse({ status: 400, description: 'Error al eliminar usuario' })
    async deleteUser(@Param('id') id: string, @Res() res: Response) {
        try {
            const user = await this.authService.deleteUser(id);
            res.status(200).json( user );
        } catch (error) {
            this.logger.error('Error al eliminar usuario', 'deleteUser', JSON.stringify(error));
            res.status(400).json({ code: 400, message: 'Error al eliminar usuario' });
        }
    }

    @Get('users/get-all/:limit/:skip')
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiSecurity('bearer')
    @ApiParam({ name: 'limit', type: Number, description: 'Limite de usuarios' })
    @ApiParam({ name: 'skip', type: Number, description: 'Salto de usuarios' })
    @ApiResponse({ status: 200, description: 'Usuarios' })
    @ApiResponse({ status: 400, description: 'Error al obtener los usuarios' })
    async getAllUsers(@Param('limit') limit: number, @Param('skip') skip: number, @Res() res: Response) {
        try {
            const users = await this.authService.getAllUsers(limit, skip);
            res.status(200).json( users );
        } catch (error) {
            this.logger.error('Error al obtener los usuarios', 'getAllUsers', JSON.stringify(error));
            res.status(400).json({ code: 400, message: 'Error al obtener los usuarios' });
        }
    }

    @Get('users/get-single-user/:uid')
    @ApiOperation({ summary: 'Obtener un usuario' })
    @ApiSecurity('bearer')
    @ApiParam({ name: 'uid', type: String, description: 'Id del usuario' })
    @ApiResponse({ status: 200, description: 'Usuario' })
    @ApiResponse({ status: 400, description: 'Error al obtener el usuario' })
    async getSingleUser(@Param('uid') uid: string, @Res() res: Response) {
        try {
            const user = await this.authService.getSingleUser(uid);
            res.status(200).json( user );
        } catch (error) {
            this.logger.error('Error al obtener el usuario', 'getSingleUser', JSON.stringify(error));
            res.status(400).json({ code: 400, message: 'Error al obtener el usuario' });
        }
    }
}
