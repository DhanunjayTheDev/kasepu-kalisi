import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { CmsEditor } from "@/components/cms-editor";
import { TextField } from "@/components/form-field";
import { LoadingState } from "@/components/query-states";
import { useSettings, useUpdateSettings } from "@/lib/queries";

interface FormValues {
  businessName: string;
  supportEmail: string;
  clientUrl: string;
  adminUrl: string;
}

export default function GeneralSettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (settings) reset(settings.general);
  }, [settings, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await updateSettings.mutateAsync({ general: values });
    setSaved(true);
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="General" description="Organization details used across the platform." />
      {isLoading && <LoadingState />}
      {!isLoading && (
        <CmsEditor onSubmit={onSubmit} isPending={updateSettings.isPending} isSaved={saved} note="Saved to platform settings.">
          <TextField label="Business Name" {...register("businessName")} />
          <TextField label="Support Email" {...register("supportEmail")} />
          <TextField label="Client URL" {...register("clientUrl")} />
          <TextField label="Admin URL" {...register("adminUrl")} />
        </CmsEditor>
      )}
    </div>
  );
}
