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
import { useCoupons, useCreateCoupon, useDeleteCoupon, useUpdateCoupon } from "@/lib/queries";
import type { CouponItem } from "@/types/api";

interface FormValues {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  active: string;
}

export default function CouponsPage() {
  const { data: coupons, isLoading, isError } = useCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CouponItem | null>(null);
  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: { type: "percentage", active: "true" },
  });

  function openCreate() {
    setEditing(null);
    reset({ code: "", type: "percentage", value: 0, active: "true" });
    setOpen(true);
  }

  function openEdit(coupon: CouponItem) {
    setEditing(coupon);
    reset({ code: coupon.code, type: coupon.type, value: coupon.value, active: coupon.active ? "true" : "false" });
    setOpen(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    const payload = { code: values.code, type: values.type, value: Number(values.value), active: values.active === "true" };
    if (editing) await updateCoupon.mutateAsync({ id: editing._id, ...payload });
    else await createCoupon.mutateAsync(payload);
    setOpen(false);
  });

  const saving = createCoupon.isPending || updateCoupon.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Coupons"
        description="Discount codes — validated server-side at checkout."
        action={
          <Button onClick={openCreate}>
            <PlusCircle size={16} /> Create Coupon
          </Button>
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {coupons && (
        <DataTable
          rows={coupons}
          rowKey={(row) => row._id}
          columns={[
            { header: "Code", accessor: (row) => <span className="font-mono font-semibold">{row.code}</span> },
            { header: "Value", accessor: (row) => (row.type === "percentage" ? `${row.value}%` : `₹${row.value}`) },
            { header: "Usage", accessor: (row) => `${row.usageCount} / ${row.usageLimit ?? "∞"}` },
            { header: "Status", accessor: (row) => <Badge tone={row.active ? "teal" : "slate"}>{row.active ? "active" : "inactive"}</Badge> },
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
                  <ConfirmDeleteButton onConfirm={() => deleteCoupon.mutate(row._id)} disabled={deleteCoupon.isPending} />
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Coupon" : "Create Coupon"}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField label="Code" placeholder="WELCOME10" {...register("code", { required: true })} />
          <SelectField
            label="Type"
            name="type"
            control={control}
            required
            options={[
              { value: "percentage", label: "Percentage" },
              { value: "fixed", label: "Fixed Amount" },
            ]}
          />
          <TextField label="Value" type="number" {...register("value", { required: true, valueAsNumber: true })} />
          <SelectField
            label="Status"
            name="active"
            control={control}
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
          />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save Changes" : "Create Coupon"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
