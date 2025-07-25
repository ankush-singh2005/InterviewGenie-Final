import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

// Fallback responses for when AI is not available
const fallbackResponses = [
  "That's an interesting point. Can you tell me more about your experience with that?",
  "I see. What challenges did you face in that situation?",
  "Good. How did you handle that responsibility?",
  "Interesting. What would you do differently next time?",
  "I understand. Can you give me a specific example?",
  "That's good to hear. What skills did you develop from that experience?",
  "Thank you for sharing that. How do you think that experience prepared you for this role?",
];

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    console.log("Received messages:", JSON.stringify(messages, null, 2));

    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", messages);
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Filter out invalid messages and ensure proper format
    const validMessages = messages.filter(
      (msg) =>
        msg &&
        typeof msg === "object" &&
        msg.role &&
        msg.content &&
        ["system", "user", "assistant"].includes(msg.role)
    );

    if (validMessages.length === 0) {
      console.error("No valid messages found:", messages);
      return NextResponse.json(
        { error: "No valid messages provided" },
        { status: 400 }
      );
    }

    console.log(
      "Sending to Google Gemini:",
      JSON.stringify(validMessages, null, 2)
    );

    // Convert messages to a format suitable for generateText
    const systemMessage =
      validMessages.find((msg) => msg.role === "system")?.content || "";
    const userMessages = validMessages
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.content)
      .join("\n");

    const prompt = systemMessage
      ? `${systemMessage}\n\nUser: ${userMessages}`
      : userMessages;

    const { text: aiResponse } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: prompt,
      maxTokens: 150,
      temperature: 0.7,
    });

    console.log("Google Gemini response:", aiResponse);

    return NextResponse.json({ content: aiResponse });
  } catch (error) {
    console.error("Error in chat API:", error);

    // Use fallback responses when AI fails
    console.warn("AI failed, using fallback response");
    const randomResponse =
      fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return NextResponse.json({ content: randomResponse });
  }
}
