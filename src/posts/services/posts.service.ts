import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const newPost = await this.postRepository.save({
        ...createPostDto,
        user: { id: createPostDto.userId },
        categories: createPostDto.categoryIds?.map((id) => ({id})),
      })
      return this.findOne(newPost.id);
    } catch (error) {
      throw new BadRequestException('Error creating post')
    }
  }

  async findAll() {
    const posts = await this.postRepository.find({
      relations: ['user.profile', 'categories']
    })
    return posts
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: {id},
      relations: ['user.profile', 'categories']
    })
    if (!post) {
      throw new NotFoundException('Post no found')
    }

    return post
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.findOne(id)
      const updatedPost = this.postRepository.merge(post, updatePostDto)
      const savedPost = await this.postRepository.save(updatedPost)

      return savedPost
    } catch (error) {
      throw new BadRequestException('Error updating post')
    }
  }

  async remove(id: number) {
    try {
      await this.postRepository.delete(id)
      return { message: 'Post deleted' }
    } catch (error) {
      throw new  BadRequestException('Error deleting post')
    }
  }
}
