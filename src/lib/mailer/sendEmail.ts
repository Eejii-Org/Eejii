import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const sendEmail = async (to: string, subject: any, html: any) => {
  const mailOptions = {
    from: 'infoeejii@gmail.com',
    to: to,
    subject: subject,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error: any) {
    console.error('Error sending email:', error);
    return false;
  }
};

export default sendEmail;
