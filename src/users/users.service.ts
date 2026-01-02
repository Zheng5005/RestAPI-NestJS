import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find()
    return users
  }

  async findOne(id: number) {
    const user = await this.findUser(id)
    return user
  }

  async findOneProfile(id: number) {
    try {
      const user = await this.findUser(id)
      return user.profile
    } catch (error) {
      throw new BadRequestException('Error getting profile')
    }
  }

  async findOnePosts(id: number) {
    try {
      const user = await this.findUser(id)
      return user.posts
    } catch (error) {
      throw new BadRequestException('Error getting profile')
    }
  }

  async createUser(body: CreateUserDto) {
    try {
      const newUser = await this.userRepository.save(body)
      return newUser;
    } catch (error) {
      throw new BadRequestException('Error creating user')
    }
  }

  async updateUser(body: DeepPartial<User>, id: number) {
    try {
      const user = await this.findUser(id)
      const updatedUser = this.userRepository.merge(user,body)
      const savedUser = await this.userRepository.save(updatedUser);
      return savedUser
    } catch (error) {
      throw new BadRequestException('Error updating user')
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.findUser(id)
      await this.userRepository.delete(user.id)
      return { message: 'User deleted' };
    } catch (error) {
      throw new BadRequestException('Error deleting user')
    }
  }

  private async findUser(id: number) {
    const user = await this.userRepository.findOneBy({id})
    if (!user){
      throw new NotFoundException("User not found")
    }

    return user
  }
}
