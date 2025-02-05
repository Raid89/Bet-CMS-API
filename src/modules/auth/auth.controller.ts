import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { NextLoggerService } from '../logger/logger.service';
import { LoginDto } from './dto/auth.dto';
import { UserRegisterDto } from './dto/register.dto';
import { AuthGuard } from '../..//guards/auth.guard';

export interface AuthCustomRequest extends Request {
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
    async getMeInfo(@Req() req: AuthCustomRequest, @Res() res: Response) {
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
}
