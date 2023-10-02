declare const forgotPasswordTemplate: ({ recipient, subject, data, }: {
    recipient: string;
    subject: string;
    data: {
        token: string;
    };
}) => {
    recipient: string;
    subject: string;
    body: string;
};
export { forgotPasswordTemplate };
