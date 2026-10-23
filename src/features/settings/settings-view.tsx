"use client";

import { useRef, useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";

import { PageContainer, PageHeader } from "@/components/common/page-header";
import { ErrorState, ListSkeleton } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGameData } from "@/providers/game-data-provider";
import { useProgressState, useProgressStore } from "@/providers/progress-provider";

export function SettingsView() {
  const { bundle } = useGameData();
  const store = useProgressStore();
  const state = useProgressState();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (state.status === "loading") {
    return (
      <PageContainer>
        <PageHeader title="Settings" />
        <ListSkeleton rows={3} />
      </PageContainer>
    );
  }

  const { progress } = state;

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dmz-companion-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importProgress = async (file: File) => {
    try {
      const raw: unknown = JSON.parse(await file.text());
      if (typeof raw !== "object" || raw === null || (raw as { schemaVersion?: unknown }).schemaVersion !== 1) {
        throw new Error("This file is not a DMZ Companion progress export.");
      }
      await store.replace(raw);
      setMessage({ tone: "ok", text: "Progress imported." });
    } catch (error) {
      setMessage({ tone: "error", text: error instanceof Error ? error.message : "Import failed." });
    }
  };

  return (
    <PageContainer className="max-w-3xl">
      <PageHeader title="Settings" description="Display options and saved progress." />
      {state.status === "error" && <ErrorState title="Progress storage problem" description={state.error} />}

      <Card>
        <CardHeader>
          <CardTitle>Display</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="show-mock"
              checked={progress.settings.showMockData}
              onCheckedChange={(checked) =>
                store.update((p) => ({ ...p, settings: { ...p.settings, showMockData: checked === true } }))
              }
              className="mt-0.5"
            />
            <label htmlFor="show-mock" className="cursor-pointer text-sm">
              <span className="font-medium">Show mock data</span>
              <span className="text-muted-foreground block">
                Placeholder missions, items and locations used while real data is being sourced.
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress data</CardTitle>
          <CardDescription>
            Saved in this browser only. Export a backup before clearing site data or switching devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportProgress}>
              <Download /> Export
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload /> Import
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importProgress(file);
                event.target.value = "";
              }}
            />
            <Button variant="destructive" onClick={() => setConfirmReset(true)}>
              <RotateCcw /> Reset progress
            </Button>
          </div>
          {message && (
            <p role="status" className={message.tone === "ok" ? "text-success text-sm" : "text-destructive text-sm"}>
              {message.text}
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            Last saved {progress.updatedAt === new Date(0).toISOString() ? "never" : new Date(progress.updatedAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground flex flex-col gap-1 text-sm">
          <p>
            Content version <span className="text-foreground">{bundle.version}</span> · game build{" "}
            <span className="text-foreground">{bundle.gameVersion}</span>
          </p>
          <p>Unofficial fan project. Not affiliated with Activision or Infinity Ward.</p>
        </CardContent>
      </Card>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset all progress?</DialogTitle>
            <DialogDescription>
              This clears mission, item and settings progress saved in this browser. It cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={async () => {
                await store.reset();
                setConfirmReset(false);
                setMessage({ tone: "ok", text: "Progress reset." });
              }}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
