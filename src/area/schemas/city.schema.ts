import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class City {
  /**
   * MongoDB internal ID
   *
   * @example 62568055cb73aabcd516a9b7
   */
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  /**
   * City (province) code
   *
   * @example 01
   */
  @prop({ index: true })
  code: string;

  /**
   * City (province) name
   *
   * @example Thành phố Hà Nội
   */
  @prop()
  name: string;

  /**
   * Country code where this city (province) belongs to
   *
   * @example VN
   */
  @prop({ index: true })
  country_code: string;

  /**
   * Mongoose's internal versionKey property, excluded in query result
   *
   * @see https://mongoosejs.com/docs/guide.html#versionKey
   */
  @ApiHideProperty()
  @prop({ select: false })
  __v?: number;
}
