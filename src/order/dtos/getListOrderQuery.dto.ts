import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/paginationQuery.dto';

export class GetListOrderQuery extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: `status string in the format : ?status = "1,2"`,
  })
  @IsOptional()
  @IsString()
  status: string;
}
