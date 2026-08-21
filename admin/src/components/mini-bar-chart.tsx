export function MiniBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex h-40 items-end gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-32 w-full items-end">
            <div
              className="w-full rounded-t-md bg-teal"
              style={{ height: `${max > 0 ? (d.value / max) * 100 : 0}%` }}
              role="img"
              aria-label={`${d.label}: ${d.value}`}
            />
          </div>
          <span className="text-xs text-slate">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
