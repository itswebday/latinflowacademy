// NOTE: Import each block config directly from its `*Block.ts` file (NOT from
// the directory's index barrel). The barrel re-exports both the Payload field
// config and the React component; under tsx (used by Payload's CLI) the ESM
// loader would evaluate the component too, which fails because client-only
// imports like `usePathname` from "next/navigation" can't be loaded outside
// of a Next.js runtime. Direct imports keep the CLI on pure-config code.
import { AccordionBlock } from "./Accordion/AccordionBlock";
import { CallToActionBlock } from "./CallToAction/CallToActionBlock";
import { CardsBlock } from "./Cards/CardsBlock";
import { CardsImageBlock } from "./CardsImage/CardsImageBlock";
import { HeadingBlock } from "./Heading/HeadingBlock";
import { SellingPointsBlock } from "./SellingPoints/SellingPointsBlock";
import { StoryBlock } from "./Story/StoryBlock";
import { SyllabusBlock } from "./Syllabus/SyllabusBlock";
import { TeachersBlock } from "./Teachers/TeachersBlock";
import { TextImageBlock } from "./TextImage/TextImageBlock";
import { TextBlock } from "./Text/TextBlock";
import { VisualBlock } from "./Visual/VisualBlock";

export const blockConfigs = [
  AccordionBlock,
  CallToActionBlock,
  CardsBlock,
  CardsImageBlock,
  HeadingBlock,
  SellingPointsBlock,
  StoryBlock,
  SyllabusBlock,
  TeachersBlock,
  TextImageBlock,
  TextBlock,
  VisualBlock,
];
