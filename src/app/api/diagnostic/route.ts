import { NextResponse } from "next/server";

// Force Node.js runtime
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    message: "Diagnostic API is working",
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasNearAIConfig: !!(
        process.env.NEAR_AI_API_URL || "https://api.near.ai/v1/chat/completions"
      ),
    },
  });
}

export async function POST() {
  return NextResponse.json({
    message: "POST method is working",
    timestamp: new Date().toISOString(),
  });
}
