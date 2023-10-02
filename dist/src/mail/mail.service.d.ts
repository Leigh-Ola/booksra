declare const sendMail: ({ recipient, subject, body, }: {
    recipient: string;
    subject: string;
    body: string;
}) => Promise<unknown>;
export { sendMail };
