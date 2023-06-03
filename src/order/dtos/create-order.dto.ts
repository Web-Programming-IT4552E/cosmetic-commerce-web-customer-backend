import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
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

  @IsString()
  @IsNotEmpty()
  receiver_name: string;

  @IsString()
  @IsNotEmpty()
  receiver_phone_number: string;

  @IsString()
  @IsNotEmpty()
  shipping_city_code: string;

  @IsString()
  @IsNotEmpty()
  shipping_district_code: string;

  @IsString()
  @IsNotEmpty()
  shipping_ward_code: string;

  @IsString()
  @IsNotEmpty()
  shipping_address: string;
}
