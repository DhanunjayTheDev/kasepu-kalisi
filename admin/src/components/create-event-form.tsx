import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/button";
import { TextField, TextareaField, SelectField } from "@/components/form-field";
import { useCreateEvent, useUpdateEvent } from "@/lib/queries";
import { ApiError } from "@/lib/api-client";
import type { EventItem } from "@/types/api";

const schema = z.object({
  title: z.string().min(3, "Enter an event title"),
  slug: z
    .string()
    .min(3, "Enter a slug")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  city: z.string().min(2, "Enter a city"),
  venueName: z.string().min(2, "Enter a venue name"),
  venueAddress: z.string().min(5, "Enter a venue address"),
  date: z.string().min(1, "Pick a date"),
  status: z.enum(["draft", "published", "registration_open"]),
  description: z.string().min(10, "Add a short description"),
});

type FormValues = z.infer<typeof schema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CreateEventForm({ event }: { event?: EventItem }) {
  const navigate = useNavigate();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, touchedFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: event
      ? {
          title: event.title,
          slug: event.slug,
          city: event.city,
          venueName: event.venue.name,
          venueAddress: event.venue.address,
          date: event.date.slice(0, 10),
          status: event.status as FormValues["status"],
          description: event.description ?? "",
        }
      : { status: "draft" },
  });

  const title = watch("title");
  useEffect(() => {
    if (!event && !touchedFields.slug && title) setValue("slug", slugify(title));
  }, [event, title, touchedFields.slug, setValue]);

  const mutation = event ? updateEvent : createEvent;

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      title: values.title,
      slug: values.slug,
      city: values.city,
      date: values.date,
      status: values.status,
      description: values.description,
      venue: { name: values.venueName, address: values.venueAddress, city: values.city },
    };
    if (event) await updateEvent.mutateAsync({ id: event._id, ...payload });
    else await createEvent.mutateAsync(payload);
    navigate("/events");
  });

  return (
    <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-5 rounded-2xl border border-teal/10 bg-white p-6">
      <TextField label="Event Title" {...register("title")} error={errors.title?.message} />
      <TextField label="URL Slug" {...register("slug")} error={errors.slug?.message} hint="Used in the public event URL" />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="City" {...register("city")} error={errors.city?.message} />
        <TextField label="Venue Name" {...register("venueName")} error={errors.venueName?.message} />
      </div>
      <TextField label="Venue Address" {...register("venueAddress")} error={errors.venueAddress?.message} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Date" type="date" {...register("date")} error={errors.date?.message} />
        <SelectField
          label="Status"
          name="status"
          control={control}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "registration_open", label: "Registration Open" },
          ]}
        />
      </div>
      <TextareaField label="Description" {...register("description")} error={errors.description?.message} />
      {mutation.isError && (
        <p className="text-xs font-medium text-terracotta">
          {mutation.error instanceof ApiError ? mutation.error.message : "Couldn't save the event."}
        </p>
      )}
      <Button type="submit" disabled={mutation.isPending} className="self-start">
        {mutation.isPending ? "Saving…" : event ? "Save Changes" : "Create Event"}
      </Button>
    </form>
  );
}
