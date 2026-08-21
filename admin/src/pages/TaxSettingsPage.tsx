import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { CmsEditor } from "@/components/cms-editor";
import { TextField } from "@/components/form-field";
import { LoadingState } from "@/components/query-states";
import { useSettings, useUpdateSettings } from "@/lib/queries";

interface FormValues {
  gstin: string;
  invoicePrefix: string;
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
}

export default function TaxSettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (settings) reset(settings.tax);
  }, [settings, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await updateSettings.mutateAsync({
      tax: {
        ...values,
        cgstPercent: Number(values.cgstPercent),
        sgstPercent: Number(values.sgstPercent),
        igstPercent: Number(values.igstPercent),
      },
    });
    setSaved(true);
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Tax" description="GST configuration applied to bookings and invoices." />
      {isLoading && <LoadingState />}
      {!isLoading && (
        <CmsEditor onSubmit={onSubmit} isPending={updateSettings.isPending} isSaved={saved} note="Applied to all future invoices.">
          <TextField label="GSTIN" {...register("gstin")} />
          <TextField label="Invoice Prefix" {...register("invoicePrefix")} />
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField label="CGST %" type="number" step="0.1" {...register("cgstPercent", { valueAsNumber: true })} />
            <TextField label="SGST %" type="number" step="0.1" {...register("sgstPercent", { valueAsNumber: true })} />
            <TextField label="IGST %" type="number" step="0.1" {...register("igstPercent", { valueAsNumber: true })} />
          </div>
        </CmsEditor>
      )}
    </div>
  );
}
