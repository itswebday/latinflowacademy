import Script from "next/script";
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
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=AW-18059067445"
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18059067445');
            `}
          </Script>
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
          <link
            href="/favicon.ico"
            rel="icon"
            type="image/x-icon"
            sizes="any"
          />
          <link href="/icon.svg" rel="icon" type="image/svg+xml" />
          <link
            href="/apple-touch-icon.png"
            rel="apple-touch-icon"
            sizes="125x125"
          />
        </head>

        <body className="text-[15px] text-white font-montserrat bg-dark">
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
