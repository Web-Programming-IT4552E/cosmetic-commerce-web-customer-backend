import { IsInt, IsMongoId, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrderProduct {
  @IsMongoId()
  @IsNotEmpty()
  product_id: string;

  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
