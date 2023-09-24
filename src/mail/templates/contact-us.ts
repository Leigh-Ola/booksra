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
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; color: #444;">
        <h2 style="color: #2F4F4F;">Contact Information</h2>
        <p><b>Name:</b> <span style="color: #696969;">${data.name}</span></p>
        <p><b>Email:</b> <span style="color: #696969;">${data.email}</span></p>
        ${
          data.company
            ? `<p><b>Company:</b> <span style="color: #696969;">${data.company}</span></p>`
            : '<p><small><i>Company not provided</i></small></p>'
        }
        <hr style="border-top: 1px solid #2F4F4F;">
        <h3 style="color: #2F4F4F;">Message</h3>
        <p style="text-align: left; color: #696969;">${data.message}</p>
    </div>
        `;
  return {
    recipient,
    subject,
    body: html,
  };
};

export { contactUsTemplate };
