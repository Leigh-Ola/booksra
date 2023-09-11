const forgotPasswordTemplate = ({
  recipient,
  subject,
  data,
}: {
  recipient: string;
  subject: string;
  data: {
    token: string;
  };
}) => {
  const html = `
    <div style="text-align: center;">
      <h1>Books Roundabout</h1>
      <p>
        You have requested to change your password.
        Please use the token below to change your password.
      </p>
      <h1 style="font-size: 50px; font-weight: bold; letter-spacing: 4px;">${data.token}</h1>
      <p>
        This token expires in 15 minutes.
        If you did not request this, please ignore this email.
      </p>
    </div>
  `;
  return {
    recipient,
    subject,
    body: html,
  };
};

export { forgotPasswordTemplate };
