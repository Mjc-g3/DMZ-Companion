import {
  BookOpen,
  LayoutDashboard,
  ListChecks,
  Map as MapIcon,
  Package,
  Settings,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Not built yet; shown with a "soon" tag. */
  planned?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/map", label: "Interactive Map", icon: MapIcon },
  { href: "/missions", label: "Missions", icon: ListChecks },
  { href: "/items", label: "Items & Loot", icon: Package },
  { href: "/fob", label: "FOB Upgrades", icon: Warehouse, planned: true },
  { href: "/wiki", label: "Wiki & Guides", icon: BookOpen, planned: true },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
