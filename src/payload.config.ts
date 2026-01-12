import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import {
  BlogPosts,
  EventsPosts,
  FormSubmissions,
  Forms,
  Media,
  Pages,
  Users,
} from "@/collections";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import {
  Blog,
  CookiePolicy,
  Events,
  Footer,
  Hero,
  Home,
  Navigation,
  Prices,
  PrivacyPolicy,
  TermsAndConditions,
} from "@/globals";
import { getLinkFields } from "@/utils";
import { plugins } from "@/plugins";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  globals: [
    Home,
    Hero,
    Blog,
    Events,
    Navigation,
    Footer,
    Prices,
    PrivacyPolicy,
    CookiePolicy,
    TermsAndConditions,
  ],
  collections: [
    Users,
    Media,
    Pages,
    BlogPosts,
    EventsPosts,
    Forms,
    FormSubmissions,
  ],
  editor: lexicalEditor({
    features: ({ rootFeatures }) => {
      return [
        ...rootFeatures.filter(
          (feature) =>
            !["upload", "relationship", "checklist"].includes(feature.key),
        ),
        HeadingFeature({
          enabledHeadingSizes: ["h1", "h2", "h3", "h4", "h5", "h6"],
        }),
        BoldFeature(),
        ItalicFeature(),
        UnderlineFeature(),
        StrikethroughFeature(),
        SubscriptFeature(),
        SuperscriptFeature(),
        InlineCodeFeature(),
        AlignFeature(),
        IndentFeature(),
        UnorderedListFeature(),
        OrderedListFeature(),
        LinkFeature({
          fields: () => getLinkFields({ localizedText: false }),
        }),
        BlockquoteFeature(),
        HorizontalRuleFeature(),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ];
    },
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || "",
    },
  }),
  plugins: [...plugins],
  localization: {
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  sharp: sharp,
});
