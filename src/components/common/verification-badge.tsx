import { FlaskConical, ShieldCheck, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ContentMeta } from "@/types/content";

const LABELS = {
  mock: { label: "Mock", variant: "warning", icon: FlaskConical, hint: "Placeholder data, not from the game" },
  unverified: { label: "Unverified", variant: "secondary", icon: TriangleAlert, hint: "Sourced but not yet confirmed in game" },
  verified: { label: "Verified", variant: "success", icon: ShieldCheck, hint: "Confirmed against a trusted source" },
} as const;

export function VerificationBadge({ meta, hideVerified = true }: { meta: ContentMeta; hideVerified?: boolean }) {
  if (hideVerified && meta.verification === "verified") return null;
  const { label, variant, icon: Icon, hint } = LABELS[meta.verification];
  const sources = meta.sources.map((s) => s.label).join(", ");
  return (
    <Badge variant={variant} title={`${hint}. Source: ${sources || "none"}`}>
      <Icon aria-hidden />
      {label}
    </Badge>
  );
}
