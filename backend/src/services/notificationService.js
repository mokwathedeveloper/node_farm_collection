const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOrderStatusUpdateEmail = async (user, order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Order ${order._id} Status Update`,
    text: `Dear ${user.name},\n\nYour order (${order._id}) has been updated to "${order.status}".\n\nThank you for shopping with us!\n\neCommerce`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderStatusUpdateEmail };