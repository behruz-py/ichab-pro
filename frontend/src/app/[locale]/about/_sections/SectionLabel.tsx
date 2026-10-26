export function SectionLabel({ index, label }: { index: number; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="font-mono text-sm font-bold tabular-nums" style={{ color: "var(--accent)" }}>
        {String(index).padStart(2, "0")}
      </span>
      <span className="h-px w-12" style={{ background: "var(--accent)" }} />
      <span className="text-xs font-bold uppercase tracking-[0.24em]" style={{ color: "var(--content-muted)" }}>{label}</span>
    </div>
  );
}
