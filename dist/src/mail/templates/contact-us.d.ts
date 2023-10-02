declare const contactUsTemplate: ({ recipient, subject, data, }: {
    recipient: string;
    subject: string;
    data: {
        email: string;
        name: string;
        message: string;
        company?: string;
    };
}) => {
    recipient: string;
    subject: string;
    body: string;
};
export { contactUsTemplate };
