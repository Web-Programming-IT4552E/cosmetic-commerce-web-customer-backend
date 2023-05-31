import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class Category {
  /**
   * Category ID
   *
   * @example 628f229a74c31e32c7039ab6
   */
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  /**
   * Category name
   *
   * @example Bubble mask
   */
  @prop()
  name: string;

  /**
   * Category slug, generated from its name
   *
   * @example bubble-mask
   */
  @prop()
  slug: string;
}
