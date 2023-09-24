const contactUsTemplate = ({
  recipient,
  subject,
  data,
}: {
  recipient: string;
  subject: string;
  data: {
    email: string;
    name: string;
    message: string;
    company?: string;
  };
}) => {
  const html = `
    <div style="font-family: sans-serif; text-align: center;">
        <p style="color: #4a4a4a;"><b>Name:</b> ${data.name}</p>
        <p style="color: #4a4a4a;"><b>Email:</b> ${data.email}</p>
        ${
          data.company
            ? `<p style="color: #4a4a4a;"><b>Company:</b> ${data.company}</p>`
            : '<center><small><i>Company not provided</i></small></center>'
        }
        </hr>
        <p style="color: #4a4a4a;">${data.message}</p>
    </div>
        `;
  return {
    recipient,
    subject,
    body: html,
  };
};

export { contactUsTemplate };
