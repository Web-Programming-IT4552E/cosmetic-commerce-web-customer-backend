import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShippingAddressDto } from './dtos/createShippingAddress.dto';
import { GetListShippingAddressQuery } from './dtos/getListShippingAddress.dto';
import { UpdateShippingAddressDto } from './dtos/updateShippingAddress.dto';
import { ShippingAddressStatus } from './enums/shipping-address-status.enum';
import { ShippingAddressRepository } from './shipping_address.repository';

@Injectable()
export class ShippingAddressService {
  constructor(
    private readonly shippingAddressRepository: ShippingAddressRepository,
  ) {}

  async getListShippingAddresss(
    getListShippingAddressQuery: GetListShippingAddressQuery,
    user_id: string,
  ) {
    const { page, limit } = { ...getListShippingAddressQuery };
    const query = { user_id, status: ShippingAddressStatus.ACTIVE };
    const data = await this.shippingAddressRepository.getListShippingAddresss(
      query,
      page,
      limit,
    );
    const total =
      await this.shippingAddressRepository.countShippingAddressDocument(query);
    return {
      paginationInfo: {
        page,
        limit,
        total,
      },
      data,
    };
  }

  async getShippingAddressByID(shipping_address_id: string, user_id: string) {
    const query = {
      _id: shipping_address_id,
      user_id,
      status: ShippingAddressStatus.ACTIVE,
    };
    const shippingAddress =
      await this.shippingAddressRepository.getShippingAddressDetailByID(query);
    if (!shippingAddress) {
      throw new NotFoundException('Not found shipping address');
    }
    return shippingAddress;
  }

  async updateShippingAddress(
    shipping_address_id: string,
    updateShippingAddressDto: UpdateShippingAddressDto,
    user_id: string,
  ) {
    const query = {
      _id: shipping_address_id,
      user_id,
      status: ShippingAddressStatus.ACTIVE,
    };
    const updatedAddress =
      await this.shippingAddressRepository.findOneAndUpdateShippingAddress(
        query,
        updateShippingAddressDto,
      );
    if (!updatedAddress) {
      throw new NotFoundException('Not found to update this shipping address!');
    }
    return updatedAddress;
  }

  async deleteShippingAddress(shipping_address_id: string, user_id: string) {
    const query = {
      _id: shipping_address_id,
      user_id,
      status: ShippingAddressStatus.ACTIVE,
    };
    return this.shippingAddressRepository.findOneAndUpdateShippingAddress(
      query,
      { status: ShippingAddressStatus.DELETED },
    );
  }

  async createShippingAddress(
    createShippingAddressDto: CreateShippingAddressDto,
    user_id: string,
  ) {
    return this.shippingAddressRepository.createShippingAddress({
      ...createShippingAddressDto,
      user_id,
      status: ShippingAddressStatus.ACTIVE,
    });
  }
}
