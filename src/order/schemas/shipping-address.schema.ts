import { prop } from '@typegoose/typegoose';

export class ShippingAddress {
  @prop()
  receiver_name: string;

  @prop()
  receiver_phone_number: string;

  @prop()
  city: string;

  @prop()
  district: string;

  @prop()
  ward: string;

  @prop()
  address: string;
}
