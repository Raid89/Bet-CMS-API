import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagDocument, TagsSchema } from './schemas/tags.schema';
import { LoggerModule } from '../logger/logger.module';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: TagDocument.name, schema: TagsSchema },
        ]),
        LoggerModule
    ],
    providers: [TagsService],
    controllers: [TagsController],	
})
export class TagsModule {}
