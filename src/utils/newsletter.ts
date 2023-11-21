import { composeNewsletterEmailContent } from './emailTemplates/newsletterEmailContent';
import { UnsubscriptionToken } from '../entity/UnsubscriptionToken';
import { NewsletterBloggerAPIResponse } from '../types/Newsletter';
import { generateTokenAndHash } from './recovery';
import { UnsubTokenRepo } from './subscription';
import axios, { AxiosResponse } from 'axios';
import { UserRepository } from './user';
import { User } from '../entity/User';
import { sendEmail } from './email';
import * as cheerio from 'cheerio';

/**
 * Obtém o endereço do Blogger já aplicando o filtro de data
 * @param rangeInDays O período em dias
 * @returns O endereço com filtro aplicado
 */
export const getBloggerFilteredURL = (rangeInDays: number = 1) => {
  const url: string = process.env.BLOGGER_API_URL;
  const now = new Date();

  const nowInRFC3339: string = now.toISOString().split('.')[0] + '-00:00';
  const startDateInRFC3339: string =
    new Date(now.setDate(now.getDate() - rangeInDays))
      .toISOString()
      .split('.')[0] + '-00:00';

  const lastPostsInRangeURL: string = `${url}&startDate=${startDateInRFC3339}&endDate=${nowInRFC3339}`;
  return lastPostsInRangeURL;
};

/**
 * Gera uma lista de itens de notícias a partir do feed do Blogger
 * @returns A lista de items de notícias ou nulo caso não seja possível obter
 */
export const generateNewsItemsList = async (): Promise<string[] | null> => {
  const filteredBloggerURL: string = getBloggerFilteredURL(1);

  const res: AxiosResponse<NewsletterBloggerAPIResponse> =
    await axios.get(filteredBloggerURL);
  const postsList = res.data.items;

  const newsItems: string[] = postsList?.map((post) => {
    const $ = cheerio.load(post.content);
    const postSummary: string = $('.post-resume').text();

    const postNewsItem: string = `<div class="news-item" style="margin: 20px 0; padding: 10px; border: 1px solid #ddd;">
       <h2><a href="${post.url}">${post.title}</a></h2>
       <p>${postSummary}</p>
     </div>`;

    return postNewsItem;
  });

  return newsItems;
};

/**
 * Obtém a lista de tokens de cancelamento de assinatura de Newsletter
 * @returns A lista de tokens de cancelamento de assinatura
 */
export const getUnsubTokens = async (
  subscribedUsersList: User[]
): Promise<UnsubscriptionToken[] | null> => {
  console.log('sub: ', subscribedUsersList);

  const unsubTokenList: UnsubscriptionToken[] | null =
    await UnsubTokenRepo.find({}).catch((_err) => null);

  const usersThatNeedUnsubKeys: User[] = subscribedUsersList?.filter((user) => {
    const hasUnsubToken: boolean = unsubTokenList?.some(
      (token) => token._id === user._id
    );
    return !hasUnsubToken;
  });

  const newUnsubTokenList: UnsubscriptionToken[] = usersThatNeedUnsubKeys?.map(
    (user) => {
      const unsubToken = new UnsubscriptionToken();
      const { hash } = generateTokenAndHash();
      unsubToken._id = user._id;
      unsubToken.hash = hash;

      return unsubToken;
    }
  );

  const savedUnsubTokens: UnsubscriptionToken[] = await UnsubTokenRepo.save(
    newUnsubTokenList
  ).catch((_err) => null);

  console.log(savedUnsubTokens);

  const allUnsubTokens: UnsubscriptionToken[] =
    unsubTokenList?.concat(savedUnsubTokens);

  return allUnsubTokens;
};

/**
 * Obtém a lista de usuários assinantes da Newsletter
 * @returns A lista de usuário assinantes da Newsletter
 */
export const getSubscribedUsers = async (): Promise<User[] | null> => {
  const subscribedUsersList: User[] | null = await UserRepository.find({
    where: { isSubscribed: true }
  }).catch((_err) => null);

  return subscribedUsersList;
};
/**
 * Envia e-mails em massa de modo concorrente para a lista de usuários assinantes da Newsletter
 * @param subscribedUsersList A lista de usuário assinantes da Newsletter
 * @param allUnsubTokens A lista de tokens de cancelamento da assinatura
 * @returns A lista de booleanos indicando se os e-mails foram enviados com sucesso
 */
export const sendBulkNewsletterEmails = async (
  subscribedUsersList: User[],
  allUnsubTokens: UnsubscriptionToken[]
): Promise<boolean[]> => {
  const newsItemsList: string[] | null = await generateNewsItemsList().catch(
    (_err) => {
      console.log('err: ', _err);
      return null;
    }
  );
  const newsItemsListString: string = newsItemsList?.join('');

  const wereEmailsSent: boolean[] = await Promise.all(
    subscribedUsersList?.map(async (user) => {
      if (newsItemsList?.length == 0) return false;

      const currentUnsubToken: UnsubscriptionToken | undefined =
        allUnsubTokens.find((token) => token._id === user._id);
      const unsubToken: string | null = currentUnsubToken?.hash;

      console.log('unsubToken', unsubToken);

      if (!unsubToken) return false;

      const email: string = user.email;
      const subject: string = 'Explorando Marte - Newsletter';
      const unsubscribeURL: string = `${process.env.FRONTEND_URL}/newsletter/unsubscribe/${unsubToken}`;

      const content: string = composeNewsletterEmailContent(
        unsubscribeURL,
        newsItemsListString
      );

      const wasEmailSent: boolean = await sendEmail(email, subject, content);
      return wasEmailSent;
    })
  );

  return wereEmailsSent;
};

/**
 * Organiza e envia a Newsletter para todos os usuários assinantes
 * @returns A lista de booleanos indicando se os e-mails foram enviados com sucesso
 */
export const sendNewsletter = async () => {
  const subscribedUserList: User[] | null = await getSubscribedUsers();

  const allUnsubTokens: UnsubscriptionToken[] | null =
    await getUnsubTokens(subscribedUserList);

  const wasNewsletterSent: boolean[] = await sendBulkNewsletterEmails(
    subscribedUserList,
    allUnsubTokens
  );

  return wasNewsletterSent;
};
