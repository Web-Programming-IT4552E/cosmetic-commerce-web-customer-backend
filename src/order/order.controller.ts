import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderService } from './order.service';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBadRequestResponse({
    description: 'Invalid body, check error for more info',
  })
  @Post('create')
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
}
