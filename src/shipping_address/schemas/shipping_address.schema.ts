import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { ShippingAddressDetail } from './shipping_address_detail.schema';
import { ShippingAddressStatus } from '../enums/shipping-address-status.enum';

@modelOptions({
  options: { allowMixed: 1 },
  schemaOptions: { collection: 'shipping_addresses' },
})
export class ShippingAddress {
  @prop({ required: true, type: Types.ObjectId, ref: () => User })
  user_id: Ref<User>;

  @prop({ required: true, _id: false })
  address_detail: ShippingAddressDetail;

  @prop({ required: true })
  status: ShippingAddressStatus;
}
