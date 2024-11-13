import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Metin alınamadı." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Sen bir İngilizce öğretmenisin. Çocukların dil gelişimine yardımcı olacak şekilde basit ve anlaşılır geri bildirimler ver.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error ? data.error.message : "API Hatası" },
        { status: response.status }
      );
    }

    const assistantMessage = data.choices[0].message.content;

    return NextResponse.json({ text: assistantMessage });
  } catch (error) {
    const errorMessage = error.message || "Sunucu Hatası";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
