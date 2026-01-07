export type RawUrl = {
  custom: boolean;
  url: string;
  scroll: boolean;
  scrollTarget: string;
  targetPage?: "current" | "home" | "page";
  urlType:
    | "home"
    | "page"
    | "blog"
    | "blog-post"
    | "events"
    | "event-post"
    | "privacy-policy"
    | "cookie-policy"
    | "terms-and-conditions";
  page: {
    relationTo: "pages";
    value: number | { url: string; slug: string };
  };
  blogPost: {
    relationTo: "blog-posts";
    value: number | { url: string; slug: string };
  };
  eventPost?: {
    relationTo: "events-posts";
    value: number | { url: string; slug: string };
  };
};
