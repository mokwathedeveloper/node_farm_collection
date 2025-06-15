const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOrderConfirmation = async (order, isGuest = false) => {
  const { shippingInfo, items, total, _id, trackingNumber } = order;
  const recipient = isGuest ? shippingInfo.email : order.user.email;

  const itemsList = items.map(item => `
    <tr>
      <td>${item.product.name}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order!</p>
    <p>Order ID: ${_id}</p>
    ${trackingNumber ? `<p>Tracking Number: ${trackingNumber}</p>` : ''}
    
    <h2>Order Details:</h2>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsList}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" align="right"><strong>Total:</strong></td>
          <td>$${total.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>

    <h2>Shipping Information:</h2>
    <p>
      ${shippingInfo.firstName} ${shippingInfo.lastName}<br>
      ${shippingInfo.street}<br>
      ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.postalCode}<br>
      ${shippingInfo.country}
    </p>

    <p>You can track your order status at: ${process.env.FRONTEND_URL}/order/${_id}</p>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: recipient,
    subject: `Order Confirmation - Order #${_id}`,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

const sendOrderStatusUpdate = async (order, isGuest = false) => {
  const { shippingInfo, _id, status, trackingNumber } = order;
  const recipient = isGuest ? shippingInfo.email : order.user.email;

  const html = `
    <h1>Order Status Update</h1>
    <p>Your order status has been updated.</p>
    <p>Order ID: ${_id}</p>
    <p>New Status: ${status}</p>
    ${trackingNumber ? `<p>Tracking Number: ${trackingNumber}</p>` : ''}
    
    <p>You can track your order status at: ${process.env.FRONTEND_URL}/order/${_id}</p>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: recipient,
    subject: `Order Status Update - Order #${_id}`,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = {
  sendOrderConfirmation,
  sendOrderStatusUpdate
}; 