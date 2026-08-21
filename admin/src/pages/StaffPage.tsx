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
import { useDeleteStaff, useInviteStaff, useStaff, useUpdateStaff } from "@/lib/queries";
import { statusTone, statusLabel } from "@/lib/status-tone";
import type { StaffItem } from "@/types/api";

const ROLES = [
  "super_admin",
  "event_manager",
  "finance_manager",
  "registration_manager",
  "checkin_staff",
  "content_manager",
  "support_staff",
];

const STATUSES = ["active", "invited", "disabled"];

interface FormValues {
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function StaffPage() {
  const { data: staff, isLoading, isError } = useStaff();
  const inviteStaff = useInviteStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StaffItem | null>(null);
  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: { role: "checkin_staff", status: "invited" },
  });

  function openCreate() {
    setEditing(null);
    reset({ name: "", email: "", role: "checkin_staff", status: "invited" });
    setOpen(true);
  }

  function openEdit(member: StaffItem) {
    setEditing(member);
    reset({ name: member.name, email: member.email, role: member.role, status: member.status });
    setOpen(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    if (editing) await updateStaff.mutateAsync({ id: editing._id, name: values.name, role: values.role, status: values.status });
    else await inviteStaff.mutateAsync({ name: values.name, email: values.email, role: values.role });
    setOpen(false);
  });

  const saving = inviteStaff.isPending || updateStaff.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Staff"
        description="Team accounts with role-based access to the admin."
        action={
          <Button onClick={openCreate}>
            <PlusCircle size={16} /> Invite Staff
          </Button>
        }
      />

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {staff && (
        <DataTable
          rows={staff}
          rowKey={(row) => row._id}
          columns={[
            { header: "Name", accessor: (row) => row.name },
            { header: "Role", accessor: (row) => row.role.replace(/_/g, " ") },
            { header: "Email", accessor: (row) => row.email },
            { header: "Status", accessor: (row) => <Badge tone={statusTone(row.status)}>{statusLabel(row.status)}</Badge> },
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
                  <ConfirmDeleteButton onConfirm={() => deleteStaff.mutate(row._id)} disabled={deleteStaff.isPending} />
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Staff" : "Invite Staff"}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField label="Name" {...register("name", { required: true })} />
          <TextField label="Email" type="email" disabled={Boolean(editing)} {...register("email", { required: !editing })} />
          <SelectField
            label="Role"
            name="role"
            control={control}
            required
            options={ROLES.map((role) => ({ value: role, label: role.replace(/_/g, " ") }))}
          />
          {editing && (
            <SelectField
              label="Status"
              name="status"
              control={control}
              required
              options={STATUSES.map((s) => ({ value: s, label: statusLabel(s) }))}
            />
          )}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save Changes" : "Send Invite"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
