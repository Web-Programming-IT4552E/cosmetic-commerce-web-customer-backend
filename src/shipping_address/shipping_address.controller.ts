import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/common/decorators/auth.decorator';
import { JwtPayload } from 'src/auth/dtos/jwt-payload.dto';
import { CreateShippingAddressDto } from './dtos/createShippingAddress.dto';
import { UpdateShippingAddressDto } from './dtos/updateShippingAddress.dto';
import { ShippingAddressService } from './shipping_address.service';
import { GetListShippingAddressQuery } from './dtos/getListShippingAddress.dto';

@ApiTags('shipping-address')
@Controller('/shipping-address')
export class ShippingAddressController {
  constructor(
    private readonly shippingAddressService: ShippingAddressService,
  ) {}

  @ApiOperation({
    security: [{ BearerAuth: [] }],
    description: 'get List Shipping Addresses',
  })
  @ApiBearerAuth()
  @Get('/')
  async getListShippingAddresses(
    @Query() getListQuery: GetListShippingAddressQuery,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    return this.shippingAddressService.getListShippingAddresss(
      getListQuery,
      jwtPayload.userId,
    );
  }

  @ApiOperation({
    description: 'get ShippingAddresss details',
  })
  @ApiBearerAuth()
  @Get('/:shipping_address_id')
  async getShippingAddressByID(
    @Param('shipping_address_id') shipping_address_id: string,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    if (!isValidObjectId(shipping_address_id))
      throw new BadRequestException('Invalid shipping_address_id');
    return this.shippingAddressService.getShippingAddressByID(
      shipping_address_id,
      jwtPayload.userId,
    );
  }

  @ApiOperation({
    description: 'create ShippingAddresss information details',
  })
  @ApiBearerAuth()
  @Post('')
  async createShippingAddress(
    @Body() createShippingAddressDto: CreateShippingAddressDto,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    await this.shippingAddressService.createShippingAddress(
      createShippingAddressDto,
      jwtPayload.userId,
    );
    return {
      message: 'Created Successfully',
    };
  }

  @ApiOperation({
    description: 'update ShippingAddresss information details',
  })
  @ApiBearerAuth()
  @Put('/:shipping_address_id')
  async updateShippingAddress(
    @Body() updateShippingAddressDto: UpdateShippingAddressDto,
    @Param('shipping_address_id') shipping_address_id: string,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    return this.shippingAddressService.updateShippingAddress(
      shipping_address_id,
      updateShippingAddressDto,
      jwtPayload.userId,
    );
  }

  @ApiOperation({
    description: 'Delete ShippingAddresss by ID',
  })
  @ApiBearerAuth()
  @Delete('/:shipping_address_id')
  async deleteShippingAddressByID(
    @Param('shipping_address_id') shipping_address_id: string,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    if (!isValidObjectId(shipping_address_id))
      throw new BadRequestException('Invalid shipping_address_id');
    if (
      !(await this.shippingAddressService.deleteShippingAddress(
        shipping_address_id,
        jwtPayload.userId,
      ))
    ) {
      throw new BadRequestException(
        'Not found to delete this shipping address',
      );
    }
    return {
      message: 'Deleted Successfully',
    };
  }
}
