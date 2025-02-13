import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagDocument } from './schemas/tags.schema';

@ApiTags('Game Tags')
@Controller('tags')
export class TagsController {
    constructor(private readonly TagsService: TagsService) {}

    @Get('get-tags')
    @ApiResponse({ status: 200, type: [TagDocument] })
    async getTags(): Promise<{ tags: TagDocument[] }> {
        return { tags: await this.TagsService.findAllTags() }
    }

    @Post('new-tag')
    @ApiBody({ type: CreateTagDto })
    createTag(@Body() tagData: CreateTagDto): Promise<CreateTagDto> {
        console.log(tagData);
        return this.TagsService.createTag(tagData);
    }
    
    @Put('update-tag/:id')
    @ApiBody({ type: UpdateTagDto })
    updateTag(@Param('id') tagId: string , @Body() tagData: UpdateTagDto) {
        return this.TagsService.updateTag(tagId, tagData);
    }

    @Delete('remove-tag/:id')
    removeTag(@Param('id') tagId: string) {
        return this.TagsService.deleteTag(tagId);
    }
}

