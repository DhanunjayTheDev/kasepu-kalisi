import { useState } from "react";
import { Pencil, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { TextField, SelectField, TextareaField } from "@/components/form-field";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminEvents, useCreateSchedule, useDeleteSchedule, useSchedules, useUpdateSchedule } from "@/lib/queries";
import type { ScheduleItemApi } from "@/types/api";

interface FormValues {
  event: string;
  time: string;
  title: string;
  description?: string;
}

export default function SchedulesPage() {
  const { data: items, isLoading, isError } = useSchedules();
  const { data: events } = useAdminEvents();
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ScheduleItemApi | null>(null);
  const { register, handleSubmit, reset, control } = useForm<FormValues>();

  const eventTitleById = new Map(events?.map((e) => [e._id, e.title]));

  function openCreate() {
    setEditing(null);
    reset({ event: events?.[0]?._id ?? "", time: "", title: "", description: "" });
    setOpen(true);
  }

  function openEdit(item: ScheduleItemApi) {
    setEditing(item);
    reset({ event: item.event, time: item.time, title: item.title, description: item.description ?? "" });
    setOpen(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    if (editing) await updateSchedule.mutateAsync({ id: editing._id, ...values });
    else await createSchedule.mutateAsync(values);
    setOpen(false);
  });

  const saving = createSchedule.isPending || updateSchedule.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Schedules"
        description="Timeline of activities for each gathering."
        action={
          <Button onClick={openCreate}>
            <PlusCircle size={16} /> Add Schedule Item
          </Button>
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {items && (
        <DataTable
          rows={items}
          rowKey={(row) => row._id}
          columns={[
            { header: "Event", accessor: (row) => eventTitleById.get(row.event) ?? row.event },
            { header: "Time", accessor: (row) => row.time },
            { header: "Item", accessor: (row) => row.title },
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
                  <ConfirmDeleteButton onConfirm={() => deleteSchedule.mutate(row._id)} disabled={deleteSchedule.isPending} />
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Schedule Item" : "Add Schedule Item"}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <SelectField
            label="Event"
            name="event"
            control={control}
            required
            options={events?.map((e) => ({ value: e._id, label: e.title })) ?? []}
          />
          <TextField label="Time" placeholder="6:00 PM" {...register("time", { required: true })} />
          <TextField label="Title" {...register("title", { required: true })} />
          <TextareaField label="Description (optional)" {...register("description")} />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save Changes" : "Add Item"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
