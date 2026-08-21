import { useState } from "react";
import { Pencil, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { TextField, SelectField } from "@/components/form-field";
import { LoadingState, ErrorState } from "@/components/query-states";
import {
  useAdminEvents,
  useCreateTicketType,
  useDeleteTicketType,
  useTicketTypes,
  useUpdateTicketType,
} from "@/lib/queries";
import { statusTone, statusLabel } from "@/lib/status-tone";
import type { TicketTypeItem } from "@/types/api";

interface FormValues {
  event: string;
  name: string;
  price: number;
  capacity: number;
  status: string;
}

export default function TicketTypesPage() {
  const { data: ticketTypes, isLoading, isError } = useTicketTypes();
  const { data: events } = useAdminEvents();
  const createTicketType = useCreateTicketType();
  const updateTicketType = useUpdateTicketType();
  const deleteTicketType = useDeleteTicketType();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TicketTypeItem | null>(null);
  const { register, handleSubmit, reset, control } = useForm<FormValues>();

  const eventTitleById = new Map(events?.map((e) => [e._id, e.title]));

  function openCreate() {
    setEditing(null);
    reset({ event: events?.[0]?._id ?? "", name: "", price: 0, capacity: 0, status: "draft" });
    setOpen(true);
  }

  function openEdit(tt: TicketTypeItem) {
    setEditing(tt);
    reset({
      event: typeof tt.event === "string" ? tt.event : tt.event._id,
      name: tt.name,
      price: tt.price,
      capacity: tt.capacity,
      status: tt.status,
    });
    setOpen(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    const payload = { ...values, price: Number(values.price), capacity: Number(values.capacity) };
    if (editing) await updateTicketType.mutateAsync({ id: editing._id, ...payload });
    else await createTicketType.mutateAsync(payload);
    setOpen(false);
  });

  const saving = createTicketType.isPending || updateTicketType.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Ticket Types"
        description="Ticket categories configured across events."
        action={
          <Button onClick={openCreate}>
            <PlusCircle size={16} /> Add Ticket Type
          </Button>
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {ticketTypes && (
        <DataTable
          rows={ticketTypes}
          rowKey={(row) => row._id}
          columns={[
            { header: "Name", accessor: (row) => row.name },
            {
              header: "Event",
              accessor: (row) => (typeof row.event === "string" ? eventTitleById.get(row.event) ?? row.event : row.event.title),
            },
            { header: "Price", accessor: (row) => `₹${row.price.toLocaleString("en-IN")}` },
            { header: "Sold / Capacity", accessor: (row) => `${row.sold} / ${row.capacity}` },
            { header: "Status", accessor: (row) => <Badge tone={statusTone(row.status)}>{statusLabel(row.status)}</Badge> },
            {
              header: "",
              accessor: (row) => (
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate transition-colors hover:bg-teal/5 hover:text-teal"
                    aria-label="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <ConfirmDeleteButton onConfirm={() => deleteTicketType.mutate(row._id)} disabled={deleteTicketType.isPending} />
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Ticket Type" : "Add Ticket Type"}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <SelectField
            label="Event"
            name="event"
            control={control}
            required
            options={events?.map((e) => ({ value: e._id, label: e.title })) ?? []}
          />
          <TextField label="Name" placeholder="Standard" {...register("name", { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Price (₹)" type="number" {...register("price", { required: true, valueAsNumber: true })} />
            <TextField label="Capacity" type="number" {...register("capacity", { required: true, valueAsNumber: true })} />
          </div>
          <SelectField
            label="Status"
            name="status"
            control={control}
            options={[
              { value: "draft", label: "Draft" },
              { value: "on_sale", label: "On Sale" },
              { value: "paused", label: "Paused" },
              { value: "sold_out", label: "Sold Out" },
            ]}
          />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save Changes" : "Add Ticket Type"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
