import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminUsers } from "@/lib/queries";

export default function UsersAttendeesPage() {
  const { data: users, isLoading, isError } = useAdminUsers();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Attendees" description="Registered attendee accounts across Kasepu Kalisi." />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {users && (
        <DataTable
          rows={users}
          rowKey={(row) => row._id}
          columns={[
            { header: "Name", accessor: (row) => row.fullName },
            { header: "Mobile", accessor: (row) => row.mobile },
            { header: "Email", accessor: (row) => row.email ?? "—" },
          ]}
        />
      )}
    </div>
  );
}
