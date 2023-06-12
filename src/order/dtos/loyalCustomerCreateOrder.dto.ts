import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ShippingAddressDetailDto } from 'src/shipping_address/dtos/shippingAddressDetail.dto';
import { CreateOrderProduct } from './create-order-product.dto';

export class LoyalCustomerCreateOrderDto {
  @IsNotEmpty()
  @Type(() => ShippingAddressDetailDto)
  @ValidateNested()
  shipping_address: ShippingAddressDetailDto;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  payment_method: string;

  @Expose()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProduct)
  products: CreateOrderProduct[];

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  total_product_cost: number;

  @Expose()
  @IsOptional()
  @IsString()
  discount_code: string;
}
