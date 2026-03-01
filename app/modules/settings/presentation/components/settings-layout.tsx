import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { BellIcon, LockIcon, UserIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/shared/components/ui/sidebar";

interface SettingsLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/settings/profile", label: "Profile", icon: UserIcon },
  { to: "/settings/security", label: "Security", icon: LockIcon },
  { to: "/settings/notifications", label: "Notifications", icon: BellIcon },
];

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(({ to, label, icon: Icon }) => (
                  <SidebarMenuItem key={to}>
                    <NavLink to={to} end>
                      {({ isActive }) => (
                        <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
                          <span>
                            <Icon />
                            <span>{label}</span>
                          </span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="w-full max-w-2xl px-6 py-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
