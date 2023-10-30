import fs from 'fs';
import path from 'path';

export const composeResetEmailContent = (url: string): string => {
  const indexHtml = fs.readFileSync(
    path.resolve(__dirname, './index.html'),
    'utf-8'
  );

  const emailContent: string = indexHtml.replace(
    'URL_DA_PAGINA_DE_REDEFINICAO',
    url
  );

  return emailContent;
};
