"use client";

import { Home, Gauge, List, Target } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const availableItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: Gauge },
  { title: "List", url: "/list", icon: List },
];

export function AppSidebar() {
  const { status } = useSession();
  const pathname = usePathname();
  const { state } = useSidebar();
  const items =
    status === "authenticated" ? availableItems : availableItems.slice(0, 1);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center justify-between ">
                <SidebarMenuButton asChild>
                  <Link
                    href="/"
                    className="flex items-center space-x-2 p-2 hover:bg-gray-300 rounded"
                  >
                    <Target />
                    <span>A-SAFE Test</span>
                  </Link>
                </SidebarMenuButton>
                {state === "expanded" && <SidebarTrigger />}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {status === "loading" ? (
                <p>Loading...</p>
              ) : (
                items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link
                        href={item.url}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-300 rounded"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
