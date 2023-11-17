import fs from 'fs';
import path from 'path';

export const composeRegisterEmailContent = (url: string): string => {
  const indexHtml = fs.readFileSync(
    path.resolve(__dirname, './register.html'),
    'utf-8'
  );

  const emailContent: string = indexHtml.replace(
    '[Link de Validação da Conta]',
    url
  );

  return emailContent;
};
