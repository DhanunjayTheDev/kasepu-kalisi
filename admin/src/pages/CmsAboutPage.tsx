import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { CmsEditor } from "@/components/cms-editor";
import { TextField, TextareaField } from "@/components/form-field";
import { LoadingState } from "@/components/query-states";
import { useCmsContent, useUpdateCmsContent } from "@/lib/queries";

interface FormValues {
  heading: string;
  beliefStatement: string;
}

export default function CmsAboutPage() {
  const { data, isLoading } = useCmsContent<FormValues>("about");
  const updateContent = useUpdateCmsContent("about");
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await updateContent.mutateAsync(values);
    setSaved(true);
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="About" description="Edit the public About page copy." />
      {isLoading && <LoadingState />}
      {!isLoading && (
        <CmsEditor onSubmit={onSubmit} isPending={updateContent.isPending} isSaved={saved}>
          <TextField label="Heading" {...register("heading")} />
          <TextareaField label="Belief Statement" {...register("beliefStatement")} />
        </CmsEditor>
      )}
    </div>
  );
}
