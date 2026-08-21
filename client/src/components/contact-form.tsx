import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/button";
import { TextField, TextareaField } from "@/components/form-field";
import { useCreateSupportTicket } from "@/lib/queries";
import { ApiError } from "@/lib/api-client";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Give it a short subject"),
  message: z.string().min(10, "Tell us a little more"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const createTicket = useCreateSupportTicket();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    await createTicket.mutateAsync(values);
    reset();
  });

  if (createTicket.isSuccess) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-teal/20 bg-teal/5 p-6">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-teal" />
        <div>
          <p className="font-display text-xl text-teal">Message sent.</p>
          <p className="mt-1 text-sm text-slate">We&apos;ll get back to you within one business day.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <TextField label="Your Name" {...register("name")} error={errors.name?.message} />
      <TextField label="Email" type="email" {...register("email")} error={errors.email?.message} />
      <TextField label="Subject" {...register("subject")} error={errors.subject?.message} />
      <TextareaField label="Message" {...register("message")} error={errors.message?.message} />
      {createTicket.isError && (
        <p className="text-xs font-medium text-terracotta">
          {createTicket.error instanceof ApiError ? createTicket.error.message : "Couldn't send your message."}
        </p>
      )}
      <Button type="submit" variant="primary" disabled={createTicket.isPending} className="self-start">
        {createTicket.isPending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
