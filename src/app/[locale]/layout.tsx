import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import {
  CookieNotification,
  PreviewListener,
  ScrollRestoration,
} from "@/components";
import Footer from "@/components/Footer";
import NavBarNavMenu from "@/components/NavBarNavMenu";
import NewsMarquee from "@/components/NewsMarquee";
import { NavMenuProvider, PageProvider } from "@/contexts";

const getServerSideUrl = () => {
  return process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
};

const HomeLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  return (
    <NextIntlClientProvider>
      <html lang={locale} suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />
          <link href="/favicon.ico" rel="icon" sizes="32x32" />
          <link href="/icon.svg" rel="icon" type="image/svg+xml" />
          <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        </head>

        <body className="text-[16px] font-montserrat font-light text-dark">
          <PageProvider initialPage="">
            <NewsMarquee />
            <NavMenuProvider>
              <ScrollRestoration />
              <PreviewListener />
              <NavBarNavMenu />
              {children}
              <Footer />
              <CookieNotification />
            </NavMenuProvider>
          </PageProvider>
        </body>
      </html>
    </NextIntlClientProvider>
  );
};

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideUrl()),
};

export default HomeLayout;
