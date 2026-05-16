import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AssemblyAI API key missing" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const language = formData.get("language") as string || "en";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Step 1: Upload file to AssemblyAI
    const fileBuffer = await file.arrayBuffer();
    const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "content-type": "application/octet-stream",
      },
      body: fileBuffer,
    });

    if (!uploadRes.ok) {
      return NextResponse.json({ error: "File upload failed" }, { status: 500 });
    }

    const { upload_url } = await uploadRes.json();

    // Step 2: Request transcription
    const langMap: Record<string, string> = {
      "English": "en", "Hindi": "hi", "Spanish": "es",
      "French": "fr", "German": "de", "Japanese": "ja",
      "Arabic": "ar", "Auto Detect": "en",
    };

    const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        audio_url: upload_url,
        language_code: langMap[language] || "en",
        word_boost: [],
        format_text: true,
      }),
    });

    const transcript = await transcriptRes.json();
    const transcriptId = transcript.id;

    // Step 3: Poll for completion
    let result = null;
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: { authorization: apiKey },
      });
      result = await pollRes.json();
      if (result.status === "completed") break;
      if (result.status === "error") {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    if (!result || result.status !== "completed") {
      return NextResponse.json({ error: "Transcription timeout" }, { status: 500 });
    }

    // Step 4: Format captions with timestamps
    const words = result.words || [];
    const captions: { time: string; text: string; highlighted: string }[] = [];

    // Group words into caption chunks (~6 words each)
    const chunkSize = 6;
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize);
      const startMs = chunk[0].start;
      const minutes = Math.floor(startMs / 60000);
      const seconds = Math.floor((startMs % 60000) / 1000);
      const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      const text = chunk.map((w: { text: string }) => w.text).join(" ");
      const midWord = chunk[Math.floor(chunk.length / 2)]?.text || "";

      captions.push({ time: timeStr, text, highlighted: midWord });
    }

    return NextResponse.json({
      captions,
      fullText: result.text,
      duration: result.audio_duration,
    });
  } catch (err) {
    console.error("AssemblyAI error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
