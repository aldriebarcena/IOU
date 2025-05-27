// copayers go here after selection

"use client";
import { useState } from "react";
import Header from "@/components/Header";

export default function Submit() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phoneNumber) {
      alert("Please fill in both fields.");
      return;
    }

    // Here, you can handle the submitted data (send it to an API, etc.)
    console.log("Name:", name);
    console.log("Phone Number:", phoneNumber);

    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center px-8 py-8">
      <Header title="Submit Your Information" />

      {!submitted ? (
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold w-full"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="text-lg font-semibold text-green-600">
          Thank you for submitting your information!
        </div>
      )}
    </div>
  );
}
