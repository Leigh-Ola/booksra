import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');
// get node env
const nodeEnv = process.env.NODE_ENV || 'development';
const { EMAIL_SENDER_PASSWORD, EMAIL_SENDER_USERNAME } = process.env;

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
    console.log(nodemailer);
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
        console.log(info);
        console.log('YAY!');
        console.log(info.response);
        resolve('Email sent successfully');
      }
    });
  });
};
const sendMail = async function () {
  // sendMailInProd({
  //   recipient: 'leolaotan@gmail.com',
  //   subject: 'Thank you for working out with us',
  //   body: 'This is a test email.<br/><br/><br/>Thanks,<br/>Books Roundabout.<br/><br/><br/><p style="color: red;">You are the best</p>',
  // })
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

export { sendMail };
