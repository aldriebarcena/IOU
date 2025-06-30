// funciton that uses aws textract to extract text
import AWS from "aws-sdk";

const textract = new AWS.Textract({
  region: "us-west-2", // your region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function analyzeReceipt(imageBuffer: Buffer) {
  const response = await textract
    .analyzeDocument({
      Document: { Bytes: imageBuffer },
      FeatureTypes: ["FORMS", "TABLES"],
    })
    .promise();

  return response;
}
