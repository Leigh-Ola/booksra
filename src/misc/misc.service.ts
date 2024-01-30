import { Injectable } from '@nestjs/common';
import { EntityManager, DataSource } from 'typeorm';
import { ContactMessageDto, UpdateDataDto } from './dto/misc-dto';
import { Email } from './email.entity';
import { Data } from './data.entity';
import { throwBadRequest } from '../utils/helpers';
import { contactUsTemplate } from '../mail/templates/contact-us';
import { sendMail } from '../mail/mail.service';
import {
  MessageTypesEnum,
  EmailTypeEnum,
  EmailStatusEnum,
  ImageTypes,
  BooleanMessageTypesEnum,
} from '../utils/types';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const { AWS_KEY, AWS_SECRET, AWS_BUCKET_NAME } = process.env;

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
    // create a new email template
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
    // create a new email record
    const email = new Email();
    email.ip = ip;
    email.type = EmailTypeEnum.CONTACT_US;
    email.data = {
      recipient: template.recipient,
      subject: template.subject,
      body: template.body,
    };
    // send the email
    if (NODE_ENV !== 'production') {
      console.log(
        "Sending contact email immediately because we're in dev mode.",
      );
      email.status = EmailStatusEnum.SUCCESS;
      sendMail(template).catch((err) => {
        console.log(err);
      });
    }
    // save the email record
    await this.manager.save(email);
    return;
  }

  // update data
  async saveData(body: UpdateDataDto) {
    let data = await this.manager.findOne(Data, {
      where: { type: body.type },
    });
    if (!data) {
      data = new Data();
      data.type = body.type;
    }
    if (
      Object.values(BooleanMessageTypesEnum).includes(
        data.type as unknown as BooleanMessageTypesEnum,
      )
    ) {
      body.data = String(body.data).toLowerCase().trim();
      if (!['true', 'false'].includes(body.data)) {
        throwBadRequest(
          `Data must be either 'true' or 'false' when the data type is "${data.type}"`,
        );
      } else {
        data.isBoolean = true;
      }
    } else {
      data.isBoolean = false;
    }
    data.data = body.data;
    await this.manager.save(data);
  }

  // get data
  async getData(type: MessageTypesEnum) {
    let data = await this.manager.findOne(Data, {
      where: { type },
    });
    data && delete data.id;
    return data;
  }

  private renameFileWithTimestamp(name) {
    const date = new Date();
    const timestamp = date.getTime();
    const extension = name.split('.').pop();
    const nameStart = name
      .split('.')
      .slice(0, -1)
      .join('.')
      .replace(/\s+/g, '-');
    const newName = `${timestamp}-${nameStart}.${extension}`;
    return newName;
  }

  // upload image file to aws
  async uploadImage(file: any) {
    // ensure the mimetype is in ImageTypes
    if (!Object.values(ImageTypes).includes(file.mimetype)) {
      return throwBadRequest('Invalid file type');
    }
    const client = new S3Client({
      region: 'eu-west-3',
      credentials: {
        accessKeyId: AWS_KEY,
        secretAccessKey: AWS_SECRET,
      },
    });

    const newFileName = this.renameFileWithTimestamp(file.originalname);

    const command = new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: newFileName,
      Body: Buffer.from(file.buffer),
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    let response;
    await client
      .send(command)
      .then(() => {
        const url = `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${newFileName}`;
        response = {
          message: 'Upload Success',
          url,
        };
      })
      .catch((err) => {
        const errToShow = err && err.message ? err.message : err;
        console.log(err);
        throwBadRequest(errToShow);
      });
    return response;
  }
}
