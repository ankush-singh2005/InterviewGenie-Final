import { db } from "@/firebase/admin";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";

export async function createInterviewFromTemplate(
  templateData: {
    id: string;
    role: string;
    type: string;
    techstack: readonly string[];
    level: string;
  },
  userId: string
) {
  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare ${templateData.role} interview questions.
        Job Role: ${templateData.role}
        Experience Level: ${templateData.level}
        Tech Stack: ${templateData.techstack.join(", ")}
        Interview Type: ${templateData.type}
        
        Generate 5 relevant interview questions that test both technical knowledge and problem-solving skills.
        
        For Backend Developer: Focus on server-side technologies, databases, APIs, system design
        For Fullstack Developer: Include both frontend and backend concepts, full-stack architecture
        For DevOps Engineer: Cover infrastructure, automation, CI/CD, cloud platforms, monitoring
        
        Return ONLY the questions in this exact format:
        ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
        
        Make questions specific to the tech stack mentioned.
      `,
    });

    const interview = {
      role: templateData.role,
      type: templateData.type,
      level: templateData.level,
      techstack: [...templateData.techstack],
      questions: JSON.parse(questions),
      userId: userId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

    return { success: true, interviewId: docRef.id };
  } catch (error) {
    console.error("Error creating interview from template:", error);
    return { success: false, error };
  }
}
