import { useState } from "react";
import { Pencil, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { TextField, SelectField, TextareaField } from "@/components/form-field";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminEvents, useArtists, useCreateArtist, useDeleteArtist, useUpdateArtist } from "@/lib/queries";
import { statusTone, statusLabel } from "@/lib/status-tone";
import type { ArtistItem } from "@/types/api";

interface FormValues {
  event: string;
  name: string;
  genre?: string;
  performanceTime?: string;
  bio?: string;
  photoUrl?: string;
  videoUrl?: string;
  status: string;
}

export default function ArtistsPage() {
  const { data: artists, isLoading, isError } = useArtists();
  const { data: events } = useAdminEvents();
  const createArtist = useCreateArtist();
  const updateArtist = useUpdateArtist();
  const deleteArtist = useDeleteArtist();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ArtistItem | null>(null);
  const { register, handleSubmit, reset, control } = useForm<FormValues>();

  const eventTitleById = new Map(events?.map((e) => [e._id, e.title]));

  function openCreate() {
    setEditing(null);
    reset({
      event: events?.[0]?._id ?? "",
      name: "",
      genre: "",
      performanceTime: "",
      bio: "",
      photoUrl: "",
      videoUrl: "",
      status: "confirmed",
    });
    setOpen(true);
  }

  function openEdit(artist: ArtistItem) {
    setEditing(artist);
    reset({
      event: artist.event,
      name: artist.name,
      genre: artist.genre ?? "",
      performanceTime: artist.performanceTime ?? "",
      bio: artist.bio ?? "",
      photoUrl: artist.photoUrl ?? "",
      videoUrl: artist.videoUrl ?? "",
      status: artist.status,
    });
    setOpen(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    if (editing) await updateArtist.mutateAsync({ id: editing._id, ...values });
    else await createArtist.mutateAsync(values);
    setOpen(false);
  });

  const saving = createArtist.isPending || updateArtist.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Artists"
        description="Performers booked across gatherings."
        action={
          <Button onClick={openCreate}>
            <PlusCircle size={16} /> Add Artist
          </Button>
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {artists && (
        <DataTable
          rows={artists}
          rowKey={(row) => row._id}
          columns={[
            { header: "Artist", accessor: (row) => row.name },
            { header: "Genre", accessor: (row) => row.genre ?? "—" },
            { header: "Event", accessor: (row) => eventTitleById.get(row.event) ?? row.event },
            { header: "Performance Time", accessor: (row) => row.performanceTime ?? "—" },
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
                  <ConfirmDeleteButton onConfirm={() => deleteArtist.mutate(row._id)} disabled={deleteArtist.isPending} />
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Artist" : "Add Artist"}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <SelectField
            label="Event"
            name="event"
            control={control}
            required
            options={events?.map((e) => ({ value: e._id, label: e.title })) ?? []}
          />
          <TextField label="Name" {...register("name", { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Genre" {...register("genre")} />
            <TextField label="Performance Time" placeholder="7:15 PM" {...register("performanceTime")} />
          </div>
          <SelectField
            label="Status"
            name="status"
            control={control}
            options={[
              { value: "pending", label: "Pending" },
              { value: "confirmed", label: "Confirmed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
          <TextField
            label="Photo URL (optional)"
            placeholder="https://…"
            {...register("photoUrl")}
            hint="Shown on the public gathering page. Leave blank to use a stock portrait."
          />
          <TextField label="Video URL (optional)" placeholder="https://… .mp4" {...register("videoUrl")} />
          <TextareaField label="Bio (optional)" {...register("bio")} />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save Changes" : "Add Artist"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
