import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EMAIL_QUEUE } from './constants/mail.constant';
import {
  CREATE_NEW_CUSTOMER_ACCOUNT_VERIFIFICATION,
  CREATED_NEW_ORDER_NOTIFICATION,
} from './constants/queueName.constant';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);

  constructor(@InjectQueue(EMAIL_QUEUE) private readonly mailQueue: Queue) {}

  public async sendNewOrderCreatedEmail(
    customer_email: string,
    createdOrder: any,
  ): Promise<void> {
    try {
      await this.mailQueue.add(CREATED_NEW_ORDER_NOTIFICATION, {
        emailAddress: customer_email,
        createdOrder,
      });
    } catch (error) {
      this._logger.error(
        `Error queueing CREATED_ORDER_NOTIFICATION email to user ${customer_email}`,
      );

      throw error;
    }
  }

  public async sendNewAccountCreatedEmail(
    customer_email: string,
    customer_fullname: string,
    redirect_link: string,
  ): Promise<void> {
    try {
      await this.mailQueue.add(CREATE_NEW_CUSTOMER_ACCOUNT_VERIFIFICATION, {
        customer_email,
        customer_fullname,
        redirect_link,
      });
    } catch (error) {
      this._logger.error(
        `Error queueing registration email to user ${customer_email}`,
      );

      throw error;
    }
  }
}
