import type { Metadata, Viewport } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { ServiceWorkerRegistration } from "@/components/layout/service-worker-registration";
import { GameDataProvider } from "@/providers/game-data-provider";
import { ProgressProvider } from "@/providers/progress-provider";
import { getGameData } from "@/services/game-data";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MW4 DMZ Companion",
    template: "%s · DMZ Companion",
  },
  description:
    "Unofficial second-screen companion for Call of Duty: Modern Warfare 4 DMZ: maps, missions, loot and progress.",
  applicationName: "DMZ Companion",
  appleWebApp: { capable: true, title: "DMZ Companion", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#1a1d17",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const bundle = await getGameData();

  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full">
        <GameDataProvider bundle={bundle}>
          <ProgressProvider contentVersion={bundle.version}>
            <AppShell>{children}</AppShell>
          </ProgressProvider>
        </GameDataProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
