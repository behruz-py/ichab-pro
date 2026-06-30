export function StatsBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* dotted grid, fading from the top */}
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(rgba(var(--accent-rgb),0.10) 1px, transparent 1px)",
        backgroundSize: "42px 42px",
        maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent 75%)",
        opacity: 0.5,
      }} />
      {/* slow floating colour orbs */}
      <div className="stat-orb" style={{ top: "5%", left: "3%", background: "radial-gradient(circle, rgba(56,189,248,0.20), transparent 70%)" }} />
      <div className="stat-orb" style={{ top: "38%", right: "1%", background: "radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%)", animationDelay: "-7s" }} />
      <div className="stat-orb" style={{ bottom: "5%", left: "26%", background: "radial-gradient(circle, rgba(16,185,129,0.16), transparent 70%)", animationDelay: "-14s" }} />
    </div>
  );
}
