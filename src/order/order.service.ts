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
    const {
      products,
      customer_email,
      shipping_city_code,
      shipping_district_code,
      shipping_ward_code,
    } = createOrderDto;

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

    const city = await this.areaService.getCityByCode(shipping_city_code);
    const district = await this.areaService.getDistrictByCode(
      shipping_district_code,
    );
    const ward = await this.areaService.getWardByCode(shipping_ward_code);
    if (!city || !district || !ward)
      throw new BadRequestException('Invalid area.');

    if (
      city.code !== district.city_code ||
      district.code !== ward.district_code
    )
      throw new BadRequestException('Invalid area.');

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
      city.name,
      district.name,
      ward.name,
      totalCost,
    );
    await this.mailService.sendConfirmationEmail(customer_email, createdOrder);
  }
}
