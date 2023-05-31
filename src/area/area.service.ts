import { Injectable } from '@nestjs/common';
import { AreaRepository } from './area.repository';

@Injectable()
export class AreaService {
  constructor(private readonly areaRepository: AreaRepository) {}

  async getAllCountries() {
    return this.areaRepository.getAllCountries();
  }

  async getCountryByCode(code: string) {
    return this.areaRepository.getCountryByCode(code);
  }

  async getAllCitiesByCountry(countryCode: string) {
    return this.areaRepository.getAllCitiesByCountry(countryCode);
  }

  async getCityByCode(code: string) {
    return this.areaRepository.getCityByCode(code);
  }

  async getAllDistrictsByCity(cityCode: string) {
    return this.areaRepository.getAllDistrictsByCity(cityCode);
  }

  async getDistrictByCode(code: string) {
    return this.areaRepository.getDistrictByCode(code);
  }

  async getAllWardsByDistrict(districtCode: string) {
    return this.areaRepository.getAllWardsByDistrict(districtCode);
  }

  async getWardByCode(code: string) {
    return this.areaRepository.getWardByCode(code);
  }
}
