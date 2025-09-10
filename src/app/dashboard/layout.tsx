import { auth } from "@/auth";
import { redirect } from "next/navigation";


import QueryProvider from "./QueryProvider";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await auth();
  if (!data?.user && !data?.user?.id) redirect("/");
  return (
    <html lang="en">
      <body>
        <QueryProvider >
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
