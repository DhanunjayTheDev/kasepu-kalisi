import { useState } from "react";
import { Pencil, PlusCircle, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { TextField, TextareaField, SelectField } from "@/components/form-field";
import { LoadingState, ErrorState } from "@/components/query-states";
import {
  useCreateTestimonial,
  useDeleteTestimonial,
  useTestimonials,
  useUpdateTestimonial,
  type TestimonialItem,
} from "@/lib/queries";
import { statusTone, statusLabel } from "@/lib/status-tone";

interface FormValues {
  name: string;
  role: string;
  city: string;
  quote: string;
  rating: string;
  eventName: string;
  status: string;
  order: number;
}

export default function CmsTestimonialsPage() {
  const { data: items, isLoading, isError } = useTestimonials();
  const createItem = useCreateTestimonial();
  const updateItem = useUpdateTestimonial();
  const deleteItem = useDeleteTestimonial();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const { register, handleSubmit, reset, control } = useForm<FormValues>();

  function openCreate() {
    setEditing(null);
    reset({ name: "", role: "", city: "", quote: "", rating: "5", eventName: "", status: "published", order: 0 });
    setOpen(true);
  }

  function openEdit(item: TestimonialItem) {
    setEditing(item);
    reset({
      name: item.name,
      role: item.role ?? "",
      city: item.city ?? "",
      quote: item.quote,
      rating: String(item.rating),
      eventName: item.eventName ?? "",
      status: item.status,
      order: item.order,
    });
    setOpen(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    const payload = { ...values, rating: Number(values.rating), order: Number(values.order) };
    if (editing) await updateItem.mutateAsync({ id: editing._id, ...payload });
    else await createItem.mutateAsync(payload);
    setOpen(false);
  });

  const saving = createItem.isPending || updateItem.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Testimonials"
        description="Guest quotes shown on the public homepage."
        action={
          <Button onClick={openCreate}>
            <PlusCircle size={16} /> Add Testimonial
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
            { header: "Guest", accessor: (row) => row.name },
            {
              header: "Quote",
              accessor: (row) => <span className="line-clamp-1 max-w-md text-slate">{row.quote}</span>,
            },
            {
              header: "Rating",
              accessor: (row) => (
                <span className="flex items-center gap-1 text-gold">
                  <Star size={13} fill="currentColor" /> {row.rating}
                </span>
              ),
            },
            { header: "Order", accessor: (row) => row.order },
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

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Testimonial" : "Add Testimonial"}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField label="Guest Name" {...register("name", { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Role" placeholder="Architect" {...register("role")} />
            <TextField label="City" placeholder="Bengaluru" {...register("city")} />
          </div>
          <TextareaField label="Quote" {...register("quote", { required: true })} />
          <TextField label="Event Name" placeholder="Kasepu Kalisi, Bengaluru" {...register("eventName")} />
          <div className="grid grid-cols-3 gap-4">
            <SelectField
              label="Rating"
              name="rating"
              control={control}
              options={[5, 4, 3, 2, 1].map((r) => ({ value: String(r), label: `${r} stars` }))}
            />
            <TextField label="Order" type="number" {...register("order", { valueAsNumber: true })} />
            <SelectField
              label="Status"
              name="status"
              control={control}
              options={[
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
              ]}
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save Changes" : "Add Testimonial"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
