import { NextRequest, NextResponse } from "next/server";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

// ── Task-specific system prompts ──────────────────────────────────────────────
const SYSTEM_PROMPTS: Record<string, string> = {
  "enhance-prompt": `You are an expert AI video director. Your job is to take a simple video idea 
and expand it into a rich, detailed, cinematic prompt. Add:
- Visual details (lighting, camera angles, mood)
- Color palette and atmosphere
- Specific motion descriptions
- Style references if appropriate
Keep it under 150 words. Return ONLY the enhanced prompt, no explanations.`,

  "generate-script": `You are a professional video scriptwriter. Generate an engaging, well-structured 
video script based on the given prompt and settings. Format as:
[HOOK] - attention-grabbing opening
[MAIN CONTENT] - core message with clear sections  
[CTA] - strong call to action
Match the tone to the specified style. Be concise and punchy.`,

  "voiceover-script": `You are a professional voiceover scriptwriter. Write a natural, conversational 
script that sounds great when spoken aloud. 
- Use short sentences
- Add rhythm and flow
- Match the requested emotion/tone
- Include natural pauses with "..."  
- Keep it engaging throughout
Return ONLY the script text, ready to be recorded.`,

  "generate-captions": `You are an expert social media caption writer. Generate engaging captions 
for the given video description. 
Format as JSON array: [{"time": "0:00", "text": "Caption text here"}, ...]
- Keep each caption 3-7 words
- Make them punchy and engaging
- Timestamps every 3-5 seconds
- Match the requested style (TikTok = bold/emoji, YouTube = clean, etc.)
Return ONLY valid JSON, no markdown.`,

  "thumbnail-titles": `You are a viral YouTube thumbnail title expert. Generate 6 scroll-stopping 
thumbnail titles based on the topic. Rules:
- Use power words, numbers, curiosity gaps
- Max 6 words each
- Mix different styles (question, shock, list, secret)
- Make them irresistible to click
Return as JSON: {"titles": ["Title 1", "Title 2", ...]}
Return ONLY valid JSON, no markdown.`,

  "avatar-script": `You are a professional teleprompter scriptwriter. Write a clear, engaging script 
for an AI avatar to present. 
- Short, confident sentences
- Natural speech patterns
- Professional but warm tone
- Match the requested language and style
- Include subtle emphasis cues in *asterisks*
Return ONLY the script, ready for the avatar to read.`,
};

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { task, data } = body;

    if (!task || !data) {
      return NextResponse.json(
        { error: "Missing required fields: task and data" },
        { status: 400 }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[task];
    if (!systemPrompt) {
      return NextResponse.json(
        { error: `Unknown task: ${task}` },
        { status: 400 }
      );
    }

    // Build user message based on task
    const userMessage = buildUserMessage(task, data);

    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Claude API error:", err);
      return NextResponse.json(
        { error: "Claude API request failed", details: err },
        { status: response.status }
      );
    }

    const result = await response.json();
    const text = result.content?.[0]?.text ?? "";

    // For JSON-returning tasks, parse and return structured data
    if (task === "generate-captions" || task === "thumbnail-titles") {
      try {
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        return NextResponse.json({ result: parsed, raw: text });
      } catch {
        return NextResponse.json({ result: text, raw: text });
      }
    }

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── Message builder ───────────────────────────────────────────────────────────
function buildUserMessage(task: string, data: Record<string, string>): string {
  switch (task) {
    case "enhance-prompt":
      return `Enhance this video prompt: "${data.prompt}"`;

    case "generate-script":
      return `Create a video script for:
Prompt: ${data.prompt}
Style: ${data.style}
Duration: ${data.duration}
Aspect Ratio: ${data.ratio}`;

    case "voiceover-script":
      return `Write a voiceover script for:
Topic/Text: ${data.text}
Language: ${data.language}
Emotion/Tone: ${data.emotion}
Voice Name: ${data.voiceName}`;

    case "generate-captions":
      return `Generate captions for this video:
Description: ${data.description}
Caption Style: ${data.style}
Language: ${data.language}`;

    case "thumbnail-titles":
      return `Generate viral thumbnail titles for:
Topic: ${data.topic}
Style: ${data.style}
Channel Type: ${data.channelType || "YouTube"}`;

    case "avatar-script":
      return `Write an avatar presenter script for:
Topic/Script Draft: ${data.script}
Language: ${data.language}
Avatar Role: ${data.avatarRole}`;

    default:
      return data.prompt || JSON.stringify(data);
  }
}
