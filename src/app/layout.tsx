import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import {routing} from '@/i18n/routing';
import { getLocale } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
   
            <div className="flex items-center gap-2 px-4 w-full">
              <div className="p-3 flex justify-end  w-full">
                <LanguageSwitcher/>
              </div>
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
             
    
            </div>
           
         
          <Separator
            orientation="horizontal"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
         <NextIntlClientProvider >{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}


export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}