import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { SelectField, TextField, TextareaField } from "@/components/form-field";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminEvents, useAnnouncements, useCreateAnnouncement } from "@/lib/queries";
import { statusTone, statusLabel } from "@/lib/status-tone";
import type { EventItem } from "@/types/api";

interface FormValues {
  event: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high";
  notify: boolean;
}

export default function AnnouncementsPage() {
  const { data: announcements, isLoading, isError } = useAnnouncements();
  const { data: events } = useAdminEvents();
  const createAnnouncement = useCreateAnnouncement();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: { event: "", priority: "normal", notify: true },
  });

  const onSubmit = handleSubmit(async (values) => {
    await createAnnouncement.mutateAsync(values);
    reset();
    setOpen(false);
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Announcements"
        description="Push live updates to attendees during a gathering."
        action={
          <Button onClick={() => setOpen(true)}>
            <PlusCircle size={16} /> New Announcement
          </Button>
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {announcements && (
        <DataTable
          rows={announcements}
          rowKey={(row) => row._id}
          columns={[
            { header: "Title", accessor: (row) => row.title },
            { header: "Event", accessor: (row) => (row.event as EventItem)?.title ?? "—" },
            { header: "Priority", accessor: (row) => <Badge tone={statusTone(row.priority)}>{statusLabel(row.priority)}</Badge> },
            { header: "Status", accessor: (row) => <Badge tone={statusTone(row.status)}>{statusLabel(row.status)}</Badge> },
          ]}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New Announcement">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <SelectField
            label="Event"
            name="event"
            control={control}
            required
            options={events?.map((e) => ({ value: e._id, label: e.title })) ?? []}
          />
          <TextField label="Title" {...register("title", { required: true })} />
          <TextareaField label="Content" {...register("content", { required: true })} />
          <SelectField
            label="Priority"
            name="priority"
            control={control}
            options={[
              { value: "low", label: "Low" },
              { value: "normal", label: "Normal" },
              { value: "high", label: "High" },
            ]}
          />
          <label className="flex items-center gap-2 text-sm text-slate">
            <input type="checkbox" className="accent-terracotta" {...register("notify")} />
            Notify attendees by email &amp; WhatsApp
          </label>
          <Button type="submit" disabled={createAnnouncement.isPending}>
            {createAnnouncement.isPending ? "Publishing…" : "Publish Announcement"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
