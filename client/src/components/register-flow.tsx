import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/button";
import { Stepper } from "@/components/stepper";
import { TextField, SelectField, TextareaField } from "@/components/form-field";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useCreateBooking, useEvent, useEvents, useTicketTypes } from "@/lib/queries";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";

const STEPS = ["Personal", "Tickets", "Attendees", "Preferences", "Review"];

const attendeeSchema = z.object({
  name: z.string().min(2, "Enter full name"),
  age: z.number().min(1, "Enter age").max(120, "Enter a valid age"),
  gender: z.enum(["male", "female", "other"]),
});

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email"),
  gender: z.enum(["male", "female", "other"]),
  age: z.number().min(1, "Enter age").max(120, "Enter a valid age"),
  city: z.string().min(2, "Enter your city"),
  ticketTypeId: z.string().min(1, "Select a ticket type"),
  quantity: z.number().min(1).max(6),
  attendees: z.array(attendeeSchema),
  dietaryPreference: z.enum(["vegetarian", "non_vegetarian", "vegan", "jain"]),
  specialRequirements: z.string().optional(),
  photoConsent: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const STEP_FIELDS: (keyof FormValues)[][] = [
  ["fullName", "mobile", "email", "gender", "age", "city"],
  ["ticketTypeId", "quantity"],
  ["attendees"],
  ["dietaryPreference", "photoConsent"],
  [],
];

export function RegisterFlow() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const slugParam = searchParams.get("event") ?? undefined;
  const { data: events, isLoading: eventsLoading } = useEvents();
  const fallbackSlug = events?.find((e) => e.status === "registration_open")?.slug ?? events?.[0]?.slug;
  const slug = slugParam ?? fallbackSlug;

  const { data: event, isLoading: eventLoading, isError } = useEvent(slug);
  const { data: ticketTypes } = useTicketTypes(event?._id);
  const createBooking = useCreateBooking();

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      mobile: user?.mobile ?? "",
      email: user?.email ?? "",
      gender: "female",
      quantity: 1,
      attendees: [{ name: "", age: 18, gender: "female" }],
      dietaryPreference: "vegetarian",
      photoConsent: true,
    },
  });

  const { fields, replace } = useFieldArray({ control, name: "attendees" });

  const quantity = watch("quantity");
  const ticketTypeId = watch("ticketTypeId");
  const selectedTicket = ticketTypes?.find((t) => t._id === ticketTypeId);

  useEffect(() => {
    if (ticketTypes && ticketTypes.length > 0 && !ticketTypeId) {
      setValue("ticketTypeId", ticketTypes[0]._id);
    }
  }, [ticketTypes, ticketTypeId, setValue]);

  useEffect(() => {
    const current = fields.length;
    const target = Number(quantity) || 1;
    if (target === current) return;
    const next = Array.from({ length: target }, (_, i) => fields[i] ?? { name: "", age: 18, gender: "female" as const });
    replace(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity]);

  if (eventsLoading || eventLoading) {
    return <LoadingState label="Loading gathering…" />;
  }

  if (isError || !event) {
    return <ErrorState message="We couldn't find that gathering. Head back to All Gatherings." />;
  }

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step].length ? STEP_FIELDS[step] : undefined);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedTicket || !event) return;
    setSubmitError(null);

    try {
      const result = await createBooking.mutateAsync({
        eventId: event._id,
        ticketTypeId: selectedTicket._id,
        quantity: values.quantity,
        contact: {
          fullName: values.fullName,
          mobile: values.mobile,
          email: values.email,
          gender: values.gender,
          age: values.age,
          city: values.city,
        },
        attendees: values.attendees,
        dietaryPreference: values.dietaryPreference,
        specialRequirements: values.specialRequirements,
        photoConsent: values.photoConsent,
      });

      navigate(`/checkout/${result.booking._id}`);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Couldn't complete registration. Please try again.");
    }
  });

  return (
    <div>
      <span className="eyebrow text-gold">Registering for</span>
      <h1 className="mt-2 text-[1.75rem] leading-tight xs:text-3xl sm:text-4xl">{event.title}</h1>
      <p className="mt-1 text-sm text-slate">
        {event.venue.name}, {event.city}
      </p>

      <div className="mt-8">
        <Stepper steps={STEPS} current={step} />
      </div>

      <form onSubmit={onSubmit} className="mt-8 max-w-2xl sm:mt-10">
        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Full Name" {...register("fullName")} error={errors.fullName?.message} />
            <TextField label="Mobile Number" inputMode="numeric" placeholder="98765 43210" {...register("mobile")} error={errors.mobile?.message} />
            <TextField label="Email" type="email" {...register("email")} error={errors.email?.message} />
            <SelectField
              label="Gender"
              name="gender"
              control={control}
              options={[
                { value: "female", label: "Female" },
                { value: "male", label: "Male" },
                { value: "other", label: "Other" },
              ]}
            />
            <TextField label="Age" type="number" {...register("age", { valueAsNumber: true })} error={errors.age?.message} />
            <TextField label="City" {...register("city")} error={errors.city?.message} />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            {ticketTypes?.map((ticket) => (
              <label
                key={ticket._id}
                className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate/15 p-5 has-[:checked]:border-terracotta has-[:checked]:bg-terracotta/5"
              >
                <input type="radio" value={ticket._id} className="mt-1.5 accent-terracotta" {...register("ticketTypeId")} />
                <span className="flex-1">
                  <span className="flex items-center justify-between">
                    <span className="font-display text-xl text-teal">{ticket.name}</span>
                    <span className="font-sans text-sm font-semibold text-teal">{formatCurrency(ticket.price)}</span>
                  </span>
                  {ticket.description && <span className="mt-1 block text-sm text-slate">{ticket.description}</span>}
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-gold">
                    {(ticket.available ?? ticket.capacity - ticket.sold - ticket.reserved) > 0
                      ? `${ticket.available ?? ticket.capacity - ticket.sold - ticket.reserved} left`
                      : "Sold out"}
                  </span>
                </span>
              </label>
            ))}
            {errors.ticketTypeId && <p className="text-xs text-terracotta">{errors.ticketTypeId.message}</p>}

            <div className="max-w-[200px]">
              <TextField label="Number of Tickets" type="number" min={1} max={6} {...register("quantity", { valueAsNumber: true })} error={errors.quantity?.message} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-2xl border border-slate/15 p-5">
                <p className="eyebrow text-gold">Attendee {index + 1}</p>
                <div className="mt-4 grid gap-4 xs:grid-cols-2 sm:grid-cols-3">
                  <TextField label="Full Name" {...register(`attendees.${index}.name`)} error={errors.attendees?.[index]?.name?.message} />
                  <TextField label="Age" type="number" {...register(`attendees.${index}.age`, { valueAsNumber: true })} error={errors.attendees?.[index]?.age?.message} />
                  <SelectField
                    label="Gender"
                    name={`attendees.${index}.gender`}
                    control={control}
                    options={[
                      { value: "female", label: "Female" },
                      { value: "male", label: "Male" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <SelectField
              label="Dietary Preference"
              name="dietaryPreference"
              control={control}
              options={[
                { value: "vegetarian", label: "Vegetarian" },
                { value: "non_vegetarian", label: "Non-Vegetarian" },
                { value: "vegan", label: "Vegan" },
                { value: "jain", label: "Jain" },
              ]}
            />
            <TextareaField
              label="Special Requirements (optional)"
              placeholder="Allergies, accessibility needs, anything we should know"
              {...register("specialRequirements")}
            />
            <label className="flex items-start gap-3 text-sm text-slate">
              <input type="checkbox" className="mt-1 accent-terracotta" {...register("photoConsent")} />
              I consent to being photographed or filmed during the gathering for Kasepu Kalisi&apos;s archive and promotion.
            </label>
          </div>
        )}

        {step === 4 && selectedTicket && (
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-slate/15 p-5">
              <p className="eyebrow text-gold">Contact</p>
              <p className="mt-2 text-sm text-teal">{watch("fullName")} · {watch("mobile")} · {watch("email")}</p>
            </div>
            <div className="rounded-2xl border border-slate/15 p-5">
              <p className="eyebrow text-gold">Tickets</p>
              <p className="mt-2 text-sm text-teal">
                {watch("quantity")} × {selectedTicket.name} — {formatCurrency(selectedTicket.price * watch("quantity"))}
              </p>
            </div>
            <div className="rounded-2xl border border-slate/15 p-5">
              <p className="eyebrow text-gold">Attendees</p>
              <ul className="mt-2 flex flex-col gap-1 text-sm text-teal">
                {watch("attendees").map((a, i) => (
                  <li key={i}>{a.name || `Attendee ${i + 1}`} · {a.age} · {a.gender}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate/15 p-5">
              <p className="eyebrow text-gold">Preferences</p>
              <p className="mt-2 text-sm text-teal capitalize">{watch("dietaryPreference").replace("_", "-")}</p>
            </div>
            {submitError && <ErrorState message={submitError} />}
          </div>
        )}

        <div className="mt-10 flex items-center gap-4">
          {step > 0 && (
            <Button type="button" variant="ghost" onClick={goBack}>
              Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button type="button" variant="primary" onClick={goNext}>
              Continue
            </Button>
          ) : (
            <Button type="submit" variant="primary" disabled={createBooking.isPending}>
              {createBooking.isPending ? "Submitting…" : "Proceed to Checkout →"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
