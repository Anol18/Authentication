import { auth } from "@/auth";
import { redirect } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Signout from "@/components/common/Signout";
import DynamicBreadcrumb from "@/components/common/DynamicBreadCrumb";
import QueryProvider from "./QueryProvider";
import { Toaster } from "@/components/ui/sonner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await auth();
  if (!data?.user && !data?.user?.id) redirect("/");
  return (
    // <div>
    //   <QueryProvider>{children}</QueryProvider>
    // </div>
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              {/* <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
              <DynamicBreadcrumb />
            </div>
            <div className="w-full flex justify-end px-4">
              <Signout />
            </div>
          </header>
          <Separator
            orientation="horizontal"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
            </div> */}
            <QueryProvider>{children}</QueryProvider>
            <Toaster />
            {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
