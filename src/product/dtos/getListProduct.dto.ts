/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'number of page',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  public page: number = 1;

  @ApiProperty({
    description: 'number of items per page',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  public limit: number = 1;
}
