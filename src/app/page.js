import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";


export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // If the user is already logged in, redirect to the dashboard
    redirect("/dashboard");
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-8">
      <main className="w-full max-w-md p-8 border rounded-md shadow-lg bg-white">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to Our Website</h1>
        <p className="text-center text-lg mb-4">Sign up to get started</p>
      </main>
    </div>
  );
}
