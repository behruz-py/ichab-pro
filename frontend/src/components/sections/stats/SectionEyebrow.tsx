export function SectionEyebrow({ index, label, rgb }: { index: number; label: string; rgb: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-display font-extrabold leading-none tabular-nums" style={{ fontSize: 26, color: `rgba(${rgb},0.5)` }}>
        {String(index).padStart(2, "0")}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: `rgb(${rgb})` }}>{label}</span>
      <span className="flex-1 h-px rounded-full" style={{ background: `linear-gradient(90deg, rgba(${rgb},0.5), transparent)` }} />
    </div>
  );
}
