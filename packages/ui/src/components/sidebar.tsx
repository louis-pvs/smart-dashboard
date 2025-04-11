"use client";

import {
  CaretLineRight,
  CaretUp,
  User,
  IconProps,
} from "@phosphor-icons/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/components/ui/sidebar";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib";
import React, { useCallback, useMemo } from "react";

import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@repo/ui/components/ui/dropdown-menu";


export interface SidebarItem {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  isActive?: boolean;
}

export interface WebSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebarItems: SidebarItem[];
  LinkComp?: React.ElementType;
  currentPath?: string;
}

export default function WebSidebar({
  sidebarItems,
  LinkComp = (props) => <a {...props} />,
  currentPath = "/",
  ...props
}: WebSidebarProps) {
  const isActive = useCallback((url: string) => currentPath === url, [currentPath]);
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <LinkComp href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </LinkComp>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <Button asChild>
            <LinkComp href="/login">Login</LinkComp>
          </Button>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User /> Username
                  <CaretUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function SidebarTrigger({
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, state } = useSidebar();
  const isOpen = useMemo(() => state === "expanded", [state]);

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}>
      <CaretLineRight
        weight="bold"
        className={cn({ "rotate-180": isOpen }, "transition-transform")}
      />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

export { WebSidebar, SidebarTrigger };
