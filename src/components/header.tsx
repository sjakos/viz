import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

interface BreadcrumbItem {
  href: string;
  label: string;
}

interface HeaderProps {
  breadcrumbs: BreadcrumbItem[];
}

export default function Header({ breadcrumbs }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map(({href,label}, index) => (
              <React.Fragment key={index}>
                {index < breadcrumbs.length - 1 ? (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href={href}>
                        {label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
