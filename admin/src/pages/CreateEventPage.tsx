import { PageHeader } from "@/components/page-header";
import { CreateEventForm } from "@/components/create-event-form";

export default function CreateEventPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Create Event" description="Set up a new Kasepu Kalisi gathering." />
      <CreateEventForm />
    </div>
  );
}
