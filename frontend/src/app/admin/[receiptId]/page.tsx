"use client";

import { useState } from "react";

interface Item {
  name: string;
  price: number;
  selectedBy: string[];
  confirmedBy: string[]; // Make sure confirmedBy is an array of strings
}

export default function Admin() {
  // Explicitly define the type for the items state
  const [items, setItems] = useState<Item[]>([
    {
      name: "Item 1",
      price: 10,
      selectedBy: ["John", "Jane", "You"],
      confirmedBy: [],
    },
    {
      name: "Item 2",
      price: 15,
      selectedBy: ["Alice", "You"],
      confirmedBy: [],
    },
    {
      name: "Item 3",
      price: 20,
      selectedBy: ["Bob", "John"],
      confirmedBy: [],
    },
  ]);

  const [people] = useState(["John", "Jane", "Alice", "Bob", "You"]);
  const mainPayer = "You"; // Set the main payer's name

  const handleConfirm = (person: string) => {
    console.log(person, "confirmed");
    const newItems = [...items];
    // Confirm for each item
    newItems.forEach((item) => {
      if (
        item.selectedBy.includes(person) &&
        !item.confirmedBy.includes(person)
      ) {
        item.confirmedBy.push(person);
      }
    });
    setItems(newItems);
  };

  const handleTotalPayment = () => {
    const payment: { [key: string]: number } = {}; // Initialize as an object
    items.forEach((item) => {
      item.selectedBy.forEach((person) => {
        if (!payment[person]) payment[person] = 0;
        payment[person] += item.price / item.selectedBy.length;
      });
    });
    return payment;
  };

  const handleConfirmReceipt = () => {
    console.log("Receipt Confirmation");
    items.forEach((item) => {
      console.log(`Item: ${item.name}`);
      console.log(`Price: $${item.price.toFixed(2)}`);
      console.log("Confirmed By: ", item.confirmedBy.join(", "));
    });
    console.log("Receipt has been confirmed!");
  };

  return (
    <div className="flex flex-col items-center justify-center px-8 py-8">
      <h1 className="text-5xl font-bold mb-4">Receipt Summary</h1>

      <div className="w-full max-w-lg">
        <div className="flex mb-4">
          <div className="w-1/2 text-lg font-semibold">Items</div>
          <div className="w-1/2 text-lg font-semibold text-right">Prices</div>
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex mb-4">
            <div className="w-1/2 px-3 py-2">
              <div className="font-semibold">{item.name}</div>
              <div className="mt-2">
                {item.selectedBy.map((person, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span
                      className={`${
                        item.confirmedBy.includes(person) ? "line-through" : ""
                      }`}
                    >
                      {person}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 text-right px-3 py-2">
              ${item.price.toFixed(2)}
            </div>
          </div>
        ))}

        {/* Summary and Confirm buttons */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Summary</h2>
          <div className="flex flex-col">
            {people.map((person) => (
              <div key={person} className="flex justify-between mb-2">
                <div>
                  <span>{person}</span>
                  {person !== mainPayer &&
                    !items.every((item) =>
                      item.confirmedBy.includes(person)
                    ) && (
                      <button
                        onClick={() => handleConfirm(person)}
                        className="text-xs text-green-600 ml-2"
                      >
                        Confirm
                      </button>
                    )}
                </div>

                <span>
                  ${handleTotalPayment()[person]?.toFixed(2) || "0.00"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleConfirmReceipt}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold"
        >
          Confirm Receipt
        </button>
      </div>
    </div>
  );
}
