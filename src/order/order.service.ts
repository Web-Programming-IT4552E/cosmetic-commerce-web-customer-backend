/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { BadRequestException, Injectable } from '@nestjs/common';
import { DiscountCodeService } from 'src/discount_code/discount_code.service';
import { AreaService } from '../area/area.service';
import { ProductService } from '../product/product.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderRepository } from './order.repository';
import { OrderProduct } from './schemas/order-product.schema';
import { MailService } from '../mailer/mail.service';
import { LoyalCustomerCreateOrderDto } from './dtos/loyalCustomerCreateOrder.dto';
import { CreateOrderProduct } from './dtos/create-order-product.dto';
import { GetListOrderQuery } from './dtos/getListOrderQuery.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly areaService: AreaService,
    private readonly productService: ProductService,
    private readonly mailService: MailService,
    private readonly discountCodeService: DiscountCodeService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { products, customer_email } = createOrderDto;

    const { productList, quantitySet, totalCost } =
      await this.getTotalProductOrderCost(products);

    const createdOrder = await this.orderRepository.createOrder(
      createOrderDto,
      productList.map<OrderProduct>((product) => {
        const productId = product._id.toHexString();
        return {
          product_id: productId,
          name: product.name,
          price: product.price,
          quantity: quantitySet[productId],
          image: product.image,
        };
      }),
      totalCost,
    );
    await this.mailService.sendNewOrderCreatedEmail(
      customer_email,
      createdOrder,
    );
  }

  async loyalCustomerCreateOrder(
    user_id: string,
    customer_email: string,
    createOrderDto: LoyalCustomerCreateOrderDto,
  ) {
    const { products } = createOrderDto;

    const { productList, quantitySet, totalCost } =
      await this.getTotalProductOrderCost(products);
    let discount_amount = '0';
    if (createOrderDto.discount_code)
      discount_amount = await this.discountCodeService.applyingDiscountOnOrder(
        createOrderDto.discount_code,
        user_id,
        { total_product_cost: totalCost },
      );
    const createdOrder =
      await this.orderRepository.createOrderWithDiscountAndUserId(
        {
          ...createOrderDto,
          customer_email,
        },
        user_id,
        productList.map<OrderProduct>((product) => {
          const productId = product._id.toHexString();
          return {
            product_id: productId,
            name: product.name,
            price: product.price,
            quantity: quantitySet[productId],
            image: product.image,
          };
        }),
        totalCost,
        Number(discount_amount),
      );
    await this.mailService.sendNewOrderCreatedEmail(
      customer_email,
      createdOrder,
    );
  }

  private async getTotalProductOrderCost(products: CreateOrderProduct[]) {
    const productList = await this.productService.getProductsByIdList(
      products.map((product) => product.product_id),
    );
    if (!productList.length)
      throw new BadRequestException('No valid products specified.');
    const productSet = Object.fromEntries(
      productList.map((product) => [product._id.toString(), product]),
    );
    const quantitySet = Object.fromEntries(
      products.map((orderedProduct) => [
        orderedProduct.product_id,
        orderedProduct.quantity,
      ]),
    );
    let totalCost = 0;
    for (const orderedProduct of products) {
      const product = productSet[orderedProduct.product_id.toString()];
      if (product.stock < orderedProduct.quantity)
        throw new BadRequestException(
          `Not enough stock for item: ${product.name}`,
        );
      await this.productService.findAndUpdateProductStockById(
        orderedProduct.product_id.toString(),
        orderedProduct.quantity,
      );
      totalCost +=
        productSet[orderedProduct.product_id.toString()].price *
        orderedProduct.quantity;
    }
    return {
      totalCost,
      quantitySet,
      productList,
    };
  }

  async getListOrder(
    getListOrderQuery: GetListOrderQuery,
    customer_email: string,
  ) {
    const { page, limit, status } = { ...getListOrderQuery };
    const query = {
      customer_email,
    };
    if (status) {
      Object.assign(query, {
        status: { $in: status.split(',').map((x) => +x) },
      });
    }
    const data = await this.orderRepository.getOrderList(query, page, limit);
    const total = await this.orderRepository.countNumberOfOrderWithQuery(query);
    return {
      paginationInfo: {
        page,
        limit,
        total,
      },
      data,
    };
  }

  async getDetailOfAnOrder(order_id: string, customer_email: string) {
    const query = {
      customer_email,
      _id: order_id,
    };
    return this.orderRepository.findOneOrder(query);
  }
}
