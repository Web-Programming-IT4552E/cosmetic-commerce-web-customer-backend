import { FactoryProvider } from '@nestjs/common';
import { getModelForClass } from '@typegoose/typegoose';
import { DATABASE_CONNECTION_NAME } from '../database/database.constants';
import { Product } from './schemas/product.schema';

export const productProviders: FactoryProvider[] = [
  ...[Product].map<FactoryProvider>((ModelClass) => ({
    provide: ModelClass,
    inject: [DATABASE_CONNECTION_NAME],
    useFactory: () => getModelForClass(ModelClass),
  })),
];
