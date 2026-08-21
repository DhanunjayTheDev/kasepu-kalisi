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
import { useAdminEvents, useCreateMenuItem, useDeleteMenuItem, useMenuItems, useUpdateMenuItem } from "@/lib/queries";
import type { MenuItemApi } from "@/types/api";

const CATEGORIES = ["welcome_drink", "starters", "main_course", "rice", "dal", "curries", "bread", "desserts", "beverages"];
const DIETARY = ["vegetarian", "non_vegetarian", "vegan", "jain"];

interface FormValues {
  event: string;
  category: string;
  name: string;
  dietary: string;
}

export default function MenuPage() {
  const { data: items, isLoading, isError } = useMenuItems();
  const { data: events } = useAdminEvents();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItemApi | null>(null);
  const { register, handleSubmit, reset, control } = useForm<FormValues>();

  const eventTitleById = new Map(events?.map((e) => [e._id, e.title]));

  function openCreate() {
    setEditing(null);
    reset({ event: events?.[0]?._id ?? "", category: CATEGORIES[0], name: "", dietary: DIETARY[0] });
    setOpen(true);
  }

  function openEdit(item: MenuItemApi) {
    setEditing(item);
    reset({ event: item.event, category: item.category, name: item.name, dietary: item.dietary });
    setOpen(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    if (editing) await updateMenuItem.mutateAsync({ id: editing._id, ...values });
    else await createMenuItem.mutateAsync(values);
    setOpen(false);
  });

  const saving = createMenuItem.isPending || updateMenuItem.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Menu"
        description="Dinner menu items configured per gathering."
        action={
          <Button onClick={openCreate}>
            <PlusCircle size={16} /> Add Menu Item
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
            { header: "Category", accessor: (row) => row.category.replace(/_/g, " ") },
            { header: "Item", accessor: (row) => row.name },
            {
              header: "Dietary",
              accessor: (row) => (
                <Badge tone={row.dietary === "vegetarian" || row.dietary === "vegan" ? "teal" : "terracotta"}>
                  {row.dietary.replace(/_/g, " ")}
                </Badge>
              ),
            },
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
                  <ConfirmDeleteButton onConfirm={() => deleteMenuItem.mutate(row._id)} disabled={deleteMenuItem.isPending} />
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Menu Item" : "Add Menu Item"}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <SelectField
            label="Event"
            name="event"
            control={control}
            required
            options={events?.map((e) => ({ value: e._id, label: e.title })) ?? []}
          />
          <SelectField
            label="Category"
            name="category"
            control={control}
            required
            options={CATEGORIES.map((c) => ({ value: c, label: c.replace(/_/g, " ") }))}
          />
          <TextField label="Item Name" {...register("name", { required: true })} />
          <SelectField
            label="Dietary"
            name="dietary"
            control={control}
            required
            options={DIETARY.map((d) => ({ value: d, label: d.replace(/_/g, " ") }))}
          />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save Changes" : "Add Item"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
