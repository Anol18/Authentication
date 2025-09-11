import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import {routing} from '@/i18n/routing';
import { getLocale } from "next-intl/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
   
         <NextIntlClientProvider >{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}


export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}