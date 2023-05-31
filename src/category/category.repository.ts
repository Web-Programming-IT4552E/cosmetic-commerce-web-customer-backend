import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Category } from './category.schema';

@Injectable()
export class CategoryRepository {
  constructor(
    @Inject(Category)
    private readonly categoryModel: ReturnModelType<typeof Category>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryModel.find().lean().exec();
  }
}
