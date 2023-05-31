import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class Ward {
  /**
   * MongoDB internal ID
   *
   * @example 628d1b820475c054db379cf9
   */
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  /**
   * Ward code
   *
   * @example 00001
   */
  @prop({ index: true })
  code: string;

  /**
   * Ward name
   *
   * @example Phường Phúc Xá
   */
  @prop()
  name: string;

  /**
   * District code where this city (province) belongs to
   *
   * @example 001
   */
  @prop({ index: true })
  district_code: string;

  /**
   * Mongoose's internal versionKey property, excluded in query result
   *
   * @see https://mongoosejs.com/docs/guide.html#versionKey
   */
  @ApiHideProperty()
  @prop({ select: false })
  __v?: number;
}
