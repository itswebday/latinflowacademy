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
    | "news"
    | "news-post"
    | "dance-styles"
    | "dance-style-post"
    | "teachers"
    | "teacher-post"
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
  newsPost?: {
    relationTo: "news-posts";
    value: number | { url: string; slug: string };
  };
  danceStylePost?: {
    relationTo: "dance-styles-posts";
    value: number | { url: string; slug: string };
  };
  teacherPost?: {
    relationTo: "teachers-posts";
    value: number | { url: string; slug: string };
  };
};
