/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/paginationQuery.dto';

export class getListProductsQueryDto extends PaginationQueryDto {
  @ApiProperty({
    name: 'name',
    description: 'filter with name of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;
}
