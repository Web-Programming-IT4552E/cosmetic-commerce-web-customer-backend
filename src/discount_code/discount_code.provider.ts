import { FactoryProvider } from '@nestjs/common';
import { getModelForClass } from '@typegoose/typegoose';
import { DATABASE_CONNECTION_NAME } from '../database/database.constants';
import { DiscountCode } from './schemas/discount_code.schema';

export const discountCodeProviders: FactoryProvider[] = [
  ...[DiscountCode].map<FactoryProvider>((ModelClass) => ({
    provide: ModelClass,
    inject: [DATABASE_CONNECTION_NAME],
    useFactory: () => getModelForClass(ModelClass),
  })),
];
