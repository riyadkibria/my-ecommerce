import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 rounded-lg border p-8 shadow">
        <h1 className="text-3xl font-bold">
          Welcome
        </h1>

        <p>{user.email}</p>

        <form action={logout}>
          <button
            type="submit"
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Logout
          </button>
        </form>
      </div>
    </main>
  );
}