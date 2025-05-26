import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle raw form data
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData(); // Parse the incoming form data
    const file = formData.get("file") as File; // Access the uploaded file

    if (!file) {
      console.error("No file uploaded");
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Set up S3 upload parameters
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `receipts/${file.name}`, // Define the file path in the bucket
      Body: buffer, // Upload file as a buffer
      ContentType: file.type, // Set the content type (image/* for images)
      // Removed ACL since it's not allowed in your bucket policy
    };

    // Upload the file to S3
    const command = new PutObjectCommand(params);
    await s3.send(command); // Upload the file

    return NextResponse.json({ message: "File uploaded successfully" });
  } catch (err: unknown) {
    // Use type guard to ensure err is an instance of Error
    if (err instanceof Error) {
      return NextResponse.json(
        { message: "Error uploading file", error: err.message },
        { status: 500 }
      );
    } else {
      // Handle unexpected error types
      return NextResponse.json(
        { message: "Error uploading file", error: "Unknown error" },
        { status: 500 }
      );
    }
  }
}
