import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import {
  CookieNotification,
  PreviewListener,
  ScrollRestoration,
} from "@/components";
import Footer from "@/components/Footer";
import NavBarNavMenu from "@/components/NavBarNavMenu";
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
            href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />
          <link href="/favicon.ico" rel="icon" sizes="32x32" />
          <link href="/icon.svg" rel="icon" type="image/svg+xml" />
          <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        </head>

        <body className="text-[15px] font-montserrat">
          <PageProvider initialPage="">
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
