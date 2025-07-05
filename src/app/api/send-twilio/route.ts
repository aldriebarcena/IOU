// app/api/send-twilio/route.ts

import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

// Format to E.164 (e.g. +15551234567)
const normalizePhone = (phone?: string): string => {
  if (!phone) throw new Error("Phone number is missing or undefined.");
  const digits = phone.replace(/[^\d]/g, "");
  return digits.startsWith("1") ? `+${digits}` : `+1${digits}`;
};

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

export async function POST(req: NextRequest) {
  const { phone, message } = await req.json();

  try {
    console.log("📲 Sending SMS to:", phone);
    const formattedPhone = normalizePhone(phone);

    const result = await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log("✅ SMS sent via Twilio:", result.sid);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Twilio SMS error:", err);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
