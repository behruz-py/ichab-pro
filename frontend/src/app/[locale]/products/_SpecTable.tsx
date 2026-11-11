import type { VariantTable } from "@/types/api";

// The sticky parameter column needs an opaque fill so values scrolling under it
// don't show through; these reproduce the row tints over the page surface.
const SURFACE = "rgb(var(--surface-rgb))";
const STICKY_HEAD = `linear-gradient(rgba(var(--accent-rgb),0.08), rgba(var(--accent-rgb),0.08)), ${SURFACE}`;
const STICKY_EVEN = `linear-gradient(rgba(var(--accent-rgb),0.04), rgba(var(--accent-rgb),0.04)), ${SURFACE}`;
const STICKY_ODD = SURFACE;

interface Props {
  table: VariantTable;
  title: string;
  paramHeader: string;
}

export function SpecTable({ table, title, paramHeader }: Props) {
  if (!table.variants.length || !table.rows.length) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden mb-10"
      style={{ border: "1px solid rgba(var(--accent-rgb),0.14)" }}
    >
      <div
        className="px-4 sm:px-6 py-4"
        style={{
          background: "rgba(var(--accent-rgb),0.06)",
          borderBottom: "1px solid rgba(var(--accent-rgb),0.14)",
        }}
      >
        <h2 className="font-display font-bold text-lg" style={{ color: "var(--content)" }}>
          {title}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr style={{ background: "rgba(var(--accent-rgb),0.08)" }}>
              <th
                className="sticky left-0 z-10 px-3 sm:px-5 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[7rem] sm:min-w-[14rem]"
                style={{ color: "var(--content-secondary)", borderBottom: "1px solid rgba(var(--accent-rgb),0.14)", background: STICKY_HEAD }}
              >
                {paramHeader}
              </th>
              {table.variants.map((code, i) => (
                <th
                  key={i}
                  className="px-1.5 sm:px-4 py-3 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap min-w-[3.75rem] sm:min-w-[6.5rem]"
                  style={{ color: "var(--accent)", borderBottom: "1px solid rgba(var(--accent-rgb),0.14)" }}
                >
                  {code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr
                key={ri}
                style={{ background: ri % 2 === 0 ? "rgba(var(--accent-rgb),0.04)" : "transparent" }}
              >
                <td
                  className="sticky left-0 z-10 px-3 sm:px-5 py-3 text-[13px] sm:text-sm font-medium leading-snug"
                  style={{ color: "var(--content-secondary)", borderBottom: "1px solid rgba(var(--accent-rgb),0.08)", background: ri % 2 === 0 ? STICKY_EVEN : STICKY_ODD }}
                >
                  {row.label}
                  {row.unit ? <span style={{ color: "var(--content-muted)" }}>, {row.unit}</span> : null}
                </td>
                {table.variants.map((_, ci) => (
                  <td
                    key={ci}
                    className="px-1.5 sm:px-4 py-3 text-[13px] sm:text-sm font-semibold text-center whitespace-nowrap"
                    style={{ color: "var(--content)", borderBottom: "1px solid rgba(var(--accent-rgb),0.08)" }}
                  >
                    {row.values[ci]?.trim() ? row.values[ci] : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
