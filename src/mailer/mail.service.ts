import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EMAIL_QUEUE } from './constants/mail.constant';
import {
  ACCOUNT_VERIFICATION_SUCCESS,
  CREATE_NEW_CUSTOMER_ACCOUNT_VERIFIFICATION,
  CREATED_NEW_ORDER_NOTIFICATION,
  RESET_PASSWORD_VERIFICATION,
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
        `Error queueing CREATE_NEW_CUSTOMER_ACCOUNT_VERIFIFICATION email to user ${customer_email}`,
      );

      throw error;
    }
  }

  public async sendAccountVerificationSuccessEmail(
    customer_email: string,
    customer_fullname: string,
  ): Promise<void> {
    try {
      await this.mailQueue.add(ACCOUNT_VERIFICATION_SUCCESS, {
        customer_email,
        customer_fullname,
      });
    } catch (error) {
      this._logger.error(
        `Error queueing ACCOUNT_VERIFICATION_SUCCESS email to user ${customer_email}`,
      );

      throw error;
    }
  }

  public async sendResetPasswordEmail(
    customer_email: string,
    customer_fullname: string,
    verify_token_site: string,
  ): Promise<void> {
    try {
      await this.mailQueue.add(RESET_PASSWORD_VERIFICATION, {
        customer_email,
        customer_fullname,
        verify_token_site,
      });
    } catch (error) {
      this._logger.error(
        `Error queueing RESET_PASSWORD_VERIFICATION email to user ${customer_email}`,
      );

      throw error;
    }
  }
}
