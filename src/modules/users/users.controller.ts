import { Controller, Get, Post, Body, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express'
import { ApiOperation, ApiSecurity, ApiBody, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthCustomRequest } from '../auth/auth.controller';
import { NextLoggerService } from '../logger/logger.service';

@ApiTags('Users')
@Controller('')
export class UsersController {
  constructor(
    private readonly usersService: UsersService, 
    private readonly logger: NextLoggerService
  ) {}

  @Post('auth/update-me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar usuario actual' })
  @ApiSecurity('bearer')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 400, description: 'Error al actualizar usuario actual' })
  async updateMeUser(@Req() req: AuthCustomRequest, @Body() userInformation: UpdateUserDto, @Res() res: Response) {
      try {
          const email = req.user.email;
          const updatedUser = await this.usersService.updateUserByEmail(email, userInformation);
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
          const updatedUser = await this.usersService.updateUser(id, userInformation);
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
          const user = await this.usersService.deleteUser(id);
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
          const users = await this.usersService.getAllUsers(limit, skip);
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
          const user = await this.usersService.getSingleUser(uid);
          res.status(200).json( user );
      } catch (error) {
          this.logger.error('Error al obtener el usuario', 'getSingleUser', JSON.stringify(error));
          res.status(400).json({ code: 400, message: 'Error al obtener el usuario' });
      }
  }

}
