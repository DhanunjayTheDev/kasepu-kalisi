import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminEvents, useTicketTypes } from "@/lib/queries";

export default function InventoryPage() {
  const { data: ticketTypes, isLoading, isError } = useTicketTypes();
  const { data: events } = useAdminEvents();
  const eventTitleById = new Map(events?.map((e) => [e._id, e.title]));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inventory"
        description="Live ticket inventory — reservations expire automatically, capacity never goes negative."
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {ticketTypes && (
        <DataTable
          rows={ticketTypes}
          rowKey={(row) => row._id}
          columns={[
            {
              header: "Ticket Type",
              accessor: (row) => `${row.name} — ${eventTitleById.get(row.event as string) ?? ""}`,
            },
            { header: "Capacity", accessor: (row) => row.capacity },
            { header: "Reserved", accessor: (row) => row.reserved },
            { header: "Sold", accessor: (row) => row.sold },
            {
              header: "Available",
              accessor: (row) => (
                <span className="font-semibold">{row.available ?? row.capacity - row.sold - row.reserved}</span>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
