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
  debug: true,
  logger: true
} as TransportOptions);

export const sendEmail = async (email: string): Promise<void> => {
  const mailOptions: SendMailOptions = {
    from: 'alphaorionismain@gmail.com',
    to: email,
    subject: 'Explorador Orion - Recuperação de Senha',
    html: `<p>Olá!
Estamos prontos para ajudá-lo a recuperar o acesso à sua conta no sistema Explorador Orion. Basta clicar no [link] abaixo para redefinir sua senha. Nossos amigáveis marcianos estão ansiosos para recebê-lo de volta ao site!
Atenciosamente,
Suporte Explorador Orion
</p>`
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
