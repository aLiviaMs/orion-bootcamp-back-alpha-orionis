import dotenv from 'dotenv';
dotenv.config();
import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import { TransportOptions } from '../types/User';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  },
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development'
} as TransportOptions);

export const sendEmail = async (
  email: string,
  subject: string,
  content: string
): Promise<boolean> => {
  const mailOptions: SendMailOptions = {
    from: 'alphaorionisservice@gmail.com',
    to: email,
    subject,
    html: content
  };

  const sentMessageInfo: SentMessageInfo | null = await transporter
    .sendMail(mailOptions)
    .catch((err) => {
      console.log('Erro durante o envio de e-mail:', err);
      return null;
    });
  const wasEmailSent: boolean = sentMessageInfo?.accepted?.length > 0;

  return wasEmailSent;
};
