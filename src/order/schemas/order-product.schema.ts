import { prop } from '@typegoose/typegoose';

export class OrderProduct {
  @prop()
  product_id: string;

  @prop()
  name: string;

  @prop()
  price: number;

  @prop()
  quantity: number;

  @prop()
  image: string;
}
