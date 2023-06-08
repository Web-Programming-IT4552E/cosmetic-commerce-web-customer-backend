import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { getOrderEmailTemplate } from './templates/createdOrder.template.generator';
import { EMAIL_QUEUE } from './constants/mail.constant';
import {
  CREATED_NEW_ORDER_NOTIFICATION,
  CREATE_NEW_CUSTOMER_ACCOUNT_VERIFIFICATION,
} from './constants/queueName.constant';
import { generateRegisterTemple } from './templates/registerAccount.template.html';

@Injectable()
@Processor(EMAIL_QUEUE)
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @OnQueueActive()
  public onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(CREATED_NEW_ORDER_NOTIFICATION)
  public async notifyOrderCreated(
    job: Job<{ emailAddress: string; createdOrder: any }>,
  ): Promise<void> {
    this.logger.log(
      `Sending CREATED_NEW_ORDER_NOTIFICATION email to '${job.data.emailAddress}'`,
    );
    const template = getOrderEmailTemplate(job.data.createdOrder);
    try {
      await this.mailerService.sendMail({
        to: job.data.emailAddress,
        from: this.configService.get('EMAIL_ADDRESS'),
        subject: 'Create Order Notification',
        html: template,
      });
    } catch (e) {
      this.logger.error(e.message);
      this.logger.error(
        `Failed to send CREATED_NEW_ORDER_NOTIFICATION email to '${job.data.emailAddress}'`,
      );
    }
  }

  @Process(CREATE_NEW_CUSTOMER_ACCOUNT_VERIFIFICATION)
  public async confirmRegistration(
    job: Job<{
      customer_email: string;
      customer_fullname: string;
      redirect_link: string;
    }>,
  ) {
    const { customer_email, customer_fullname, redirect_link } = {
      ...job.data,
    };
    this.logger.log(
      `Sending confirm CREATE_NEW_CUSTOMER_ACCOUNT_VERIFIFICATION email to '${job.data.customer_email}'`,
    );
    const template = generateRegisterTemple(
      customer_email,
      customer_fullname,
      redirect_link,
    );
    try {
      await this.mailerService.sendMail({
        to: job.data.customer_email,
        from: this.configService.get('EMAIL_ADDRESS'),
        subject: 'Create Account Verrification',
        html: template,
      });
    } catch (e) {
      this.logger.error(e.message);
      this.logger.error(
        `Failed to send CREATE_NEW_CUSTOMER_ACCOUNT_VERIFIFICATION email to '${customer_email}'`,
      );
    }
  }
}
