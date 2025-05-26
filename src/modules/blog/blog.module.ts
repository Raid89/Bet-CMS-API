// src/blog/blog.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from '../logger/logger.module';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { FileStorageService } from '../../common/file-storage.service';

// Schemas
import { Posts, PostsSchema } from './posts/posts.schema';
import { Videos, VideosSchema } from './videos/videos.schema';
import { Blogs, BlogsSchema } from './blogs/blogs.schema';
import { Banners, BannersSchema } from './banners/banners.schema';

// Controllers
import { PostsController } from './posts/posts.controller';
import { VideosController } from './videos/videos.controller';
import { BlogsController } from './blogs/blogs.controller';
import { BannersController } from './banners/banners.controller';

// Services
import { PostsService } from './posts/posts.service';
import { VideosService } from './videos/videos.service';
import { BlogsService } from './blogs/blogs.service';
import { BannersService } from './banners/banners.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    LoggerModule,
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostsSchema },
      { name: Videos.name, schema: VideosSchema },
      { name: Blogs.name, schema: BlogsSchema },
      { name: Banners.name, schema: BannersSchema },
    ]),
  ],
  controllers: [
    PostsController,
    VideosController,
    BlogsController,
    BannersController,
  ],
  providers: [
    FileStorageService,
    PostsService,
    VideosService,
    BlogsService,
    BannersService,
  ],
})
export class BlogModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware);
    
  }
}
