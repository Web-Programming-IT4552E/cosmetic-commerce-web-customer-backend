import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AreaService } from './area.service';

@ApiTags('area')
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @ApiOperation({ description: 'Get all countries' })
  @Get('countries')
  async getAllCountries() {
    return this.areaService.getAllCountries();
  }

  @ApiOperation({ description: 'Get all cities (provinces) by country code' })
  @ApiQuery({
    name: 'country',
    description: 'Country code, from get all countries method',
  })
  @Get('cities')
  async getAllCitiesByCountry(@Query('country') countryCode: string) {
    return this.areaService.getAllCitiesByCountry(countryCode);
  }

  @ApiOperation({ description: 'Get all districts by city (province) code' })
  @ApiQuery({
    name: 'city',
    description: 'City (province) code, from get all cities (provinces) method',
  })
  @Get('districts')
  async getAllDistrictsByCity(@Query('city') cityCode: string) {
    return this.areaService.getAllDistrictsByCity(cityCode);
  }

  @ApiOperation({ description: 'Get all wards by district code' })
  @ApiQuery({
    name: 'district',
    description: 'District code, from get all districts method',
  })
  @Get('wards')
  async getAllWardsByDistrict(@Query('district') districtCode: string) {
    return this.areaService.getAllWardsByDistrict(districtCode);
  }
}
