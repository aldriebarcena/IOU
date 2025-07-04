import { NextRequest, NextResponse } from "next/server";
import { ddb } from "@/lib/dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(req: NextRequest) {
  try {
    const { receiptId, newCopayer, updatedItems } = await req.json();

    // 1. Get existing receipt
    const existing = await ddb.send(
      new GetCommand({
        TableName: "Receipts",
        Key: { receiptId },
      })
    );

    if (!existing.Item) {
      return NextResponse.json(
        { error: "Receipt not found" },
        { status: 404 }
      );
    }

    const receipt = existing.Item;

    // 2. Add new copayer and update items
    receipt.copayers = [...(receipt.copayers || []), newCopayer];
    receipt.items = updatedItems;
    receipt.currentCopayerCount = (receipt.currentCopayerCount || 0) + 1;

    // 3. Save updated receipt
    await ddb.send(
      new PutCommand({
        TableName: "Receipts",
        Item: receipt,
      })
    );

    return NextResponse.json({ success: true, updatedReceipt: receipt });
  } catch (err) {
    console.error("❌ add-copayer error:", err);
    return NextResponse.json(
      { error: "Failed to add copayer" },
      { status: 500 }
    );
  }
}
