const purchaseCompleteTemplate = (
  {
    recipient,
    subject,
    data,
  }: {
    recipient: string;
    subject: string;
    data: {
      items: { name: string; code: string; quantity: number | string }[];
      notes: string;
      userName: string;
      userEmail: string;
      userPhoneNumber: string | number | null;
      userAddress?: string | null;
      isDelivery: boolean;
      deliveryLocation?: string | null;
      basePrice: number | string;
      paidPrice: number | string;
      isDiscountApplied: boolean;
    };
  },
  isForUser: boolean,
) => {
  const htmlForUser = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <center><h2 style="color: #4CAF50;">Booksroundabout Purchase Confirmation</h2></center>
        <p>Dear ${data.userName || 'Customer'},</p>
        <p>Thank you for your purchase. Here are the details of your purchase:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item Name</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item Code</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item Quantity</th>
          </tr>
          ${data.items
            .map(
              (item) => `
            <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              item.name || '<center>-</center>'
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.code}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              item.quantity
            }</td>
            </tr>
          `,
            )
            .join('')}
        </table>
        <p><strong>Notes:</strong> ${data.notes || '<i>No Notes</i>'}</p>
        <br/>
        <p>
          <strong>User Information:</strong>
          <ul>
            <li>Name: ${data.userName || '<i>Not Provided</i>'}</li>
            <li>Number: ${data.userPhoneNumber || '<i>Not Provided</i>'}</li>
            <li>Email: ${data.userEmail}</li>
          </ul>
        </p>
        ${
          data.isDelivery
            ? `
          <br/>
          <p>
            <strong>Delivery Information:</strong>
            <br/>
            <div style="padding-left:10px;">
            Location: ${data.deliveryLocation}</p>
            </div>
        `
            : ''
        }
        <br/>
        <p>
          <strong>Pricing Details:</strong>
          <ul>
            <li>Base Price: ${Number(data.basePrice).toFixed(2)}</li>
            <li>Paid Price: ${Number(data.paidPrice).toFixed(2)}</li>
            <li>Discount Applied: ${data.isDiscountApplied ? 'Yes' : 'No'}</li>
          </ul>
        </p>
        <br/>
        <hr/>
        <p>
          <strong><center>DISCLAIMER.</center></strong>
          <p>
            Starting from the date of purchase, you have a grace period of <b>one week</b> to pick up your books. However, please note that after this first week, for every day you delay, a fee of <b>500 Naira</b> will be charged.
            <br/>
            Furthermore, we would like to bring to your attention that we cannot guarantee the availability of the books after 2 weeks of not picking them up. This is due to our commitment to ensuring a wide variety of books are available to all our customers.
            <br/>
            We understand that circumstances can sometimes prevent timely pickup, and we appreciate your understanding of our need to implement these policies to better serve all of our customers.
          </p>
          <strong>Thank you for your patronage.</strong>
        </p>
      </div>
    `;
  const htmlForAdmin = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <center><h2 style="color: #4CAF50;">Booksroundabout Purchase Confirmation</h2></center>
        <p>Dear Admin,</p>
        <p>A purchase has just been confirmed on your website. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item Name</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item Code</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item Quantity</th>
          </tr>
          ${data.items
            .map(
              (item) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                item.name || '<center>-</center>'
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                item.code
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                item.quantity
              }</td>
            </tr>
          `,
            )
            .join('')}
        </table>
        <p><strong>Notes:</strong> ${data.notes || '<i>No Notes</i>'}</p>
        <br/>
        <p>
          <strong>User Information:</strong>
          <ul>
            <li>Name: ${data.userName || '<i>Not Provided</i>'}</li>
            <li>Number: ${data.userPhoneNumber || '<i>Not Provided</i>'}</li>
            <li>Email: ${data.userEmail}</li>
            ${data.userAddress ? `<li>Address: ${data.userAddress}</li>` : ''}
          </ul>
        </p>
        ${
          data.isDelivery
            ? `
          <br/>
          <p>
            <strong>Delivery Information:</strong>
            <br/>
            <div style="padding-left:10px;">
            Location: ${data.deliveryLocation}</p>
            </div>
        `
            : ''
        }
        <br/>
        <p>
          <strong>Pricing Details:</strong>
          <ul>
            <li>Base Price: ${Number(data.basePrice).toFixed(2)}</li>
            <li>Paid Price: ${Number(data.paidPrice).toFixed(2)}</li>
            <li>Discount Applied: ${data.isDiscountApplied ? 'Yes' : 'No'}</li>
          </ul>
        </p>
      </div>
    `;
  return {
    recipient,
    subject,
    body: isForUser ? htmlForUser : htmlForAdmin,
  };
};

export { purchaseCompleteTemplate };
