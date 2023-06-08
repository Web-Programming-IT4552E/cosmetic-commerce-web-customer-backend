import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';
import { EMAIL_QUEUE } from './constants/mail.constant';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_HOST'),
          port: +configService.get('EMAIL_PORT'),
          auth: {
            user: configService.get('EMAIL_ADDRESS'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
          tls: { rejectUnauthorized: false },
        },
        defaults: { from: `"EcomShop" <configService.get('EMAIL_ADDRESS')>` },
        template: {
          dir: `${__dirname}/templates`,
          options: { strict: true },
        },
      }),
    }),
    BullModule.registerQueueAsync({
      name: EMAIL_QUEUE,
      useFactory: (configService: ConfigService) => ({
        // TODO : can replace this by developing a middleware to automate prepend a prefix to all logs to Redis
        name: `${configService.get<string>('APP_NAME')}:${EMAIL_QUEUE}`,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailProcessor, MailService],
  exports: [MailService],
})
export class MailModule {}
