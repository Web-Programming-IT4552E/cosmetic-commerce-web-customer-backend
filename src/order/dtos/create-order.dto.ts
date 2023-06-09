import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ShippingAddressDetailDto } from 'src/shipping_address/dtos/shippingAddressDetail.dto';
import { CreateOrderProduct } from './create-order-product.dto';

export class CreateOrderDto {
  /**
   * Customer email
   */
  @IsEmail()
  @IsNotEmpty()
  customer_email: string;

  /**
   * Array of product IDs
   */
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => CreateOrderProduct)
  products: CreateOrderProduct[];

  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @IsNotEmpty()
  @Type(() => ShippingAddressDetailDto)
  @ValidateNested()
  shipping_address: ShippingAddressDetailDto;
}
