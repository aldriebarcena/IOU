"use client";

import { useState } from "react";

export default function CoPayerItemSelection() {
  // Sample data for items
  const [items, setItems] = useState([
    { name: "Item 1", price: 10, selected: false },
    { name: "Item 2", price: 15, selected: false },
    { name: "Item 3", price: 20, selected: false },
  ]);

  const taxSplitOption = 0; // 0 = evenly, 1 = proportionally
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // Track selected items
  const [totalTax] = useState(15); // Example total tax value
  const [numPayers] = useState(4); // Example number of payers

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

  // Calculate total price of selected items
  const calculateSelectedItemsTotal = () => {
    return items
      .filter((item) => selectedItems.includes(item.name))
      .reduce((total, item) => total + item.price, 0);
  };

  // Calculate tax based on selected split option
  const calculateTaxSplit = () => {
    const totalSelectedPrice = calculateSelectedItemsTotal();
    if (taxSplitOption === 0) {
      return totalTax / numPayers; // Tax is evenly split across all payers
    } else if (taxSplitOption === 1) {
      const totalPrice = items.reduce((total, item) => total + item.price, 0);
      return (totalSelectedPrice / totalPrice) * totalTax; // Tax is proportional to selected items
    }
    return 0; // Default case
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
            Current Tax Split: ${calculateTaxSplit().toFixed(2)} (
            {taxSplitOption === 0 ? "evenly" : "proportionally"})
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
