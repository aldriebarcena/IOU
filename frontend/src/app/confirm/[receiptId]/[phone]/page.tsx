"use client";
import { useState } from "react";
import Header from "@/components/Header";

export default function CoPayerView() {
  // Sample data for items (assuming all items are selected)
  const [items] = useState([
    { name: "Item 1", price: 10 },
    { name: "Item 2", price: 15 },
    { name: "Item 3", price: 20 },
  ]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [receiptConfirmed, setReceiptConfirmed] = useState<boolean>(false);

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const handleConfirmReceipt = () => {
    console.log("Receipt confirmed!");
    console.log("Payment Method:", selectedPaymentMethod);
    setReceiptConfirmed(true);
  };

  return (
    <div className="flex flex-col items-center justify-center px-8 py-8">
      <Header title="Co-Payer Receipt Confirmation"/>

      <div className="w-full max-w-lg">
        <div className="flex justify-between mb-4 mt-4">
          <span className="text-lg font-semibold">Total to Pay:</span>
          <span className="text-lg font-semibold">
            ${calculateTotalAmount().toFixed(2)}
          </span>
        </div>

        <div className="mt-4">
          <label className="text-lg font-semibold mb-2">
            Select Payment Method
          </label>
          <select
            value={selectedPaymentMethod}
            onChange={handlePaymentMethodChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select a Payment Method</option>
            <option value="PayPal">Zelle</option>
            <option value="Venmo">Venmo</option>
            <option value="Credit Card">CashApp</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <div className="mt-6">
          <button
            onClick={handleConfirmReceipt}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold"
            disabled={!selectedPaymentMethod} // Disable if no payment method selected
          >
            Confirm Receipt
          </button>
        </div>

        {receiptConfirmed && (
          <div className="mt-6 text-lg font-semibold text-green-600">
            Your payment has been confirmed! Thank you.
          </div>
        )}
      </div>
    </div>
  );
}
