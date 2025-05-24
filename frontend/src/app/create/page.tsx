"use client";

import { useState } from "react";

export default function Create() {
  const [items, setItems] = useState([
    { name: "Item 1", price: 10 },
    { name: "Item 2", price: 15 },
    { name: "Item 3", price: 20 },
  ]);

  const [showItemModal, setShowItemModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: 0 });
  const [taxSplitOption, setTaxSplitOption] = useState<
    "evenly" | "proportionately"
  >("evenly");
  const [taxAmount, setTaxAmount] = useState(0);
  const receiptName = "Groceries May 24";

  const handleChange = (
    index: number,
    field: "name" | "price",
    value: string
  ) => {
    const newItems = [...items];
    if (field === "name") {
      newItems[index].name = value;
    } else if (field === "price") {
      // Ensure the price is a valid number and round it to two decimal places
      newItems[index].price = isNaN(parseFloat(value))
        ? 0
        : parseFloat(parseFloat(value).toFixed(2)); // Convert string to number
    }
    setItems(newItems);
  };

  const handleAddItem = () => {
    // Ensure newItem price is valid and round it to two decimal places
    const price = isNaN(newItem.price)
      ? 0
      : parseFloat(parseFloat(newItem.price.toString()).toFixed(2)); // Round to two decimal places and ensure a valid number

    // Add the new item to the items list
    setItems([...items, { name: newItem.name, price }]);

    // Close the modal after adding the item
    setShowItemModal(false);

    // Reset the new item form to initial state
    setNewItem({ name: "", price: 0 });
  };

  const handleCreateReceipt = () => {
    console.log("Receipt Created: ", receiptName);
    console.log("Items: ", items);
    console.log("Tax Split Option: ", taxSplitOption);
    console.log("Tax Amount: ", taxAmount);
  };

  const handleTaxSplitChange = (option: "evenly" | "proportionately") => {
    setTaxSplitOption(option);
    setShowTaxModal(false); // Close the modal after selecting the tax split option
  };

  const handleTaxAmountChange = (value: string) => {
    const tax = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    setTaxAmount(tax);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 py-8">
      <h1 className="text-5xl font-bold mb-4">{receiptName}</h1>

      <div className="w-full max-w-lg">
        <div className="flex mb-4">
          <div className="w-1/2 text-lg font-semibold">Items</div>
          <div className="w-1/2 text-lg font-semibold text-right">Prices</div>
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex mb-4">
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              className="w-1/2 px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              value={item.price || ""} // Ensure price is valid and not NaN
              onChange={(e) => handleChange(index, "price", e.target.value)}
              className="w-1/2 px-3 py-2 border rounded-lg text-right"
            />
          </div>
        ))}

        {/* Tax Amount Input */}
        <div className="flex mb-4 justify-between">
          <div className="w-1/2 text-lg font-semibold mt-2">Tax</div>
          <div className="w-1/2 text-right">
            <input
              type="number"
              value={taxAmount || ""} // Ensure taxAmount is valid and not NaN
              onChange={(e) => handleTaxAmountChange(e.target.value)}
              className="px-2 py-2 border rounded-lg text-right"
            />
          </div>
        </div>
        <div className="flex justify-between mt-4 gap-4">
          <button
            onClick={() => setShowItemModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold"
          >
            Add Item
          </button>
          <button
            onClick={() => setShowTaxModal(true)}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-semibold"
          >
            Set Tax Split
          </button>
          <button
            onClick={handleCreateReceipt}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold"
          >
            Create Receipt
          </button>
        </div>
      </div>

      {/* Item Modal for Adding an Item */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-md">
          <div className="p-6 rounded-lg w-96 border-2 border-white">
            <h2 className="text-2xl mb-4">Add New Item</h2>
            <div className="mb-4">
              <label className="block text-lg">Item Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                value={newItem.price || ""} // Ensure price is valid and not NaN
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    price: isNaN(parseFloat(e.target.value))
                      ? 0
                      : parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Add Item
              </button>
              <button
                onClick={() => setShowItemModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Split Modal */}
      {showTaxModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-md">
          <div className="p-6 rounded-lg w-96 border-2 border-white">
            <h2 className="text-2xl mb-4">Select Tax Split Option</h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleTaxSplitChange("evenly")}
                className={`${
                  taxSplitOption === "evenly" ? "bg-blue-600" : "bg-gray-600"
                } text-white px-6 py-3 rounded-lg font-semibold`}
              >
                Evenly
              </button>
              <button
                onClick={() => handleTaxSplitChange("proportionately")}
                className={`${
                  taxSplitOption === "proportionately"
                    ? "bg-blue-600"
                    : "bg-gray-600"
                } text-white px-6 py-3 rounded-lg font-semibold`}
              >
                Proportionately
              </button>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowTaxModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
