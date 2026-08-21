import { useState } from "react";
import { Pencil, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { TextField, TextareaField } from "@/components/form-field";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useCreateFaqItem, useDeleteFaqItem, useFaqItems, useUpdateFaqItem, type FaqItemApi } from "@/lib/queries";

interface FormValues {
  question: string;
  answer: string;
}

export default function CmsFaqPage() {
  const { data: items, isLoading, isError } = useFaqItems();
  const createFaq = useCreateFaqItem();
  const updateFaq = useUpdateFaqItem();
  const deleteFaq = useDeleteFaqItem();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FaqItemApi | null>(null);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  function openCreate() {
    setEditing(null);
    reset({ question: "", answer: "" });
    setOpen(true);
  }

  function openEdit(item: FaqItemApi) {
    setEditing(item);
    reset({ question: item.question, answer: item.answer });
    setOpen(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    if (editing) await updateFaq.mutateAsync({ id: editing._id, ...values });
    else await createFaq.mutateAsync(values);
    setOpen(false);
  });

  const saving = createFaq.isPending || updateFaq.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="FAQ"
        description="Questions shown on the public Help Center."
        action={
          <Button onClick={openCreate}>
            <PlusCircle size={16} /> Add Question
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
            { header: "Question", accessor: (row) => row.question },
            { header: "Answer", accessor: (row) => <span className="line-clamp-1 text-slate">{row.answer}</span> },
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
                  <ConfirmDeleteButton onConfirm={() => deleteFaq.mutate(row._id)} disabled={deleteFaq.isPending} />
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Question" : "Add FAQ Question"}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField label="Question" {...register("question", { required: true })} />
          <TextareaField label="Answer" {...register("answer", { required: true })} />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save Changes" : "Add Question"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
