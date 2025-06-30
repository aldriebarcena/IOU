import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamodb";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const command = new PutCommand({
      TableName: "Receipts",
      Item: body,
    });

    await ddb.send(command);
    console.log("✅ PutCommand succeeded:", body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DynamoDB error:", err);
    return NextResponse.json({ error: "Failed to save receipt" }, { status: 500 });
  }
}
