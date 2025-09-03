import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";
import UpdateUserForm from "@/components/admin/update-user-form";

export const metadata: Metadata = {
  title: "Update User",
};

interface PropTypes {
  params: Promise<{ id: string }>;
}

const AdminUserUpdatePage = async ({ params }: PropTypes) => {
  const { id } = await params;

  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">
        Update User <span className="text-sm">({id})</span>
      </h1>
      <UpdateUserForm user={user} />
    </div>
  );
};

export default AdminUserUpdatePage;
