import { Textract } from "aws-sdk";

// function that cleans up textract info
export function extractTextFromTextract(
  res: Textract.AnalyzeDocumentResponse
): string {
  return (
    res.Blocks?.filter((b) => b.BlockType === "LINE")
      .map((b) => b.Text)
      .join("\n") || ""
  );
}
