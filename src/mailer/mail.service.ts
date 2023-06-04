import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EMAIL_QUEUE } from './mail.constant';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);

  constructor(@InjectQueue(EMAIL_QUEUE) private readonly mailQueue: Queue) {}

  public async sendConfirmationEmail(
    emailAddress: string,
    createdOrder: any,
  ): Promise<void> {
    try {
      await this.mailQueue.add('CONFIRM_REGISTRATION', {
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
