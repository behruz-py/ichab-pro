import type { VariantTable } from "@/types/api";

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
        className="px-6 py-4"
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
        <table className="w-full min-w-max">
          <thead>
            <tr style={{ background: "rgba(var(--accent-rgb),0.08)" }}>
              <th
                className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--content-secondary)", borderBottom: "1px solid rgba(var(--accent-rgb),0.14)", minWidth: "200px" }}
              >
                {paramHeader}
              </th>
              {table.variants.map((code, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: "var(--accent)", borderBottom: "1px solid rgba(var(--accent-rgb),0.14)", minWidth: "100px" }}
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
                  className="px-5 py-3 text-sm font-medium"
                  style={{ color: "var(--content-secondary)", borderBottom: "1px solid rgba(var(--accent-rgb),0.08)" }}
                >
                  {row.label}
                  {row.unit ? <span style={{ color: "var(--content-muted)" }}>, {row.unit}</span> : null}
                </td>
                {table.variants.map((_, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-3 text-sm font-semibold text-center"
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
