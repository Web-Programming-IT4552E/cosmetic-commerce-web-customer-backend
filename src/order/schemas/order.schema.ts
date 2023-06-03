import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { getEnumValues } from '../../utils/enum-utils';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderProduct } from './order-product.schema';
import { ShippingAddress } from './shipping-address.schema';

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: 'create_time',
      updatedAt: 'updated_at',
    },
  },
})
export class Order {
  /**
   * Order ID
   */
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @prop({ required: true })
  order_id: number;

  /**
   * Purchased products
   */
  @prop({ type: OrderProduct, required: true, default: [], _id: false })
  products: Types.Array<OrderProduct>;

  /**
   * Order user ID
   */
  @ApiProperty({ type: String })
  @prop({ type: Types.ObjectId })
  user_id?: Types.ObjectId;

  @prop({ required: true })
  customer_email: string;

  @prop({ required: true, type: ShippingAddress, _id: false })
  shipping_address: ShippingAddress;

  @prop({ required: true })
  payment_method: string;

  @prop({ required: true })
  total_product_cost: number;

  @prop({ required: true, default: 0 })
  discount: number;

  @prop({ required: false })
  shipping_unit?: string;

  @prop({ required: false })
  shipping_cost?: number;

  @prop({ required: false })
  shipping_code?: string;

  @prop({ required: true, enum: getEnumValues(OrderStatus) })
  status: OrderStatus;

  @prop()
  create_time?: Date;

  @prop()
  updated_at?: Date;

  @ApiHideProperty()
  @prop({ select: false })
  __v: number;
}
