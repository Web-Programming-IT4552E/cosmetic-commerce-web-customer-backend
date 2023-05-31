import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseModule } from '../database/database.module';
import { categoryProviders } from './category.providers';
import { CategoryRepository } from './category.repository';

@Module({
  imports: [DatabaseModule],
  providers: [CategoryService, CategoryRepository, categoryProviders],
  controllers: [CategoryController],
})
export class CategoryModule {}
