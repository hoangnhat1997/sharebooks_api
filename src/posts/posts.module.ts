import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import PostsController from './posts.controller';
import PostsService from './posts.service';
import Post from './post.entity';
import PostsSearchService from './postsSearch.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostsService, PostsSearchService],
  controllers: [PostsController],
})
export class PostsModule {}
