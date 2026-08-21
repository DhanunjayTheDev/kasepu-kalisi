import { useState } from "react";
import { Pencil, UploadCloud } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { TextField, SelectField } from "@/components/form-field";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useAdminEvents, useCreateGalleryItem, useDeleteGalleryItem, useGalleryItems, useUpdateGalleryItem } from "@/lib/queries";
import { statusTone, statusLabel } from "@/lib/status-tone";
import type { GalleryItemApi } from "@/types/api";

interface FormValues {
  event: string;
  album: string;
  type: "image" | "video";
  url: string;
  status: string;
}

export default function GalleryAdminPage() {
  const { data: items, isLoading, isError } = useGalleryItems();
  const { data: events } = useAdminEvents();
  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem();
  const deleteItem = useDeleteGalleryItem();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItemApi | null>(null);
  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: { type: "image", status: "published" },
  });

  const eventTitleById = new Map(events?.map((e) => [e._id, e.title]));

  function openCreate() {
    setEditing(null);
    reset({ event: events?.[0]?._id ?? "", album: "", type: "image", url: "", status: "published" });
    setOpen(true);
  }

  function openEdit(item: GalleryItemApi) {
    setEditing(item);
    reset({ event: item.event, album: item.album, type: item.type, url: item.url, status: item.status });
    setOpen(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    if (editing) await updateItem.mutateAsync({ id: editing._id, ...values });
    else await createItem.mutateAsync(values);
    setOpen(false);
  });

  const saving = createItem.isPending || updateItem.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gallery"
        description="Photo and video albums per gathering."
        action={
          <Button onClick={openCreate}>
            <UploadCloud size={16} /> Add Media
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
            { header: "Album", accessor: (row) => row.album },
            { header: "Type", accessor: (row) => row.type },
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
                  <ConfirmDeleteButton onConfirm={() => deleteItem.mutate(row._id)} disabled={deleteItem.isPending} />
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Media" : "Add Media"}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <SelectField
            label="Event"
            name="event"
            control={control}
            required
            options={events?.map((e) => ({ value: e._id, label: e.title })) ?? []}
          />
          <TextField label="Album" placeholder="2026 Gathering" {...register("album", { required: true })} />
          <SelectField
            label="Type"
            name="type"
            control={control}
            required
            options={[
              { value: "image", label: "Image" },
              { value: "video", label: "Video" },
            ]}
          />
          <TextField
            label="Media URL"
            placeholder="https://…"
            {...register("url", { required: true })}
            hint="Direct GCS upload lands here once storage is configured."
          />
          <SelectField
            label="Status"
            name="status"
            control={control}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
            ]}
          />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save Changes" : "Add Media"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
