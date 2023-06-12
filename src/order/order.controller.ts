import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtDecodedData, Public } from 'src/common/decorators/auth.decorator';
import { JwtPayload } from 'src/auth/dtos/jwt-payload.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { LoyalCustomerCreateOrderDto } from './dtos/loyalCustomerCreateOrder.dto';
import { GetListOrderQuery } from './dtos/getListOrderQuery.dto';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBadRequestResponse({
    description: 'Invalid body, check error for more info',
  })
  @Public()
  @Post('/public')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const { products } = createOrderDto;
      const set = new Set<string>(
        products.map((product) => product.product_id),
      );
      if (set.size < products.length)
        throw new BadRequestException('Item duplication detected.');

      return this.orderService.createOrder(createOrderDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @ApiOperation({
    description: 'create Orders for loyal customer',
  })
  @ApiBearerAuth()
  @Post('/loyal')
  async loyalCustomerCreateOrder(
    @Body()
    loyalCustomerCreateOrderDto: LoyalCustomerCreateOrderDto,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    return this.orderService.loyalCustomerCreateOrder(
      jwtPayload.userId,
      jwtPayload.email,
      loyalCustomerCreateOrderDto,
    );
  }

  @ApiOperation({
    description: 'list order of current customer',
  })
  @ApiBearerAuth()
  @Get('')
  async getListOrder(
    @Query() getListOrderQuery: GetListOrderQuery,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    return this.orderService.getListOrder(getListOrderQuery, jwtPayload.email);
  }

  @ApiOperation({
    description: 'get detail order by id of current customer',
  })
  @ApiBearerAuth()
  @Get('/:id')
  async getDetailOrder(
    @Param('id') order_id: string,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    return this.orderService.getDetailOfAnOrder(order_id, jwtPayload.email);
  }
}
