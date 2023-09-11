// import axios
import axios from 'axios';
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
    console.log('Sending email in dev env...');
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

const sendMailInStaging = sendMailInDev;

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
      sendMailInDev({ recipient, subject, body })
        .then(() => {
          resolve('Sent email successfully');
        })
        .catch((err) => {
          reject(`Error sending email: ${err}`);
        });
    } else {
      //
      reject('Email cannot be sent.');
    }
  });
};

export { sendMail };
