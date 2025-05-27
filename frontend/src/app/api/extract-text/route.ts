import { NextResponse } from "next/server";
import AWS from "aws-sdk";

// Initialize AWS Textract
const textract = new AWS.Textract({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { s3Bucket, s3Key } = body; // The S3 bucket and key should be passed here.

    // Ensure that the S3 bucket and key are logged for debugging
    console.log("S3 Bucket:", s3Bucket);
    console.log("S3 Key:", s3Key);

    // Set up the parameters for Textract
    const params = {
      Document: {
        S3Object: {
          Bucket: s3Bucket, // The name of your S3 bucket
          Name: s3Key, // The file path in the bucket
        },
      },
    };

    // Call Textract to process the document
    const data = await textract.detectDocumentText(params).promise();
    console.log("Textract response:", data);

    // Return the extracted text
    return NextResponse.json({ text: data.Blocks });
  } catch (error: unknown) {
    // Log error details for debugging
    if (error instanceof Error) {
      console.error("Error processing document with Textract:", error.message);
      return NextResponse.json(
        {
          error: "Failed to extract text from document",
          details: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "Unknown error occurred during text extraction" },
        { status: 500 }
      );
    }
  }
}
