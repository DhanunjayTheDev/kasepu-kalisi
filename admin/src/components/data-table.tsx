import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

export interface DataTableColumn<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: readonly T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, rows, rowKey, emptyMessage }: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-teal/10 bg-white">
        <EmptyState message={emptyMessage ?? "Nothing here yet."} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-teal/10 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-teal/10">
            {columns.map((col) => (
              <th
                key={col.header}
                className={cn(
                  "px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-teal/5">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="transition-colors hover:bg-ivory/60">
              {columns.map((col) => (
                <td key={col.header} className={cn("px-5 py-4 text-teal", col.className)}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
