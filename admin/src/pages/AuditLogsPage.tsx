import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAuditLogs } from "@/lib/queries";

export default function AuditLogsPage() {
  const { data: logs, isLoading, isError } = useAuditLogs();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Audit Logs" description="Every sensitive administrative action, in order." />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {logs && (
        <DataTable
          rows={logs}
          rowKey={(row) => row._id}
          columns={[
            { header: "User", accessor: (row) => (typeof row.actor === "string" ? row.actor : row.actor.name) },
            { header: "Action", accessor: (row) => row.action.replace(/_/g, " ").replace(/\./g, " · ") },
            { header: "Resource", accessor: (row) => <span className="font-mono text-xs">{row.resource}</span> },
            { header: "Timestamp", accessor: (row) => new Date(row.createdAt).toLocaleString("en-IN") },
          ]}
        />
      )}
    </div>
  );
}
