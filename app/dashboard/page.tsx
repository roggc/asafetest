import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="bg-white text-black dark:bg-black dark:text-white">
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.name}!</p>
    </div>
  );
}
