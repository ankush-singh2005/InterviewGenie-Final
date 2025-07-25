import { redirect } from "next/navigation";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { staticInterviewTemplates } from "@/constants";
import { createInterviewFromTemplate } from "@/lib/actions/template.action";

interface PageProps {
  searchParams: { template?: string };
}

const Page = async ({ searchParams }: PageProps) => {
  const user = await getCurrentUser();
  const { template } = searchParams;

  // If a template is specified, handle static template interview
  if (template) {
    const templateData = staticInterviewTemplates.find(
      (t) => t.id === template
    );

    if (!templateData || !user?.id) {
      redirect("/");
    }

    // Generate questions for the template and create an interview
    const result = await createInterviewFromTemplate(templateData, user.id);

    if (result.success && result.interviewId) {
      // Redirect to the newly created interview
      redirect(`/interview/${result.interviewId}`);
    } else {
      // If generation fails, redirect to home
      redirect("/");
    }
  }

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={user?.name || "User"}
        userId={user?.id}
        type="generate"
      />
    </>
  );
};

export default Page;
