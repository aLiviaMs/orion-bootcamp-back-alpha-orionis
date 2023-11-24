import fs from 'fs';
import path from 'path';
import validator from 'validator';

export const composeNewsletterEmailContent = (
  unsubscribeURL: string,
  newsItemsList: string
): string | null => {
  const newsletterHtml = fs.readFileSync(
    path.resolve(__dirname, './newsletter.html'),
    'utf-8'
  );

  const isRegexDoS: boolean = unsubscribeURL.length > 2048;
  if (isRegexDoS) return null;

  const isValidURL: boolean = validator.isURL(unsubscribeURL, {
    require_tld: process.env.NODE_ENV === 'production'
  });

  if (!isValidURL) {
    return null;
  }

  const isScriptPresent: boolean = newsItemsList.search('<script') !== -1;
  if (isScriptPresent) return null;

  const emailContent: string = newsletterHtml
    .replace('{NEWS_ITEMS_LIST}', newsItemsList)
    .replace('{UNSUBSCRIBE_LINK}', unsubscribeURL);

  return emailContent;
};
