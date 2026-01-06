import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n";

const proxy = createMiddleware(routing);

export default proxy;

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|admin|\\.well-known|.*\\..*).*)",
};
