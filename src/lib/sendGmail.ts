//  'use server'
// import nodemailer from "nodemailer";
// export const sendEmail = async (
//   email: string,
//   subject: string,
//   msg: string
// ): Promise<void> => {
//   console.log(process.env.SMTP_PASSWORD,'8888888888888888888888')
//   console.log('hit send mail function')
//   // const transporter = nodemailer.createTransport({
//   //   host: process.env.SMTP_HOST,
//   //   port: Number(process.env.SMTP_PORT),
//   //   auth: {
//   //     user: process.env.SMTP_USER,
//   //     pass: process.env.SMTP_PASSWORD,
//   //   },
//   // });

//   const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'garfield.mayert34@ethereal.email',
//         pass: 'A7wbTzUT4F5ReeaPDJ'
//     }
// });

//   const message = {
//     from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_EMAIL}>`,
//     to: email,
//     subject: subject,
//     html: msg,
//   };
//   await transporter.sendMail(message);
// };


'use server'

import nodemailer from "nodemailer";

export const sendEmail = async (
  email: string,
  subject: string,
  msg: string
): Promise<{ success: boolean; error?: string }> => {
  console.log('Attempting to send email...');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const message = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.GMAIL_USER}>`,
      to: email,
      subject: subject,
      html: msg,
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'error' };
  }
};