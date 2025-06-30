"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type ReceiptItem = {
  name: string;
  price: number;
  copayerIds: string[]; // includes "main" if main payer selected
};

type ParsedReceipt = {
  storeName: string;
  date: string;
  items: { name: string; price: number }[];
  subtotal: number;
  tax: number;
  total: number;
};

export default function ReceiptPage() {
  const searchParams = useSearchParams();

  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [payerName, setPayerName] = useState<string>("");
  const [payerPhone, setPayerPhone] = useState<string>("");
  const [coPayerCount, setCoPayerCount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = searchParams.get("data");
    if (!raw) return;

    try {
      const parsed: ParsedReceipt = JSON.parse(raw);
      const enrichedItems: ReceiptItem[] = parsed.items.map((item) => ({
        name: item.name,
        price: item.price,
        copayerIds: [],
      }));

      setItems(enrichedItems);
      setTax(parsed.tax);
      setTotal(parsed.total);
    } catch (error) {
      console.error("Failed to parse receipt data:", error);
    }
  }, [searchParams]);

  const handleItemChange = (
    index: number,
    field: "name" | "price",
    value: string
  ): void => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: field === "price" ? parseFloat(value) : value,
            }
          : item
      )
    );
  };

  const handleMainPayerToggle = (index: number, selected: boolean): void => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              copayerIds: selected
                ? [...new Set([...item.copayerIds, "main"])]
                : item.copayerIds.filter((id) => id !== "main"),
            }
          : item
      )
    );
  };

  const [showModal, setShowModal] = useState(false);
  const [receiptId, setReceiptId] = useState<string>("");

  const handleSubmit = async (): Promise<void> => {
    const newReceiptId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const receipt = {
      receiptId: newReceiptId,
      createdAt,
      mainPayer: {
        id: "main",
        name: payerName,
        phone: payerPhone,
      },
      copayers: [],
      items,
      tax,
      total,
      expectedCopayerCount: coPayerCount,
      currentCopayerCount: 0,
    };

    await fetch("/api/save-receipt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(receipt),
    });

    console.log("✅ Saved to DynamoDB:", receipt);
    setReceiptId(newReceiptId);
    setShowModal(true);
  };

  const shareableLink = `${window.location.origin}/copayer/${receiptId}`;

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Review Receipt Items</h1>

      <table className="w-full mb-6 border">
        <thead>
          <tr>
            <th className="text-left p-2">Item</th>
            <th className="text-left p-2">Price</th>
            <th className="text-center p-2">Select Items</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                  className="w-full border p-1"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", e.target.value)
                  }
                  className="w-full border p-1"
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={item.copayerIds.includes("main")}
                  onChange={(e) =>
                    handleMainPayerToggle(index, e.target.checked)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Main Payer Name</label>
        <input
          type="text"
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
          className="w-full border px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Phone Number</label>
        <input
          type="tel"
          value={payerPhone}
          onChange={(e) => setPayerPhone(e.target.value)}
          className="w-full border px-3 py-2"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium"># of Co-Payers</label>
        <input
          type="number"
          min={0}
          value={coPayerCount}
          onChange={(e) => setCoPayerCount(Number(e.target.value))}
          className="w-full border px-3 py-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
      >
        Submit
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-sm shadow-xl text-center">
            <h2 className="text-lg font-semibold mb-2">
              Share this link with your friends
            </h2>
            <p className="text-blue-600 break-words mb-4">{shareableLink}</p>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded w-full mb-2"
              onClick={() => {
                navigator.clipboard.writeText(shareableLink);
                setCopied(true);
              }}
            >
              Copy Link
            </button>
            {copied && (
              <p className="text-green-700 text-sm mt-2">
                Link copied! Once you send this to your friends, you may exit
                this page.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
