import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import Post from './post.entity';
import User from 'src/users/user.entity';
import PostsSearchService from './postsSearch.service';

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postsSearchService: PostsSearchService,
  ) {}

  getAllPosts() {
    return this.postsRepository.find({ relations: ['author'] });
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id: id },
      relations: ['author'],
    });

    //const post = (await this.postsRepository.findOne({ where: { id } })).author;
    if (post) {
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  // replacePost(id: number, post: UpdatePostDto) {
  //   const postIndex = this.posts.findIndex((post) => post.id === id);
  //   if (postIndex > -1) {
  //     this.posts[postIndex] = post;
  //     return post;
  //   }
  //   throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  // }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: user,
    });
    await this.postsRepository.save(newPost);
    this.postsSearchService.indexPost(newPost);
    return newPost;
  }
  // async updatePost(id: number, post: UpdatePostDto) {
  //   await this.postsRepository.update(id, post);
  //   const updatedPost = await this.postsRepository.findOne({ where: { id } });
  //   if (updatedPost) {
  //     return updatedPost;
  //   }
  //   throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  // }

  async searchForPosts(text: string) {
    const results = await this.postsSearchService.search(text);
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return [];
    }
    return this.postsRepository.find({ where: { id: In(ids) } });
  }
  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (updatedPost) {
      await this.postsSearchService.update(updatedPost);
      return updatedPost;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    await this.postsSearchService.remove(id);
  }
}
