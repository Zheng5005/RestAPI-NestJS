import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = await this.categoryRepository.save(createCategoryDto)
      return this.findOne(newCategory.id);
    } catch (error) {
      throw new BadRequestException('Error creating category')
    }
  }

  async findAll() {
    const categories = await this.categoryRepository.find()
    return categories
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({id})
    if (!category) {
      throw new NotFoundException('Category no found')
    }

    return category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.findOne(id)
      const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto)
      const savedCategory = await this.categoryRepository.save(updatedCategory)

      return savedCategory
    } catch (error) {
      throw new BadRequestException('Error updating category')
    }
  }

  async remove(id: number) {
    try {
      await this.categoryRepository.delete(id)
      return { message: 'Category deleted' }
    } catch (error) {
      throw new  BadRequestException('Error deleting category')
    }
  }
}
