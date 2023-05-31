import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { City } from './schemas/city.schema';
import { Country } from './schemas/country.schema';
import { District } from './schemas/district.schema';
import { Ward } from './schemas/ward.schema';

@Injectable()
export class AreaRepository {
  constructor(
    @Inject(Country)
    private readonly countryModel: ReturnModelType<typeof Country>,
    @Inject(City)
    private readonly cityModel: ReturnModelType<typeof City>,
    @Inject(District)
    private readonly districtModel: ReturnModelType<typeof District>,
    @Inject(Ward)
    private readonly wardModel: ReturnModelType<typeof Ward>,
  ) {}

  async getAllCountries(): Promise<Country[]> {
    return this.countryModel.find().sort({ code: 1 }).lean().exec();
  }

  async getCountryByCode(code: string): Promise<Country | null> {
    return this.countryModel.findOne({ code }).lean().exec();
  }

  async getAllCitiesByCountry(countryCode: string): Promise<City[]> {
    return this.cityModel
      .find({ country_code: countryCode })
      .sort({ code: 1 })
      .lean()
      .exec();
  }

  async getCityByCode(code: string): Promise<City | null> {
    return this.cityModel.findOne({ code }).lean().exec();
  }

  async getAllDistrictsByCity(cityCode: string): Promise<District[]> {
    return this.districtModel
      .find({ city_code: cityCode })
      .sort({ code: 1 })
      .lean()
      .exec();
  }

  async getDistrictByCode(code: string): Promise<District | null> {
    return this.districtModel.findOne({ code }).lean().exec();
  }

  async getAllWardsByDistrict(districtCode: string): Promise<Ward[]> {
    return this.wardModel
      .find({ district_code: districtCode })
      .sort({ code: 1 })
      .lean()
      .exec();
  }

  async getWardByCode(code: string): Promise<Ward | null> {
    return this.wardModel.findOne({ code }).lean().exec();
  }
}
