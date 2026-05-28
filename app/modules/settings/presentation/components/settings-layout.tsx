import { Fragment, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { BellIcon, LockIcon, LogOutIcon, UserIcon } from "lucide-react";
import { getCurrentUser } from "~/modules/auth/infrastructure";
import { useLogoutMutation } from "~/modules/auth/presentation/hooks/use-logout-mutation";
import { useGetProfileQuery } from "../hooks/use-get-profile-query";
import { Avatar, AvatarFallback } from "~/shared/components/ui/avatar";
import { Button } from "~/shared/components/ui/button";
import { Skeleton } from "~/shared/components/ui/skeleton";
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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
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
        <SidebarHeader>
          <SettingsSidebarBrand />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SettingsSidebarNav />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SettingsSidebarFooter />
        </SidebarFooter>
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

function SettingsSidebarBrand() {
  const { isMobile, setOpenMobile } = useSidebar();
  const redirectTarget = resolveSidebarHomeRedirect();

  function handleClick() {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <a
      href={redirectTarget}
      onClick={handleClick}
      className="group flex items-center gap-2 rounded-md py-1.5 outline-none group-data-[collapsible=icon]:justify-center"
    >
      <img src="/bidmart.png" alt="BidMart" className="size-8 shrink-0 object-contain" />
      <span className="text-base font-bold tracking-tight group-data-[collapsible=icon]:hidden">
        BidMart
      </span>
    </a>
  );
}

function SettingsSidebarNav() {
  const { isMobile, setOpenMobile } = useSidebar();

  function handleNavClick() {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <SidebarMenu>
      {navItems.map(({ to, label, icon: Icon }) => (
        <SidebarMenuItem key={to}>
          <NavLink to={to} end onClick={handleNavClick}>
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
  );
}

function SettingsSidebarFooter() {
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();
  const logoutMutation = useLogoutMutation();
  const { data: profile } = useGetProfileQuery();
  const fallbackUser = getCurrentUser();

  const email = profile?.email ?? fallbackUser?.email ?? null;
  const displayName = profile?.name?.trim() || fallbackUser?.name?.trim() || email;
  const hasUserData = Boolean(email && displayName);
  const initials = hasUserData ? deriveInitials(displayName ?? "", email ?? "") : "";

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      if (isMobile) {
        setOpenMobile(false);
      }
      void navigate("/auth/login", { replace: true });
    }
  }

  return (
    <div className="space-y-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
      {hasUserData ? (
        <div className="bg-sidebar-accent/40 flex items-center gap-2 rounded-md px-2 py-2 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <Avatar size="sm" className="shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs leading-none font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="text-muted-foreground truncate text-xs">{email}</p>
          </div>
        </div>
      ) : (
        <div className="bg-sidebar-accent/40 flex items-center gap-2 rounded-md px-2 py-2 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <Skeleton className="size-6 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-1 group-data-[collapsible=icon]:hidden">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        className="text-destructive hover:text-destructive w-full justify-start gap-2 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center"
        disabled={logoutMutation.isPending}
        onClick={() => {
          void handleLogout();
        }}
      >
        <LogOutIcon className="size-4 shrink-0 text-current" />
        <span className="group-data-[collapsible=icon]:hidden">
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </span>
      </Button>
    </div>
  );
}

function resolveSidebarHomeRedirect(): string {
  const target = String(import.meta.env.VITE_REDIRECT_URL ?? "/").trim();
  return target.length > 0 ? target : "/";
}

function deriveInitials(name: string, email: string): string {
  const normalized = name.trim();
  if (normalized.length > 0 && normalized !== email) {
    const parts = normalized.split(/\s+/).slice(0, 2);
    const initials = parts
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    if (initials.length > 0) {
      return initials;
    }
  }
  return email.slice(0, 2).toUpperCase();
}
