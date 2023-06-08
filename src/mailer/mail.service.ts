import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EMAIL_QUEUE } from './mail.constant';
import { CREATE_ORDER_QUEUE } from './queueName.constant';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);

  constructor(@InjectQueue(EMAIL_QUEUE) private readonly mailQueue: Queue) {}

  public async sendNewOrderCreatedEmail(
    emailAddress: string,
    createdOrder: any,
  ): Promise<void> {
    try {
      await this.mailQueue.add(CREATE_ORDER_QUEUE, {
        emailAddress,
        createdOrder,
      });
    } catch (error) {
      this._logger.error(
        `Error queueing registration email to user ${emailAddress}`,
      );

      throw error;
    }
  }
}
