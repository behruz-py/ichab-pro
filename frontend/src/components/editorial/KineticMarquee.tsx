// Literal class names so Tailwind generates them; `motion-reduce:animate-none`
// can only override an animation set by a class, not an inline style.
const FORWARD = "animate-[marquee_48s_linear_infinite]";
const BACKWARD = "animate-[marquee-reverse_60s_linear_infinite]";

function Row({ words, reverse }: { words: string[]; reverse?: boolean }) {
  // Two identical halves; the shared `marquee` keyframes slide by -50% for a seamless loop.
  const items = [...words, ...words];
  return (
    <div className={`flex w-max motion-reduce:animate-none ${reverse ? BACKWARD : FORWARD}`}>
      {items.map((w, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span className="font-display font-bold uppercase whitespace-nowrap px-6 sm:px-10 leading-none tracking-tight"
            style={i % 2
              ? { background: "var(--hero-accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }
              : { WebkitTextStroke: "1.5px var(--content-muted)", WebkitTextFillColor: "transparent", color: "transparent" }}>
            {w}
          </span>
          <span aria-hidden style={{ color: "var(--accent)", fontSize: "0.4em" }}>✦</span>
        </span>
      ))}
    </div>
  );
}

/** Oversized kinetic type band — outline / gradient words drifting in opposite directions. */
export function KineticMarquee({ words }: { words: string[] }) {
  return (
    <section aria-hidden className="relative overflow-hidden py-10 sm:py-14 select-none"
      style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div style={{ fontSize: "clamp(44px, 7.5vw, 120px)" }}><Row words={words} /></div>
      <div className="mt-3 sm:mt-5 opacity-60" style={{ fontSize: "clamp(28px, 4.2vw, 64px)" }}><Row words={[...words].reverse()} reverse /></div>
    </section>
  );
}

export const MARQUEE_WORDS: Record<string, string[]> = {
  uz: ["ASUTP", "SCADA", "ASODU", "Metrologiya", "Avtomatika", "Lokalizatsiya", "Kalit taslim", "Raqamlashtirish"],
  ru: ["АСУТП", "SCADA", "АСОДУ", "Метрология", "Автоматика", "Локализация", "Под ключ", "Цифровизация"],
  en: ["APCS", "SCADA", "ASODU", "Metrology", "Automation", "Localization", "Turnkey", "Digitalization"],
};
