import { IsNotEmpty, IsString } from 'class-validator';

export class ShippingAddressDetailDto {
  @IsString()
  @IsNotEmpty()
  receiver_name: string;

  @IsString()
  @IsNotEmpty()
  receiver_phone_number: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  ward: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
