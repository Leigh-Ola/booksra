import { Injectable } from '@nestjs/common';
import { EntityManager, DataSource } from 'typeorm';
import { ContactMessageDto, UpdateMessageDto } from './dto/misc-dto';
import { Email } from './email.entity';
import { Message } from './message.entity';
import { throwBadRequest } from '../utils/helpers';
import { contactUsTemplate } from '../mail/templates/contact-us';
import { sendMail } from '../mail/mail.service';
import { MessageTypesEnum } from '../utils/types';

@Injectable()
export class MiscService {
  manager: EntityManager;
  constructor(private dbSource: DataSource) {
    this.manager = this.dbSource.manager;
  }

  // send Email
  async sendEmail(ip: string, body: ContactMessageDto) {
    const lastEmail = await this.manager.findOne(Email, {
      where: { ip },
      order: { createdAt: 'DESC' },
    });
    const { SITE_ADMIN_EMAIL, EMAIL_MIN_INTERVAL, NODE_ENV } = process.env;
    if (lastEmail) {
      // in prod, you cant send an email more than once every 5 minutes
      // in other envs, you cant send an email more than once every 1 minute
      const emailMinInterval =
        NODE_ENV === 'production' ? Number(EMAIL_MIN_INTERVAL) : 1;
      const lastEmailTime = lastEmail.updatedAt;
      const now = new Date();
      const timeDiff = now.getTime() - lastEmailTime.getTime();
      const minutesPassed = Math.floor(timeDiff / 1000 / 60);
      if (minutesPassed < emailMinInterval) {
        return throwBadRequest(
          `You have sent an email recently. Please wait ${emailMinInterval} minute(s) before sending another email.`,
        );
      }
    }
    // create a new email
    const email = new Email();
    email.ip = ip;
    email.name = body.name;
    email.email = body.email;
    email.message = body.message;
    if (body.company) {
      email.company = body.company;
    }
    await this.manager.save(email);
    // send email
    const template = contactUsTemplate({
      recipient: SITE_ADMIN_EMAIL,
      subject: 'A customer just sent you a message on your website',
      data: {
        name: body.name,
        email: body.email,
        message: body.message,
        company: body.company || '',
      },
    });
    sendMail(template).catch((err) => {
      console.log(err);
    });
    return;
  }

  async updateMessage(body: UpdateMessageDto) {
    let message = await this.manager.findOne(Message, {
      where: { type: body.type },
    });
    if (!message) {
      message = new Message();
      message.type = body.type;
    }
    message.message = body.message;
    const savedMessage = await this.manager.save(message);
    console.log(savedMessage);
  }

  async getMessage(type: MessageTypesEnum) {
    const message = await this.manager.findOne(Message, {
      where: { type },
    });
    return message;
  }
}
