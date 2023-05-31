import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Category } from '../../category/category.schema';
import { getEnumValues } from '../../utils/enum-utils';
import { ProductStatus } from '../enums/product-status.enum';

export class Product {
  /**
   * Product ID
   *
   * @example 6280c1a3e549df4140f20356
   */
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  /**
   * Product name
   *
   * @example Gentleman Eau de Parfum Boisée Givenchy
   */
  @prop()
  name: string;

  /**
   * Product price
   *
   * @example 20
   */
  @prop()
  price: number;

  /**
   * Product category ID, use "Get all categories" method to get details
   *
   * @example 62809a7ba59bca48f8f34722
   */
  @ApiProperty({ type: String })
  @prop({ type: Types.ObjectId, ref: () => Category })
  category: Ref<Category>[];

  /**
   * Product status:
   *
   * 0: In stock
   *
   * 1: Temporarily out of stock
   *
   * 2: No longer available
   *
   * @example 0
   */
  @ApiProperty({ type: ProductStatus, enum: getEnumValues(ProductStatus) })
  @prop({ enum: getEnumValues(ProductStatus) })
  status: ProductStatus;

  /**
   * Width of product
   *
   * @example 3
   */
  @prop()
  width: number;

  /**
   * Height of product
   *
   * @example 4
   */
  @prop()
  height: number;

  /**
   * Weight of product
   *
   * @example 4
   */
  @prop()
  mass: number;

  /**
   * Product description
   *
   * @example Brief product description here
   */
  @prop()
  description: string;

  /**
   * Product stock
   *
   * @example 12
   */
  @prop()
  stock: number;

  /**
   * Product image URL
   *
   * @example https://fimgs.net/mdimg/perfume/375x500.59009.jpg
   */
  @prop()
  image: string;

  /**
   * Mongoose's internal versionKey property, excluded in query result
   *
   * @see https://mongoosejs.com/docs/guide.html#versionKey
   */
  @ApiHideProperty()
  @prop({ select: false })
  __v?: number;
}
