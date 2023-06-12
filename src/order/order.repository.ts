import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { FilterQuery } from 'mongoose';
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

  async createOrderWithDiscountAndUserId(
    createOrderDto: CreateOrderDto,
    user_id:string,
    products: OrderProduct[],
    totalProductCost: number,
    discount: number,
  ) {
    return this.orderModel.create({
      ...createOrderDto,
      user_id,
      order_id: (await this.orderModel.estimatedDocumentCount()) + 1,
      products,
      status: OrderStatus.NEW,
      total_product_cost: totalProductCost,
      discount,
    });
  }

  async countNumberOfOrderWithQuery(
    query: FilterQuery<Order>,
  ): Promise<number> {
    return this.orderModel.countDocuments(query);
  }

  async getOrderList(
    query: FilterQuery<Order>,
    page: number,
    limit: number,
  ): Promise<Order[]> {
    return this.orderModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();
  }

  async findOneOrder(query: FilterQuery<Order>): Promise<Order> {
    return this.orderModel.findOne(query).lean().exec();
  }
}
