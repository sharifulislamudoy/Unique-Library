import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50">
      <h1 className="text-3xl font-semibold mb-4">
        Welcome, {session.user.name}
      </h1>

      <p className="mb-6 text-gray-600">
        Session expires automatically after 24 hours.
      </p>

      <LogoutButton />
    </div>
  );
}
