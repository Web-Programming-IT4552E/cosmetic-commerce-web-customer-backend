import { BadRequestException, Injectable } from '@nestjs/common';
import { AreaService } from '../area/area.service';
import { ProductService } from '../product/product.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderRepository } from './order.repository';
import { OrderProduct } from './schemas/order-product.schema';
import { MailService } from '../mailer/mail.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly areaService: AreaService,
    private readonly productService: ProductService,
    private readonly mailService: MailService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { products, customer_email, city, district, ward } = createOrderDto;

    const productList = await this.productService.getProductsByIdList(
      products.map((product) => product.product_id),
    );
    if (!productList.length)
      throw new BadRequestException('No valid products specified.');
    const productSet = Object.fromEntries(
      productList.map((product) => [product._id.toHexString(), product]),
    );
    const quantitySet = Object.fromEntries(
      products.map((orderedProduct) => [
        orderedProduct.product_id,
        orderedProduct.quantity,
      ]),
    );
    let totalCost = 0;
    products.forEach((orderedProduct) => {
      const product = productSet[orderedProduct.product_id];
      if (product.stock < orderedProduct.quantity)
        throw new BadRequestException(
          `Not enough stock for item: ${product.name}`,
        );
      totalCost +=
        productSet[orderedProduct.product_id].price * orderedProduct.quantity;
    });

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
      city,
      district,
      ward,
      totalCost,
    );
    await this.mailService.sendNewOrderCreatedEmail(customer_email, createdOrder);
  }
}
