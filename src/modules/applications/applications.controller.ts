import { Controller, Get, Post, Put, Delete, Param, Body, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationDto } from './dto/applications.dto';
import { Applications } from './applications.schema';
import { NextLoggerService } from '../../modules/logger/logger.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Applications')
@Controller('')
export class ApplicationsController {
    constructor(
        private readonly configService: ConfigService,
        private readonly applicationsService: ApplicationsService,
        private readonly logger: NextLoggerService,
    ) {}

    @Get('applications/:start/:limit')
    @ApiOperation({ summary: 'Get applications with pagination' })
    @ApiParam({ name: 'start', type: Number })
    @ApiParam({ name: 'limit', type: Number })
    @ApiResponse({ status: 200, description: 'List of applications', type: [Applications] })
    public async getApplications(@Param('start') start: number, @Param('limit') limit: number, @Res() res: Response) {
        try {
            const applications = await this.applicationsService.getApplications(start, limit);
            const response = {
                data: applications,
                ok: true,
                url: `${this.configService.get('IMAGE_HOST')}/apks/`
            }
            res.status(200).json(response);
        } catch (error) {
            this.logger.error('Error fetching applications', 'getApplications', JSON.stringify(error));
            res.status(422).json({ message: 'Error fetching applications' });
        }
    }

    @Get('applications/active')
    @ApiOperation({ summary: 'Get active applications' })
    @ApiResponse({ status: 200, description: 'List of active applications', type: [Applications] })
    public async getActiveApplication(@Res() res: Response) {
        try {
            const activeApplications = await this.applicationsService.getActiveApplication();
            const response = {
                data: activeApplications,
                ok: true,
                url: `${this.configService.get('IMAGE_HOST')}/apks/`
            }
            res.status(200).json(response);
        } catch (error) {
            this.logger.error('Error fetching active applications', 'getActiveApplication', JSON.stringify(error));
            res.status(422).json({ message: 'Error fetching active applications' });
        }
    }

    @Put('application/:id')
    @ApiOperation({ summary: 'Switch application state' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Updated application', type: Applications })
    public async switchStateApplication(@Param('id') id: string, @Res() res: Response) {
        try {
            const updatedApplication = await this.applicationsService.switchStateApplication(id);
            res.status(200).json(updatedApplication);
        } catch (error) {
            this.logger.error('Error switching application state', 'switchStateApplication', JSON.stringify(error));
            res.status(422).json({ message: 'Error switching application state' });
        }
    }

    @Post('applications')
    @ApiOperation({ summary: 'Create a new application' })
    @ApiBody({ type: CreateApplicationDto })
    @ApiResponse({ status: 201, description: 'Created application', type: Applications })
    @UseInterceptors(FileInterceptor('apk'))
    public async createApplication(@Body() body: CreateApplicationDto, @UploadedFile() apk: any, @Res() res: Response) {
        try {
            const newApplication = await this.applicationsService.createApplication(body, apk);
            res.status(201).json(newApplication);
        } catch (error) {
            this.logger.error('Error creating application', 'createApplication', JSON.stringify(error));
            res.status(422).json({ message: 'Error creating application' });
        }
    }

    @Delete('application/:id')
    @ApiOperation({ summary: 'Delete an application' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Deleted application', type: Applications })
    public async deleteApplication(@Param('id') id: string, @Res() res: Response) {
        try {
            const deletedApplication = await this.applicationsService.deleteApplication(id);
            res.status(200).json(deletedApplication);
        } catch (error) {
            this.logger.error('Error deleting application', 'deleteApplication', JSON.stringify(error));
            res.status(422).json({ message: 'Error deleting application' });
        }
    }
}
