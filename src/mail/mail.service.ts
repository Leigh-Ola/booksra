// import axios
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');
// get node env
const nodeEnv = process.env.NODE_ENV || 'development';

const sendMailInDev = async function ({
  recipient,
  subject,
  body,
}: {
  recipient: string;
  subject: string;
  body: string;
}) {
  return new Promise(async (resolve, reject) => {
    // Using elastic email. Limit: 100 emails per day.
    console.log(`Sending email to '${recipient}' in dev/staging env...`);
    const apikey = process.env.ELASTIC_EMAIL_HTTP_PASSWORD;
    const baseurl = 'https://api.elasticemail.com';
    const path = '/v2/email/send';
    const url = `${baseurl}${path}`;

    const data = {
      to: recipient,
      // bodyText: 'This is a test email',
      bodyHtml: body,
      subject: subject,
      apikey: apikey,
      from: 'noreply@booksra.helioho.st',
      senderName: 'Books Roundabout',
    };

    await axios
      .get(url, { params: data })
      .then((res) => {
        const success = res?.data?.success || false;
        if (!success) {
          console.log(res.data);
          reject('An error occured while sending email');
        } else {
          console.log(res.data);
          resolve('Email sent successfully');
        }
      })
      .catch((err) => {
        console.log(err);
        reject('An error occured while initiating outgoing email');
      });
  });
};
const sendMailInProd = async function ({
  recipient,
  subject,
  body,
}: {
  recipient: string;
  subject: string;
  body: string;
}) {
  return new Promise(async (resolve, reject) => {
    const { EMAIL_SENDER_PASSWORD, EMAIL_SENDER_USERNAME } = process.env;
    const transport = nodemailer.createTransport({
      name: 'web-hosting.com',
      host: 'business105.web-hosting.com',
      port: 465, // 587,
      secure: true, // true for 465, false for other ports
      // ssl should be enabled
      auth: {
        user: EMAIL_SENDER_USERNAME,
        pass: EMAIL_SENDER_PASSWORD,
      },
      // tls: {
      //   rejectUnauthorized: true,
      // },
    });

    const mailOptions = {
      from: 'noreply@booksroundabout.com',
      to: recipient,
      subject: subject,
      html: body,
    };

    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        reject('An error occured while sending email');
      } else {
        // console.log(info.response);
        resolve('Email sent successfully');
      }
    });
  });
};

const sendMailInDevelopment = sendMailInDev;
const sendMailInStaging = sendMailInDev;
const sendMailInProduction = sendMailInProd;

const sendMail = async function ({
  recipient,
  subject,
  body,
}: {
  recipient: string;
  subject: string;
  body: string;
}) {
  return new Promise(async (resolve, reject) => {
    if (nodeEnv === 'staging') {
      sendMailInStaging({ recipient, subject, body })
        .then(() => {
          resolve('Sent email successfully');
        })
        .catch((err) => {
          reject(`Error sending email: ${err}`);
        });
    } else if (nodeEnv === 'development') {
      sendMailInDevelopment({ recipient, subject, body })
        .then(() => {
          resolve('Sent email successfully');
        })
        .catch((err) => {
          reject(`Error sending email: ${err}`);
        });
    } else if (nodeEnv === 'production') {
      sendMailInProduction({ recipient, subject, body })
        .then(() => {
          resolve('Sent email successfully');
        })
        .catch((err) => {
          reject(`Error sending email: ${err}`);
        });
    } else {
      reject('Email cannot be sent. Unknown environment.');
    }
  });
};

export { sendMail };
