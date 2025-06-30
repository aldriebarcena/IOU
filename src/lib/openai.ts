// function that cleans up textract data and returns raw json
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const functionSchema = {
  name: "extract_receipt_data",
  description: "Parses receipt text into structured data.",
  parameters: {
    type: "object",
    properties: {
      storeName: { type: "string" },
      date: { type: "string" },
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            price: { type: "number" },
          },
          required: ["name", "price"],
        },
      },
      subtotal: { type: "number" },
      tax: { type: "number" },
      total: { type: "number" },
    },
    required: ["storeName", "date", "items", "subtotal", "tax", "total"],
  },
};

export async function parseWithLLM(text: string) {
  const chat = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content: "You extract structured data from receipt OCR.",
      },
      {
        role: "user",
        content: `Here is the OCR text:\n\n"""${text}"""\n\nParse it.`,
      },
    ],
    functions: [functionSchema],
    function_call: { name: "extract_receipt_data" },
  });

  const raw = chat.choices[0].message.function_call?.arguments;
  return JSON.parse(raw || "{}");
}
