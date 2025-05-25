"use client";

import { useState } from "react";

export default function CoPayerReceipt() {
  // Sample data for items
  const [items, setItems] = useState([
    { name: "Item 1", price: 10, selected: false },
    { name: "Item 2", price: 15, selected: false },
    { name: "Item 3", price: 20, selected: false },
  ]);

  const taxSplitOption = 0; // 0 = evenly, 1 = proportionally
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // Track selected items

  const handleSelectionChange = (itemName: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemName ? { ...item, selected: !item.selected } : item
      )
    );
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemName)
        ? prevSelectedItems.filter((item) => item !== itemName)
        : [...prevSelectedItems, itemName]
    );
  };

  return (
    <div className="flex flex-col items-center justify-center px-8 py-8">
      <h1 className="text-5xl font-bold mb-4">Co-Payer Item Selection</h1>

      <div className="w-full max-w-lg">
        <div className="flex mb-4">
          <div className="w-1/2 text-lg font-semibold">Items</div>
          <div className="w-1/2 text-lg font-semibold text-right">Prices</div>
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex mb-4">
            <div className="w-1/2 px-3 py-2">
              <div className="font-semibold">{item.name}</div>
            </div>
            <div className="w-1/2 text-right px-3 py-2">
              ${item.price.toFixed(2)}
            </div>
            <div className="ml-2 mt-2">
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => handleSelectionChange(item.name)}
              />
            </div>
          </div>
        ))}

        {/* Tax Split Display */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">
            Tax Split Type:
            {taxSplitOption === 0 ? " Evenly" : " Proportion to Split"}
          </h2>
        </div>

        {/* Confirm Split Button */}
        <div className="mt-6">
          <button
            onClick={() => {
              console.log("Items selected:", selectedItems);
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold"
          >
            Confirm Split
          </button>
        </div>
      </div>
    </div>
  );
}
