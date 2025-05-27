import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

interface ParsedItem {
  name: string;
  price: number;
}

interface ParsedJson {
  items: ParsedItem[];
  tax: number;
  totalAmount: number;
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // You can choose "gemini-pro" or "gemini-pro-vision"

    // Use Gemini to process the extracted text
    const prompt = `
      Extract the following information from this receipt, don't include the dollar sign:

      1. List each item purchased along with its price in the following format:
        - item_name|item_price
        
      2. After the items, return the total tax in the following format:
        - tax|total_tax_amount

      3. Finally, return the total amount (the sum of all item prices and taxes) in the following format:
        - total_amount|total_amount_value

      Please output the information in this format:
        - item1_name|item1_price - item2_name|item2_price - item3_name|item3_price ... - tax|total_tax_amount - total_amount|total_amount_value

      Receipt Text: ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsedData = response.text();

    // Initialize parsedJson with proper typing
    const parsedJson: ParsedJson = {
      items: [],
      tax: 0,
      totalAmount: 0,
    };

    const dataParts = parsedData.split(" - ");

    // Parse the items and extract item names and prices
    dataParts.forEach((part) => {
      const cleanedPart = part.trim(); // Trim leading/trailing spaces
      if (cleanedPart.startsWith("-")) {
        // Remove leading dash
        part = cleanedPart.slice(1).trim();
      }

      const [name, price] = part.split("|");
      if (name && price) {
        if (name === "tax") {
          parsedJson.tax = parseFloat(price);
        } else if (name === "total_amount") {
          parsedJson.totalAmount = parseFloat(price);
        } else {
          parsedJson.items.push({ name, price: parseFloat(price) });
        }
      }
    });

    return NextResponse.json({
      message: "Receipt data parsed successfully",
      parsedData: parsedJson,
    });
  } catch (err: unknown) {
    // Explicitly type 'err' as unknown for clarity
    console.error("Error parsing receipt data:", err);
    if (err instanceof Error) {
      // Type guard
      return NextResponse.json(
        { message: "Error parsing receipt data", error: err.message },
        { status: 500 }
      );
    } else {
      // Handle cases where err is not an Error object (e.g., a string or other primitive)
      return NextResponse.json(
        { message: "Error parsing receipt data", error: String(err) }, // Convert to string
        { status: 500 }
      );
    }
  }
}
