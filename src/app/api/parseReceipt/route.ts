// api that brings all parse functions together, returning json
import { NextRequest, NextResponse } from "next/server";
import { analyzeReceipt } from "@/lib/textract";
import { extractTextFromTextract } from "@/lib/utils";
import { parseWithLLM } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const textractRes = await analyzeReceipt(buffer);
  const rawText = extractTextFromTextract(textractRes);
  const parsedReceipt = await parseWithLLM(rawText);

  return NextResponse.json(parsedReceipt);
}
