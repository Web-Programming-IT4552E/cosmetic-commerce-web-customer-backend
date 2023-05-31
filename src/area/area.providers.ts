import { FactoryProvider } from '@nestjs/common';
import { getModelForClass } from '@typegoose/typegoose';
import { DATABASE_CONNECTION_NAME } from '../database/database.constants';
import { City } from './schemas/city.schema';
import { Country } from './schemas/country.schema';
import { District } from './schemas/district.schema';
import { Ward } from './schemas/ward.schema';

export const areaProviders: FactoryProvider[] = [
  ...[Country, City, District, Ward].map<FactoryProvider>((ModelClass) => ({
    provide: ModelClass,
    inject: [DATABASE_CONNECTION_NAME],
    useFactory: () => getModelForClass(ModelClass),
  })),
];
