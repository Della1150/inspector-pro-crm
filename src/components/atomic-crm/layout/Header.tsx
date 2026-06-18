import {
  BarChart3,
  FileText,
  Import,
  ListTodo,
  Settings,
  User,
  Users,
} from "lucide-react";
import { CanAccess, useTranslate, useUserMenu } from "ra-core";
import { Link, matchPath, useLocation } from "react-router";
import { RefreshButton } from "@/components/admin/refresh-button";
import { ThemeModeToggle } from "@/components/admin/theme-mode-toggle";
import { UserMenu } from "@/components/admin/user-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { useConfigurationContext } from "../root/ConfigurationContext";
import { ImportPage } from "../misc/ImportPage";
import { ChangelogPage } from "../misc/ChangelogPage";

const Header = () => {
  const { darkModeLogo, lightModeLogo, title } = useConfigurationContext();
  const location = useLocation();
  const translate = useTranslate();

  let currentPath: string | boolean = "/";
  if (matchPath("/", location.pathname)) {
    currentPath = "/";
  } else if (matchPath("/contacts/*", location.pathname)) {
    currentPath = "/contacts";
  } else if (matchPath("/companies/*", location.pathname)) {
    currentPath = "/companies";
  } else if (matchPath("/tasks/*", location.pathname)) {
    currentPath = "/tasks";
  } else if (matchPath("/import", location.pathname)) {
    currentPath = "/import";
  } else if (matchPath("/settings", location.pathname)) {
    currentPath = "/settings";
  } else if (matchPath("/deals/*", location.pathname)) {
    currentPath = "/deals";
  } else {
    currentPath = false;
  }

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-white/60 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-18 flex-1 items-center justify-between gap-4">
              <Link
                to="/"
                className="group flex items-center gap-3 text-slate-950 no-underline"
              >
                <img
                  className="[.light_&]:hidden h-8 rounded-xl shadow-sm"
                  src={darkModeLogo}
                  alt={title}
                />
                <img
                  className="[.dark_&]:hidden h-8 rounded-xl shadow-sm"
                  src={lightModeLogo}
                  alt={title}
                />
                <div>
                  <h1 className="text-lg font-black tracking-tight sm:text-xl">
                    {title}
                  </h1>
                  <p className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 sm:block">
                    Referral OS
                  </p>
                </div>
              </Link>
              <div>
                <nav className="hidden items-center rounded-full border border-slate-200 bg-slate-100/80 p-1 shadow-inner lg:flex">
                  <NavigationTab
                    label={translate("ra.page.dashboard")}
                    icon={<BarChart3 className="size-4" />}
                    to="/"
                    isActive={currentPath === "/"}
                  />
                  <NavigationTab
                    label="Realtors"
                    icon={<Users className="size-4" />}
                    to="/contacts"
                    isActive={currentPath === "/contacts"}
                  />
                  <NavigationTab
                    label="Follow-Ups"
                    icon={<ListTodo className="size-4" />}
                    to="/tasks"
                    isActive={currentPath === "/tasks"}
                  />
                  <NavigationTab
                    label="Import/Export"
                    icon={<Import className="size-4" />}
                    to="/import"
                    isActive={currentPath === "/import"}
                  />
                  <NavigationTab
                    label="Settings"
                    icon={<Settings className="size-4" />}
                    to="/settings"
                    isActive={currentPath === "/settings"}
                  />
                </nav>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-2 py-1 shadow-sm">
                <ThemeModeToggle />
                <RefreshButton />
                <UserMenu>
                  <ProfileMenu />
                  <CanAccess resource="sales" action="list">
                    <UsersMenu />
                  </CanAccess>
                  <CanAccess resource="configuration" action="edit">
                    <SettingsMenu />
                  </CanAccess>
                  <ImportFromJsonMenuItem />
                  <ChangelogMenuItem />
                </UserMenu>
              </div>
            </div>
          </div>
        </header>
      </nav>
    </>
  );
};

const NavigationTab = ({
  label,
  icon,
  to,
  isActive,
}: {
  label: string;
  icon?: React.ReactNode;
  to: string;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
      isActive
        ? "bg-slate-950 text-white shadow-sm"
        : "text-slate-600 hover:bg-white hover:text-slate-950"
    }`}
  >
    {icon}
    {label}
  </Link>
);

const UsersMenu = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<UsersMenu> must be used inside <UserMenu?");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to="/sales" className="flex items-center gap-2">
        <Users />
        {translate("resources.sales.name", { smart_count: 2 })}
      </Link>
    </DropdownMenuItem>
  );
};

const ProfileMenu = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<ProfileMenu> must be used inside <UserMenu?");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to="/profile" className="flex items-center gap-2">
        <User />
        {translate("crm.profile.title")}
      </Link>
    </DropdownMenuItem>
  );
};

const SettingsMenu = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<SettingsMenu> must be used inside <UserMenu>");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to="/settings" className="flex items-center gap-2">
        <Settings />
        {translate("crm.settings.title")}
      </Link>
    </DropdownMenuItem>
  );
};

const ImportFromJsonMenuItem = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<ImportFromJsonMenuItem> must be used inside <UserMenu>");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to={ImportPage.path} className="flex items-center gap-2">
        <Import />
        {translate("crm.header.import_data")}
      </Link>
    </DropdownMenuItem>
  );
};

const ChangelogMenuItem = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<ChangelogMenuItem> must be used inside <UserMenu>");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to={ChangelogPage.path} className="flex items-center gap-2">
        <FileText />
        {translate("crm.changelog.title")}
      </Link>
    </DropdownMenuItem>
  );
};
export default Header;
