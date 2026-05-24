import { Fragment, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { BellIcon, LockIcon, UserIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/shared/components/ui/breadcrumb";
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

type BreadcrumbSegment = { label: string; href?: string };

const BREADCRUMB_MAP: Record<string, BreadcrumbSegment[]> = {
  "/settings": [{ label: "Settings" }],
  "/settings/profile": [{ label: "Settings", href: "/settings" }, { label: "Profile" }],
  "/settings/notifications": [{ label: "Settings", href: "/settings" }, { label: "Notifications" }],
  "/settings/security": [{ label: "Settings", href: "/settings" }, { label: "Security" }],
  "/settings/security/password": [
    { label: "Settings", href: "/settings" },
    { label: "Security", href: "/settings/security" },
    { label: "Change Password" },
  ],
  "/settings/security/sessions": [
    { label: "Settings", href: "/settings" },
    { label: "Security", href: "/settings/security" },
    { label: "Active Sessions" },
  ],
  "/settings/security/mfa": [
    { label: "Settings", href: "/settings" },
    { label: "Security", href: "/settings/security" },
    { label: "MFA" },
  ],
  "/settings/security/mfa/totp/setup": [
    { label: "Settings", href: "/settings" },
    { label: "Security", href: "/settings/security" },
    { label: "MFA", href: "/settings/security/mfa" },
    { label: "Set up Authenticator App" },
  ],
  "/settings/security/mfa/email/setup": [
    { label: "Settings", href: "/settings" },
    { label: "Security", href: "/settings/security" },
    { label: "MFA", href: "/settings/security/mfa" },
    { label: "Set up Email MFA" },
  ],
  "/settings/security/mfa/disable": [
    { label: "Settings", href: "/settings" },
    { label: "Security", href: "/settings/security" },
    { label: "MFA", href: "/settings/security/mfa" },
    { label: "Disable MFA" },
  ],
};

function SettingsBreadcrumb() {
  const { pathname } = useLocation();
  const segments = BREADCRUMB_MAP[pathname] ?? [{ label: "Settings", href: "/settings" }];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          return (
            <Fragment key={`${seg.label}-${i}`}>
              <BreadcrumbItem>
                {!isLast && seg.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={seg.href}>{seg.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{seg.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast ? <BreadcrumbSeparator /> : null}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

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
          <div className="bg-border mx-2 h-4 w-px" />
          <SettingsBreadcrumb />
        </header>
        <div className="w-full max-w-2xl px-6 py-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
