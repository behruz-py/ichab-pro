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
      style={{ border: "1px solid rgba(47,94,148,0.14)" }}
    >
      <div
        className="px-6 py-4"
        style={{
          background: "rgba(47,94,148,0.06)",
          borderBottom: "1px solid rgba(47,94,148,0.14)",
        }}
      >
        <h2 className="font-display font-bold text-lg" style={{ color: "#1E293B" }}>
          {title}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr style={{ background: "rgba(47,94,148,0.08)" }}>
              <th
                className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: "#475569", borderBottom: "1px solid rgba(47,94,148,0.14)", minWidth: "200px" }}
              >
                {paramHeader}
              </th>
              {table.variants.map((code, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: "#2F5E94", borderBottom: "1px solid rgba(47,94,148,0.14)", minWidth: "100px" }}
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
                style={{ background: ri % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
              >
                <td
                  className="px-5 py-3 text-sm font-medium"
                  style={{ color: "#475569", borderBottom: "1px solid rgba(47,94,148,0.08)" }}
                >
                  {row.label}
                  {row.unit ? <span style={{ color: "#94A3B8" }}>, {row.unit}</span> : null}
                </td>
                {table.variants.map((_, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-3 text-sm font-semibold text-center"
                    style={{ color: "#1E293B", borderBottom: "1px solid rgba(47,94,148,0.08)" }}
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
