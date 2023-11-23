import fs from 'fs';
import path from 'path';
import validator from 'validator';

export const composeNewsletterEmailContent = (
  url: string,
  newsItemsList: string
): string | null => {
  const newsletterHtml = fs.readFileSync(
    path.resolve(__dirname, './newsletter.html'),
    'utf-8'
  );

  const isRegexDoS: boolean = url.length > 2048;
  if (isRegexDoS) return null;

  if (!validator.isURL(url)) return null;

  const isScriptPresent: boolean = newsItemsList.search('<script') !== -1;
  if (isScriptPresent) return null;

  const emailContent: string = newsletterHtml
    .replace('{NEWS_ITEMS_LIST}', newsItemsList)
    .replace('{UNSUBSCRIBE_LINK}', url);

  return emailContent;
};
