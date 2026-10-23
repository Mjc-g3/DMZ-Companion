"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { isActivePath, NAV_ITEMS } from "@/lib/navigation";

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon, planned }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-ring/50 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-[3px]",
                  active && "bg-sidebar-accent text-sidebar-foreground font-medium shadow-[inset_3px_0_0_var(--primary)]",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  )}
                  aria-hidden
                />
                <span className="flex-1 truncate">{label}</span>
                {planned && (
                  <span className="text-muted-foreground border-border rounded border px-1 text-[10px] uppercase">
                    Soon
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
