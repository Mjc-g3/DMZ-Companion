"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ALL = "all";

/** Select with an "All" option, used for list filters. */
export function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  allLabel = "All",
}: {
  label: string;
  value: T | typeof ALL;
  onChange: (value: T | typeof ALL) => void;
  options: readonly { value: T; label: string }[];
  allLabel?: string;
}) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as T | typeof ALL)}>
      <SelectTrigger size="sm" aria-label={label} className="min-w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
