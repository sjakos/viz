import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import Header from "@/components/header"
import Content from "@/components/content"

const breadcrumbs = [
  { href: "#", label: "Building Your Application" },
  { href: "#", label: "Data Fetching" }
];

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header breadcrumbs={breadcrumbs} />
        <Content />
      </SidebarInset>
    </SidebarProvider>
  )
}
