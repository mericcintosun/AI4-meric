import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Yetkilendirme başarısız" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return NextResponse.json(
        { error: "Ses dosyası alınamadı." },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    const whisperFormData = new FormData();
    whisperFormData.append("file", audioFile, "audio.wav");
    whisperFormData.append("model", "whisper-1");
    whisperFormData.append("task", "transcribe");
    whisperFormData.append("language", "en");

    const whisperResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: whisperFormData,
      }
    );

    const whisperData = await whisperResponse.json();

    if (!whisperResponse.ok) {
      console.error("Whisper API Hatası:", whisperData);
      return NextResponse.json(
        {
          error: whisperData.error
            ? whisperData.error.message
            : "Whisper API Hatası",
        },
        { status: whisperResponse.status }
      );
    }

    const transcribedText = whisperData.text;

    const chatResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a kind, supportive, and encouraging language assistant designed to help preschool children develop their English language skills. You understand input in both Turkish and English and always reply in English. Your goal is to understand their speech and provide appropriate feedback in terms of grammar and pronunciation, making the learning process enjoyable and effective. The user who spoke to you has a low level of English.

**Communication Guidelines:**

- **Input Languages:** Turkish and English
- **Response Language:** English
- **Tone:** Kind, patient, cheerful, and supportive
- **Language Level:** Use simple and understandable words appropriate for preschool children
- **Sentence Structure:** Short and clear sentences; avoid complex structures and advanced vocabulary
- **Pacing:** Provide information in small, easy-to-follow segments to simulate slower communication

**Remember to start with praise, gently correct mistakes by modeling the correct expression, and end with encouraging words. speak more slowly and use slower sentences.**
`,
            },
            {
              role: "user",
              content: transcribedText,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    const chatData = await chatResponse.json();

    if (!chatResponse.ok) {
      console.error("ChatGPT API Hatası:", chatData);
      return NextResponse.json(
        {
          error: chatData.error ? chatData.error.message : "ChatGPT API Hatası",
        },
        { status: chatResponse.status }
      );
    }

    const assistantMessage = chatData.choices[0].message.content;

    await prisma.conversation.create({
      data: {
        userId: session.user.id,
        userInput: transcribedText,
        assistantResponse: assistantMessage,
      },
    });

    return NextResponse.json({
      transcribedText,
      text: assistantMessage,
    });
  } catch (error) {
    console.error("Sunucu Hatası:", error);
    const errorMessage = error.message || "Sunucu Hatası";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
