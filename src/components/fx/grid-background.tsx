/** Grade sutil no fundo com marcadores "+", que some nas bordas. */
export function GridBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "104px 104px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 30%, transparent 85%)",
        }}
      />
      {[
        ["78%", "22%"],
        ["90%", "58%"],
        ["12%", "70%"],
        ["64%", "86%"],
      ].map(([left, top]) => (
        <span key={left + top} className="absolute font-mono text-2xl font-light text-muted/40" style={{ left, top }}>
          +
        </span>
      ))}
    </div>
  );
}
