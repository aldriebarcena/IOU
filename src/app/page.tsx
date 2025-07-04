// TO DO: SET UP SMS
// TO DO:   WHEN EVERYONE HAS SUBMITTED, SEND THEIR TOTALS OUT
// TO DO:   ADD MAIN PAYER CAPABILITIES
// TO DO:     "[name] - confirm"
// TO DO:     "receipt complete"



"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ReceiptItem = {
  name: string;
  price: number;
};

type ParsedReceipt = {
  storeName: string;
  date: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
};

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      // Dynamically import heic2any only in the browser
      if (file.name.endsWith(".heic") || file.type === "image/heic") {
        const heic2any = (await import("heic2any")).default;
        const result = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        });

        const blobArray = Array.isArray(result) ? result : [result];
        file = new File(blobArray, "converted.jpg", { type: "image/jpeg" });
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-receipt", {
        method: "POST",
        body: formData,
      });

      const data: ParsedReceipt = await res.json();
      router.push(`/receipt?data=${encodeURIComponent(JSON.stringify(data))}`);
      console.log("Parsed Receipt:", data);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-5">IOU</h1>

      <div className="w-full max-w-xs">
        <button
          className="w-full bg-blue-600 py-3 rounded-xl text-lg font-semibold mb-6 text-white"
          onClick={() => fileInputRef.current?.click()}
        >
          {loading ? "Parsing..." : "Upload Image"}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />

        <button className="w-full bg-green-600 py-3 rounded-xl text-lg font-semibold mb-6 text-white">
          Take Picture (TBD)
        </button>
        <button className="w-full bg-orange-600 py-3 rounded-xl text-lg font-semibold mb-6 text-white">
          Upload Manually (TBD)
        </button>
      </div>
    </div>
  );
}
