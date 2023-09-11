import axios from 'axios';
// get node env
const nodeEnv = process.env.NODE_ENV || 'development';

const sendMail = async function () {
  //   return new Promise(async (resolve, reject) => {
  //     // Using elastic email. Limit: 100 emails per day.
  //     console.log('Email test...');
  //     const apikey = process.env.ELASTIC_EMAIL_HTTP_PASSWORD;
  //     const baseurl = 'https://api.elasticemail.com';
  //     const path = '/v2/email/status';
  //     const url = `${baseurl}${path}`;
  //     const data = {
  //       apikey: apikey,
  //       messageID: 'KYNFsvQrM-Mq8Ca5QOt0Zw2',
  //     };
  //     /**
  //  * data: {
  //     transactionid: '9b171167-2b55-4130-8067-8a765118238e',
  //     messageid: 'KYNFsvQrM-Mq8Ca5QOt0Zw2'
  //   }
  //  */
  //     await axios
  //       .get(url, { params: data })
  //       .then((res) => {
  //         const success = res?.data?.success || false;
  //         if (!success) {
  //           console.log(res.data);
  //           reject('An error occured while sending email');
  //         } else {
  //           console.log(res.data);
  //           resolve('Email sent successfully');
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         reject('An error occured while initiating outgoing email');
  //       });
  //   });
};

export { sendMail };
