import { FactoryProvider } from '@nestjs/common';
import { getModelForClass } from '@typegoose/typegoose';
import { DATABASE_CONNECTION_NAME } from '../database/database.constants';
import { Category } from './category.schema';

export const categoryProviders: FactoryProvider = {
  provide: Category,
  inject: [DATABASE_CONNECTION_NAME],
  useFactory: () => getModelForClass(Category),
};
