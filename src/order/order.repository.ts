import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import { Order } from './schemas/order.schema';
import { OrderProduct } from './schemas/order-product.schema';

@Injectable()
export class OrderRepository {
  constructor(
    @Inject(Order) private readonly orderModel: ReturnModelType<typeof Order>,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    products: OrderProduct[],
    totalProductCost: number,
  ) {
    return this.orderModel.create({
      ...createOrderDto,
      order_id: (await this.orderModel.estimatedDocumentCount()) + 1,
      products,
      status: OrderStatus.NEW,
      total_product_cost: totalProductCost,
    });
  }
}
