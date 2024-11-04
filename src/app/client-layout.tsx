"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";
import StoreProvider from "@/components/StoreProvider";

const breadcrumbsMap = {
  "/": [{ href: "/", label: "Home" }],
  "/load": [
    { href: "/", label: "Home" },
    { href: "/load", label: "Load Data" },
  ],
  "/visualize": [
    { href: "/", label: "Home" },
    { href: "/visualize", label: "Visualize" },
  ],
  "/visualize/table": [
    { href: "/", label: "Home" },
    { href: "/visualize", label: "Visualize" },
    { href: "/visualize/table", label: "Table View" },
  ],
};

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const breadcrumbs =
    breadcrumbsMap[pathname as keyof typeof breadcrumbsMap] || [];

  return (
    <StoreProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header breadcrumbs={breadcrumbs} />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </StoreProvider>
  );
}
