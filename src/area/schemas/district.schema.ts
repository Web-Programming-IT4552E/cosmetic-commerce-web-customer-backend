import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class District {
  /**
   * MongoDB internal ID
   *
   * @example 62568055cb73aabcd516ac3d
   */
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  /**
   * District code
   *
   * @example 001
   */
  @prop({ index: true })
  code: string;

  /**
   * District name
   *
   * @example Quận Ba Đình
   */
  @prop()
  name: string;

  /**
   * City (province) code where this city (province) belongs to
   *
   * @example 01
   */
  @prop({ index: true })
  city_code: string;

  /**
   * Mongoose's internal versionKey property, excluded in query result
   *
   * @see https://mongoosejs.com/docs/guide.html#versionKey
   */
  @ApiHideProperty()
  @prop({ select: false })
  __v?: number;
}
