import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { CmsEditor } from "@/components/cms-editor";
import { TextField, TextareaField } from "@/components/form-field";
import { LoadingState } from "@/components/query-states";
import { useCmsContent, useUpdateCmsContent } from "@/lib/queries";

interface FormValues {
  eyebrow: string;
  heroHeading: string;
  heroDescription: string;
  primaryCtaLabel: string;
  stats: { value: string; label: string }[];
  steps: { title: string; body: string }[];
  ctaHeading: string;
  ctaBody: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
}

const EMPTY: FormValues = {
  eyebrow: "",
  heroHeading: "",
  heroDescription: "",
  primaryCtaLabel: "",
  stats: [],
  steps: [],
  ctaHeading: "",
  ctaBody: "",
  ctaPrimaryLabel: "",
  ctaSecondaryLabel: "",
};

function SectionHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="border-t border-teal/10 pt-6 first:border-t-0 first:pt-0">
      <h2 className="text-sm font-semibold text-teal">{title}</h2>
      <p className="mt-0.5 text-xs text-slate">{hint}</p>
    </div>
  );
}

export default function CmsHomepagePage() {
  const { data, isLoading } = useCmsContent<Partial<FormValues>>("homepage");
  const updateContent = useUpdateCmsContent("homepage");
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset, control } = useForm<FormValues>({ defaultValues: EMPTY });

  const stats = useFieldArray({ control, name: "stats" });
  const steps = useFieldArray({ control, name: "steps" });

  useEffect(() => {
    if (data) reset({ ...EMPTY, ...data });
  }, [data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await updateContent.mutateAsync(values);
    setSaved(true);
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Homepage" description="Edit every block of copy on the public homepage." />
      {isLoading && <LoadingState />}
      {!isLoading && (
        <CmsEditor onSubmit={onSubmit} isPending={updateContent.isPending} isSaved={saved}>
          <SectionHeading title="Hero" hint="The first thing visitors see." />
          <TextField label="Eyebrow" {...register("eyebrow")} />
          <TextField label="Hero Heading" {...register("heroHeading")} hint="The first word stays upright; the rest is set in italic gold." />
          <TextareaField label="Hero Description" {...register("heroDescription")} />
          <TextField label="Primary CTA Label" {...register("primaryCtaLabel")} />

          <SectionHeading title="Stats Strip" hint="Numbers shown on the teal band below upcoming gatherings." />
          {stats.fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-3">
              <div className="w-32 shrink-0">
                <TextField label="Value" {...register(`stats.${index}.value`)} />
              </div>
              <div className="flex-1">
                <TextField label="Label" {...register(`stats.${index}.label`)} />
              </div>
              <button
                type="button"
                onClick={() => stats.remove(index)}
                aria-label="Remove stat"
                className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate hover:bg-terracotta/5 hover:text-terracotta"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => stats.append({ value: "", label: "" })}
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-teal hover:text-terracotta"
          >
            <Plus size={15} /> Add stat
          </button>

          <SectionHeading title="How It Works" hint="The numbered steps explaining the booking flow." />
          {steps.fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-3 rounded-xl border border-teal/10 p-4">
              <div className="flex flex-1 flex-col gap-4">
                <TextField label={`Step ${index + 1} Title`} {...register(`steps.${index}.title`)} />
                <TextareaField label="Body" {...register(`steps.${index}.body`)} />
              </div>
              <button
                type="button"
                onClick={() => steps.remove(index)}
                aria-label="Remove step"
                className="mt-7 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate hover:bg-terracotta/5 hover:text-terracotta"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => steps.append({ title: "", body: "" })}
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-teal hover:text-terracotta"
          >
            <Plus size={15} /> Add step
          </button>

          <SectionHeading title="Closing Call to Action" hint="The terracotta band just above the footer." />
          <TextField label="CTA Heading" {...register("ctaHeading")} />
          <TextareaField label="CTA Body" {...register("ctaBody")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Primary Button Label" {...register("ctaPrimaryLabel")} />
            <TextField label="Secondary Button Label" {...register("ctaSecondaryLabel")} />
          </div>
        </CmsEditor>
      )}
    </div>
  );
}
