import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text } = await req.json();
    console.log("Received text for TTS:", text);

    if (!text) {
      return NextResponse.json({ error: "Metin alınamadı." }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    console.log("ElevenLabs API Key:", apiKey);

    const voiceId = "EXAVITQu4vr4xnSDxMaL"; // Doğru voiceId'yi kullandığınızdan emin olun

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          voice_settings: {
            stability: 0.9,
            similarity_boost: 0.5,
            speed: 0.4,
            pitch: 0.9,
            volume: 0.8,
          },
          messages: [
            {
              content: `. speak more slowly and use slower sentences.`,
            },
          ],
        }),
      }
    );

    console.log("ElevenLabs API Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("ElevenLabs API Hatası:", errorData);
      return NextResponse.json(
        { error: errorData.detail || "TTS API Hatası" },
        { status: response.status }
      );
    }

    const audioArrayBuffer = await response.arrayBuffer();
    console.log("Audio data received from ElevenLabs.");

    return new Response(audioArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("TTS İşleme Hatası:", error);
    const errorMessage = error.message || "Sunucu Hatası";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
