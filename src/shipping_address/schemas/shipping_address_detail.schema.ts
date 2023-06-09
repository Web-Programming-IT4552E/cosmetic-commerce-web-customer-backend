import { prop } from '@typegoose/typegoose';

export class ShippingAddressDetail {
  @prop({ required: true })
  receiver_name: string;

  @prop({ required: true })
  receiver_phone_number: string;

  @prop({ required: true })
  city: string;

  @prop({ required: true })
  district: string;

  @prop({ required: true })
  ward: string;

  @prop({ required: true })
  address: string;
}
