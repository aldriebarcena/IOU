"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

interface ReceiptItem {
  name: string;
  price: number;
  copayerIds: string[];
}

interface Copayer {
  id: string;
  name: string;
  phone: string;
}

interface Receipt {
  receiptId: string;
  mainPayer: Copayer;
  copayers: Copayer[];
  items: ReceiptItem[];
  tax: number;
  total: number;
  expectedCopayerCount: number;
  currentCopayerCount: number;
  createdAt: string;
}

export default function CoPayerPage() {
  const params = useParams();
  const receiptId = Array.isArray(params.receiptId)
    ? params.receiptId[0]
    : params.receiptId;

  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [copayerName, setCopayerName] = useState("");
  const [copayerPhone, setCopayerPhone] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      const res = await fetch(`/api/get-receipt?receiptId=${receiptId}`);
      const data: Receipt = await res.json();
      setItems(data.items);
      setReceipt(data);
    };

    if (receiptId) fetchReceipt();
  }, [receiptId]);

  const handleCheckboxToggle = (index: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const isValidName = (name: string) => /^[A-Za-z\s]+$/.test(name);
  const isValidPhone = (phone: string) =>
    /^\d{10}$/.test(phone.replace(/[^\d]/g, ""));

  const handleSubmit = () => {
    setErrorMsg("");

    if (!isValidName(copayerName)) {
      setErrorMsg("Name must only contain letters and spaces.");
      return;
    }

    if (!isValidPhone(copayerPhone)) {
      setErrorMsg("Phone number must contain exactly 10 digits.");
      return;
    }

    if (selectedItems.size === 0) {
      setErrorMsg("Please select at least one item.");
      return;
    }

    if (receipt) {
      const duplicatePhone =
        receipt.mainPayer.phone === copayerPhone ||
        receipt.copayers.some((cp) => cp.phone === copayerPhone);

      const sameName =
        receipt.mainPayer.name.toLowerCase() === copayerName.toLowerCase() ||
        receipt.copayers.some(
          (cp) => cp.name.toLowerCase() === copayerName.toLowerCase()
        );

      if (duplicatePhone) {
        setErrorMsg("This phone number has already been submitted.");
        return;
      }

      if (sameName) {
        setErrorMsg(
          "This first name is already used. Please add a last initial."
        );
        return;
      }
    }

    setConfirmModalOpen(true);
  };

  const handleSubmitConfirmed = async () => {
    if (!receipt) return;

    const copayerId = uuidv4();
    const newCopayer: Copayer = {
      id: copayerId,
      name: copayerName,
      phone: copayerPhone,
    };

    const updatedItems: ReceiptItem[] = items.map((item, i) => ({
      ...item,
      copayerIds: selectedItems.has(i)
        ? [...new Set([...item.copayerIds, copayerId])]
        : item.copayerIds,
    }));

    const updatedReceipt = {
      receiptId,
      newCopayer,
      updatedItems,
    };

    const saveRes = await fetch("/api/add-copayer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedReceipt),
    });

    const json = await saveRes.json();
    console.log("✅ Updated Receipt in DynamoDB:", json.updatedReceipt);

    // If all copayers have responded, calculate and log splits
    const current = json.updatedReceipt.currentCopayerCount;
    const expected = json.updatedReceipt.expectedCopayerCount;
    if (current === expected) {
      console.log("🎉 All copayers have submitted!");

      const payerMap: Record<string, Copayer> = {
        [json.updatedReceipt.mainPayer.id]: json.updatedReceipt.mainPayer,
        ...Object.fromEntries(
          json.updatedReceipt.copayers.map((c: Copayer) => [c.id, c])
        ),
      };

      json.updatedReceipt.items.forEach((item: ReceiptItem) => {
        const splitAmount = item.price / item.copayerIds.length;
        console.log(
          `Item: ${item.name} | $${item.price.toFixed(2)} split among:`
        );
        item.copayerIds.forEach((id) => {
          const payer = payerMap[id];
          if (payer) {
            console.log(
              `- ${payer.name} (${payer.phone}): $${splitAmount.toFixed(2)}`
            );
          }
        });
      });
    }

    setConfirmModalOpen(false);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">
        Select Items You’re Paying For
      </h1>

      <table className="w-full mb-6 border">
        <thead>
          <tr>
            <th className="text-left p-2">Item</th>
            <th className="text-left p-2">Price</th>
            <th className="text-center p-2">Select</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{item.name}</td>
              <td className="p-2">${item.price.toFixed(2)}</td>
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedItems.has(index)}
                  onChange={() => handleCheckboxToggle(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Your Name</label>
        <input
          type="text"
          value={copayerName}
          onChange={(e) => setCopayerName(e.target.value)}
          className="w-full border px-3 py-2"
          inputMode="text"
          pattern="[A-Za-z\s]+"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Phone Number</label>
        <input
          type="tel"
          value={copayerPhone}
          onChange={(e) => setCopayerPhone(e.target.value)}
          className="w-full border px-3 py-2"
          inputMode="numeric"
          pattern="[0-9]{15}"
        />
      </div>

      {errorMsg && <p className="text-red-400 text-sm mb-4">{errorMsg}</p>}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
      >
        Submit
      </button>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white rounded-xl p-6 w-full max-w-sm shadow-xl text-center">
            <h2 className="text-lg font-semibold mb-2">Confirm Info</h2>
            <p className="mb-4">
              Proceed with <strong>{copayerName}</strong>,{" "}
              <strong>{copayerPhone}</strong>?
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleSubmitConfirmed}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="text-white underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal (No Close Button) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white rounded-xl p-6 w-full max-w-sm shadow-xl text-center">
            <h2 className="text-lg font-semibold mb-2 text-green-400">
              Submission Complete!
            </h2>
            <p className="text-sm">
              Your items were submitted. You may now close this tab. The main
              payer will be notified once all co-payers respond.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
