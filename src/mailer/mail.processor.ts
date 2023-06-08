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
import { getOrderEmailTemplate } from './templates/template.generator';
import { EMAIL_QUEUE } from './mail.constant';
import { CREATE_ORDER_QUEUE } from './queueName.constant';

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

  @Process(CREATE_ORDER_QUEUE)
  public async confirmRegistration(
    job: Job<{ emailAddress: string; createdOrder: any }>,
  ): Promise<void> {
    this.logger.log(
      `Sending confirm registration email to '${job.data.emailAddress}'`,
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
        `Failed to send confirmation email to '${job.data.emailAddress}'`,
      );
    }
  }
}
