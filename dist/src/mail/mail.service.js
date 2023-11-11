"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const axios_1 = require("axios");
const nodeEnv = process.env.NODE_ENV || 'development';
const sendMailInDev = async function ({ recipient, subject, body, }) {
    return new Promise(async (resolve, reject) => {
        console.log(`Sending email to '${recipient}' in dev/staging env...`);
        const apikey = process.env.ELASTIC_EMAIL_HTTP_PASSWORD;
        const baseurl = 'https://api.elasticemail.com';
        const path = '/v2/email/send';
        const url = `${baseurl}${path}`;
        const data = {
            to: recipient,
            bodyHtml: body,
            subject: subject,
            apikey: apikey,
            from: 'noreply@booksra.helioho.st',
            senderName: 'Books Roundabout',
        };
        await axios_1.default
            .get(url, { params: data })
            .then((res) => {
            const success = res?.data?.success || false;
            if (!success) {
                console.log(res.data);
                reject('An error occured while sending email');
            }
            else {
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
const sendMailInProduction = sendMailInDev;
const sendMail = async function ({ recipient, subject, body, }) {
    return new Promise(async (resolve, reject) => {
        if (nodeEnv === 'staging') {
            sendMailInStaging({ recipient, subject, body })
                .then(() => {
                resolve('Sent email successfully');
            })
                .catch((err) => {
                reject(`Error sending email: ${err}`);
            });
        }
        else if (nodeEnv === 'development') {
            sendMailInDev({ recipient, subject, body })
                .then(() => {
                resolve('Sent email successfully');
            })
                .catch((err) => {
                reject(`Error sending email: ${err}`);
            });
        }
        else if (nodeEnv === 'production') {
            sendMailInProduction({ recipient, subject, body })
                .then(() => {
                resolve('Sent email successfully');
            })
                .catch((err) => {
                reject(`Error sending email: ${err}`);
            });
        }
        else {
            reject('Email cannot be sent. Unknown environment.');
        }
    });
};
exports.sendMail = sendMail;
//# sourceMappingURL=mail.service.js.map