import FeedbackForm from "@/components/feedback";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";


export default async function coursesTree() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");

  return <FeedbackForm />;
}


