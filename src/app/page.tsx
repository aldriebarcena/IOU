"use client";
import { useRef } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      // TODO: handle file upload
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-5">IOU</h1>

      <div className="w-full max-w-xs">
        <button
          className="w-full bg-blue-600 py-3 rounded-xl text-lg font-semibold mb-6"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />

        <button className="w-full bg-green-600 py-3 rounded-xl text-lg font-semibold mb-6">
          Take Picture (TBD)
        </button>
        <button className="w-full bg-orange-600 py-3 rounded-xl text-lg font-semibold mb-6">
          Upload Manually (TBD)
        </button>
      </div>
    </div>
  );
}
