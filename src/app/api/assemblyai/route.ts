import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "AssemblyAI API key missing" }, { status: 500 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const language = (formData.get("language") as string) || "en";
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Upload file
    const fileBuffer = await file.arrayBuffer();
    const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: { authorization: apiKey, "content-type": "application/octet-stream" },
      body: fileBuffer,
    });
    if (!uploadRes.ok) return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    const { upload_url } = await uploadRes.json();

    // Start transcription
    const langMap: Record<string, string> = {
      "English": "en", "Hindi": "hi", "Spanish": "es",
      "French": "fr", "German": "de", "Japanese": "ja",
      "Arabic": "ar", "Auto Detect": "en",
    };

    const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: { authorization: apiKey, "content-type": "application/json" },
      body: JSON.stringify({ audio_url: upload_url, language_code: langMap[language] || "en", format_text: true }),
    });
    const transcript = await transcriptRes.json();
    return NextResponse.json({ transcriptId: transcript.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });

    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });

    const res = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: { authorization: apiKey },
    });
    const result = await res.json();

    if (result.status === "completed") {
      const words = result.words || [];
      const captions: { time: string; text: string; highlighted: string }[] = [];
      for (let i = 0; i < words.length; i += 6) {
        const chunk = words.slice(i, i + 6);
        const ms = chunk[0].start;
        const t = `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}`;
        const text = chunk.map((w: { text: string }) => w.text).join(" ");
        captions.push({ time: t, text, highlighted: chunk[Math.floor(chunk.length / 2)]?.text || "" });
      }
      return NextResponse.json({ status: "completed", captions, fullText: result.text });
    }
    if (result.status === "error") return NextResponse.json({ status: "error", error: result.error });
    return NextResponse.json({ status: result.status });
  } catch {
    return NextResponse.json({ error: "Poll error" }, { status: 500 });
  }
}
