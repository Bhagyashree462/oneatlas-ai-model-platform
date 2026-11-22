
import { google } from "@ai-sdk/google";
import {
  streamText,
  convertToModelMessages,
  type UIMessage,
} from "ai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } =
      await req.json();

    const result = streamText({
      model: google("gemini-3.5-flash-lite"),

      system: `
        You are OneAtlas AI, a helpful and intelligent AI assistant.
        Give clear, accurate, beginner-friendly answers.
        Explain difficult concepts step by step.
        Help with programming, web development, education,
        technology, problem-solving, and general questions.
        Use headings and examples whenever helpful.
      `,

      messages: await convertToModelMessages(messages),

      onError({ error }) {
        console.error("OneAtlas streaming error:", error);
      },
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error("OneAtlas Gemini API Error:", error);

    return Response.json(
      {
        error:
          "Unable to process your message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
