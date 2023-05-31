import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAllCategories() {
    return this.categoryRepository.getAllCategories();
  }
}
