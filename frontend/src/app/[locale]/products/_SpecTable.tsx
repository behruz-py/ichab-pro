interface Props {
  raw: string;
  title: string;
}

interface ParsedTable {
  headers: string[];
  rows: { label: string; values: string[] }[];
}

function parse(raw: string): ParsedTable | null {
  const lines = raw
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return null;

  const headers = lines[0].split("|").map(h => h.trim());
  if (headers.length < 2) return null;

  const rows = lines.slice(1).map(line => {
    const cells = line.split("|").map(c => c.trim());
    return {
      label: cells[0] ?? "",
      values: cells.slice(1),
    };
  });

  return { headers, rows };
}

export function SpecTable({ raw, title }: Props) {
  const table = parse(raw);
  if (!table) return null;

  const colCount = table.headers.length - 1; // first header = parameter column

  return (
    <div
      className="rounded-2xl overflow-hidden mb-10"
      style={{ border: "1px solid rgba(59,130,246,0.14)" }}
    >
      {/* Header */}
      <div
        className="px-6 py-4"
        style={{
          background: "rgba(59,130,246,0.06)",
          borderBottom: "1px solid rgba(59,130,246,0.14)",
        }}
      >
        <h2 className="font-display font-bold text-lg" style={{ color: "#E2EAF4" }}>
          {title}
        </h2>
      </div>

      {/* Scrollable table wrapper for mobile */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr style={{ background: "rgba(59,130,246,0.08)" }}>
              {/* Parameter column header */}
              <th
                className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: "#7B93B8", borderBottom: "1px solid rgba(59,130,246,0.14)", minWidth: "180px" }}
              >
                {table.headers[0]}
              </th>
              {/* Value column headers */}
              {table.headers.slice(1).map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: "#60A5FA", borderBottom: "1px solid rgba(59,130,246,0.14)", minWidth: "100px" }}
                >
                  {h}
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
                  style={{ color: "#7B93B8", borderBottom: "1px solid rgba(59,130,246,0.08)" }}
                >
                  {row.label}
                </td>
                {Array.from({ length: colCount }).map((_, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-3 text-sm font-semibold text-center"
                    style={{ color: "#E2EAF4", borderBottom: "1px solid rgba(59,130,246,0.08)" }}
                  >
                    {row.values[ci] ?? "—"}
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
