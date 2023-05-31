import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class Country {
  /**
   * MongoDB internal ID
   *
   * @example 625650407905c3bd516f5a4b
   */
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  /**
   * Country ISO 3166-1 alpha-2 code
   *
   * @example VN
   * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  @prop({ index: true })
  code: string;

  /**
   * Country name
   *
   * @example Việt Nam
   */
  @prop()
  name: string;

  /**
   * Country name, in English
   *
   * @example Vietnam
   */
  @prop()
  en_name: string;

  /**
   * Mongoose's internal versionKey property, excluded in query result
   *
   * @see https://mongoosejs.com/docs/guide.html#versionKey
   */
  @ApiHideProperty()
  @prop({ select: false })
  __v?: number;
}
