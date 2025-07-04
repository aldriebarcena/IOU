import { NextRequest, NextResponse } from "next/server";
import { ddb } from "@/lib/dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const receiptId = searchParams.get("receiptId");

    if (!receiptId) {
      return NextResponse.json({ error: "Missing receiptId" }, { status: 400 });
    }

    const result = await ddb.send(
      new GetCommand({
        TableName: "Receipts",
        Key: { receiptId },
      })
    );

    if (!result.Item) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    return NextResponse.json(result.Item);
  } catch (err) {
    console.error("❌ Error fetching receipt:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
