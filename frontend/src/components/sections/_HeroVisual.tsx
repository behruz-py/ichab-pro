import { ShieldCheck, BarChart3, CalendarClock, Users, Cog, type LucideIcon } from "lucide-react";

type Loc = Record<string, string>;

interface Stat {
  Icon: LucideIcon;
  value: string;
  label: Loc;
  pos: React.CSSProperties;
}

const STATS: Stat[] = [
  { Icon: ShieldCheck,   value: "ISO 9001", label: { uz: "Sertifikatlangan", ru: "Сертифицировано", en: "Certified" },      pos: { top: "13%", left: "4%" } },
  { Icon: BarChart3,     value: "150+",     label: { uz: "Bajarilgan loyiha", ru: "Проектов",        en: "Projects done" }, pos: { top: "9%",  right: "8%" } },
  { Icon: CalendarClock, value: "25+",      label: { uz: "Yillik tajriba",    ru: "Лет опыта",        en: "Years" },         pos: { bottom: "16%", left: "8%" } },
  { Icon: Users,         value: "100+",     label: { uz: "Mutaxassis",        ru: "Специалистов",     en: "Experts" },       pos: { bottom: "11%", right: "5%" } },
];

const t = (l: Loc, locale: string) => l[locale] ?? l.uz;

export function HeroVisual({ locale }: { locale: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Connector lines — hub & spoke */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {[
          [50, 50, 16, 20], [50, 50, 84, 16], [50, 50, 20, 82], [50, 50, 86, 86],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(47,94,148,0.20)" strokeWidth="0.25"
            strokeDasharray="1.4 1.4" />
        ))}
      </svg>

      {/* Central hub — gear + concentric rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[320, 240, 160].map((d, i) => (
          <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: d, height: d, border: "1px solid rgba(47,94,148,0.12)" }} />
        ))}
        <div className="relative flex items-center justify-center rounded-3xl"
          style={{
            width: 104, height: 104,
            background: "linear-gradient(135deg, #3D72AD 0%, #2F5E94 50%, #244C77 100%)",
            boxShadow: "0 12px 40px rgba(36,76,119,0.32), inset 0 1px 0 rgba(255,255,255,0.25)",
          }}>
          <Cog size={52} color="#fff" strokeWidth={1.5} />
        </div>
      </div>

      {/* Floating stat cards */}
      {STATS.map((s, i) => {
        const Icon = s.Icon;
        return (
          <div key={i} className="absolute rounded-2xl"
            style={{
              ...s.pos,
              width: 168,
              padding: "14px 16px",
              background: "var(--card-bg)",
              border: "1px solid var(--glass-border)",
              boxShadow: "0 1px 2px rgba(15,23,42,0.05), 0 14px 34px rgba(36,76,119,0.12)",
              backdropFilter: "blur(8px)",
            }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ width: 38, height: 38, background: "rgba(47,94,148,0.10)" }}>
                <Icon size={20} color="#2F5E94" />
              </div>
              <div>
                <div className="font-display font-bold leading-none" style={{ fontSize: 20, color: "#1E293B" }}>
                  {s.value}
                </div>
                <div className="leading-tight mt-1" style={{ fontSize: 11.5, color: "#475569" }}>
                  {t(s.label, locale)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
