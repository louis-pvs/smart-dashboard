"use client";

import {
  HouseLine,
  Tray,
  Calendar,
  MagnifyingGlass,
  Gear,
} from "@phosphor-icons/react";
import UISidebar, {
  WebSidebarProps,
} from "@repo/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/",
    icon: HouseLine,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Tray,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: MagnifyingGlass,
  },
  {
    title: "Settings",
    url: "#",
    icon: Gear,
  },
];

export default function WebSidebar({
  sidebarItems = items,
  ...props
}: WebSidebarProps) {
  const pathname = usePathname();
  return (
    <UISidebar
      currentPath={pathname}
      LinkComp={Link}
      sidebarItems={sidebarItems}
      {...props}
    />
  );
}