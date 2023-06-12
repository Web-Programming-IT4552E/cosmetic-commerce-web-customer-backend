import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class DiscountCodeAppliedUsers {
  @prop()
  user_id: Types.ObjectId;

  @prop()
  remaining: number;
}
