"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Brand } from "./brand";
import { NavLinks } from "./nav-links";

function SidebarFooter() {
  return (
    <p className="text-muted-foreground px-3 text-[11px] leading-relaxed">
      Fan-made tool. Not affiliated with Activision or Infinity Ward.
    </p>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="bg-primary text-primary-foreground sr-only z-[1300] rounded-md px-3 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="bg-sidebar border-sidebar-border sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-6 border-r p-3 md:flex">
        <div className="px-2 pt-1">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <SidebarFooter />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="bg-sidebar/95 border-sidebar-border sticky top-0 z-[1050] flex h-14 items-center gap-2 border-b px-3 backdrop-blur md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </Button>
          <Brand />
        </header>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="bg-sidebar w-72 gap-6 p-3">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">Go to a section of the app</SheetDescription>
            <div className="px-2 pt-1">
              <Brand />
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
            <SidebarFooter />
          </SheetContent>
        </Sheet>

        <main id="main" className="flex min-w-0 flex-1 flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
