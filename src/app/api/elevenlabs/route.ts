import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId, emotion } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ElevenLabs API key missing" }, { status: 500 });
    }

    // Default voice IDs from ElevenLabs (free tier)
    const voiceMap: Record<string, string> = {
      "1": "21m00Tcm4TlvDq8ikWAM", // Rachel - My Voice
      "2": "AZnzlk1XvdvUeBnXmlld", // Domi - Brand Voice
      "3": "MF3mGyEYCl7XYWbV9V6O", // Elli - Hindi Narrator
    };

    const selectedVoiceId = voiceMap[voiceId] || voiceMap["1"];

    // Emotion to stability/similarity mapping
    const emotionSettings: Record<string, { stability: number; similarity_boost: number; style: number }> = {
      Neutral:    { stability: 0.5, similarity_boost: 0.75, style: 0 },
      Happy:      { stability: 0.3, similarity_boost: 0.8,  style: 0.5 },
      Sad:        { stability: 0.7, similarity_boost: 0.6,  style: 0.3 },
      Excited:    { stability: 0.2, similarity_boost: 0.9,  style: 0.8 },
      Calm:       { stability: 0.8, similarity_boost: 0.7,  style: 0.1 },
      Serious:    { stability: 0.7, similarity_boost: 0.75, style: 0.2 },
      Whispering: { stability: 0.9, similarity_boost: 0.5,  style: 0.1 },
    };

    const settings = emotionSettings[emotion] || emotionSettings["Neutral"];

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: settings,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `ElevenLabs error: ${err}` }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({ audio: base64Audio, format: "mp3" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
