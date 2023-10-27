import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import { TransportOptions } from '../types/User';
import fs from 'fs';
import path from 'path';

const emailTemplatePath = path.join(__dirname, 'emailTemplates', 'index.html');
const emailContent = fs.readFileSync(emailTemplatePath, 'utf-8');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  },
  debug: true,
  logger: true
} as TransportOptions);

export const sendEmail = async (email: string): Promise<void> => {
  const mailOptions: SendMailOptions = {
    from: 'alphaorionisservice@gmail.com',
    to: email,
    subject: 'Explorador Orion - Recuperação de Senha',
    html: await emailContent
  };

  await transporter.sendMail(
    mailOptions,
    (err: Error | null, info: SentMessageInfo) => {
      if (err) {
        console.log(err);
      }
      console.log('Mensagem enviada: ', info?.messageId);
    }
  );
};
