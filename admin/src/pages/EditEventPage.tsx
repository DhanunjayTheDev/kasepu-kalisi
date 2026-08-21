import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/page-header";
import { CreateEventForm } from "@/components/create-event-form";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useEvent } from "@/lib/queries";

export default function EditEventPage() {
  const { id } = useParams();
  const { data: event, isLoading, isError } = useEvent(id);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit Event" description="Update this gathering's details." />
      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {event && <CreateEventForm event={event} />}
    </div>
  );
}
