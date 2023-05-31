/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class moreQueryDto {
  @ApiProperty({
    description: 'number of page',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  public field1: number = 1;

  @ApiProperty({
    description: 'number of items per page',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  public field2: number = 1;
}
