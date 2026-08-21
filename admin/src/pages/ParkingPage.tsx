import { useState } from "react";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { TextField, SelectField, TextareaField } from "@/components/form-field";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminEvents, useUpdateEvent } from "@/lib/queries";
import type { EventItem } from "@/types/api";

interface FormValues {
  parkingAvailable: string;
  parkingCapacity: number;
  parkingFee: number;
  parkingInstructions?: string;
}

export default function ParkingPage() {
  const { data: events, isLoading, isError } = useAdminEvents();
  const updateEvent = useUpdateEvent();
  const [editing, setEditing] = useState<EventItem | null>(null);
  const { register, handleSubmit, reset, control } = useForm<FormValues>();

  function openEdit(event: EventItem) {
    setEditing(event);
    reset({
      parkingAvailable: event.venue.parkingAvailable ? "true" : "false",
      parkingCapacity: event.venue.parkingCapacity ?? 0,
      parkingFee: event.venue.parkingFee ?? 0,
      parkingInstructions: event.venue.parkingInstructions ?? "",
    });
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!editing) return;
    await updateEvent.mutateAsync({
      id: editing._id,
      venue: {
        ...editing.venue,
        parkingAvailable: values.parkingAvailable === "true",
        parkingCapacity: Number(values.parkingCapacity),
        parkingFee: Number(values.parkingFee),
        parkingInstructions: values.parkingInstructions,
      },
    });
    setEditing(null);
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Parking" description="Parking availability configured per gathering." />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {events && (
        <DataTable
          rows={events}
          rowKey={(row) => row._id}
          columns={[
            { header: "Event", accessor: (row) => row.title },
            {
              header: "Available",
              accessor: (row) => (
                <Badge tone={row.venue.parkingAvailable ? "teal" : "slate"}>
                  {row.venue.parkingAvailable ? "Yes" : "No"}
                </Badge>
              ),
            },
            { header: "Capacity", accessor: (row) => row.venue.parkingCapacity ?? 0 },
            { header: "Fee", accessor: (row) => (row.venue.parkingFee ? `₹${row.venue.parkingFee}` : "—") },
            {
              header: "",
              accessor: (row) => (
                <Button variant="outline" className="text-xs" onClick={() => openEdit(row)}>
                  <Pencil size={13} /> Edit
                </Button>
              ),
            },
          ]}
        />
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={`Parking — ${editing?.title ?? ""}`}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <SelectField
            label="Available"
            name="parkingAvailable"
            control={control}
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Capacity" type="number" {...register("parkingCapacity", { valueAsNumber: true })} />
            <TextField label="Fee (₹)" type="number" {...register("parkingFee", { valueAsNumber: true })} />
          </div>
          <TextareaField label="Instructions" {...register("parkingInstructions")} />
          <Button type="submit" disabled={updateEvent.isPending}>
            {updateEvent.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
