import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  items?: NavItem[]
  isActive?: boolean
}

const navData: NavItem[] = [
    {
      title: "Load",
      url: "/load",
    },
    {
      title: "Transform & Query",
      url: "/transform",
    },
    {
      title: "Visualize",
      url: "/visualize",
      items: [
        {
          title: "Graph View",
          url: "/visualize/graph",
        },
        {
          title: "Explorer View",
          url: "/visualize/explorer",
        },
        {
          title: "Table View",
          url: "/visualize/table",
        },
      ],
    },
  ]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Viz</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <NavItems items={navData} />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

interface NavItemsProps {
  items: NavItem[]
}

const NavItems = ({ items }: NavItemsProps) => (
  <>
    {items.map(({ title, url, items: subItems }) => (
      <SidebarMenuItem key={title}>
        <SidebarMenuButton asChild>
          <a href={url} className="font-medium">
            {title}
          </a>
        </SidebarMenuButton>
        {subItems?.length && (
          <SidebarMenuSub>
            {subItems.map(({ title: subTitle, url: subUrl, isActive }) => (
              <SidebarMenuSubItem key={subTitle}>
                <SidebarMenuSubButton asChild isActive={isActive}>
                  <a href={subUrl}>{subTitle}</a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    ))}
  </>
)
