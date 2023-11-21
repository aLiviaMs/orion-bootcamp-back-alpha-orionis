export interface NewsletterBloggerAPIResponse {
  items: NewsletterBloggerItem[];
}

export interface NewsletterBloggerItem {
  title: string;
  url: string;
  content: string;
}
