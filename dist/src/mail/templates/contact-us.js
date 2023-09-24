"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUsTemplate = void 0;
const contactUsTemplate = ({ recipient, subject, data, }) => {
    const html = `
    <div style="font-family: sans-serif; text-align: center;">
        <p style="color: #4a4a4a;"><b>Name:</b> ${data.name}</p>
        <p style="color: #4a4a4a;"><b>Email:</b> ${data.email}</p>
        ${data.company
        ? `<p style="color: #4a4a4a;"><b>Company:</b> ${data.company}</p>`
        : '<center><small><i>Company not provided</i></small></center>'}
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
exports.contactUsTemplate = contactUsTemplate;
//# sourceMappingURL=contact-us.js.map