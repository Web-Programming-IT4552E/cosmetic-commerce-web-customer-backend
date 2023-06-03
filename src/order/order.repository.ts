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
    city: string,
    district: string,
    ward: string,
    totalProductCost: number,
  ) {
    const { receiver_name, receiver_phone_number, shipping_address } =
      createOrderDto;

    return this.orderModel.create({
      ...createOrderDto,
      order_id: (await this.orderModel.estimatedDocumentCount()) + 1,
      products,
      shipping_address: {
        receiver_name,
        receiver_phone_number,
        city,
        district,
        ward,
        address: shipping_address,
      },
      status: OrderStatus.NEW,
      total_product_cost: totalProductCost,
    });
  }
}
