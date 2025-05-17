"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function Home() {
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleUploadImage = () => {
    console.log("Upload image selected");
    setShowOptions(false);
  };

  const handleTakePicture = () => {
    console.log("Take picture selected");
    setShowOptions(false);
  };

  const handleManualEntry = () => {
    const receiptId = "sample-id";
    router.push(`/receipt/${receiptId}`);
    setShowOptions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">IOU</h1>
      <p className="my-5 text-center text-2xl font-semibold">
        Receipt Splitting Service
      </p>

      <button
        onClick={() => setShowOptions(true)}
        className="flex items-center justify-center rounded-2xl border px-5 py-2 cursor-pointer font-semibold"
      >
        <FaCloudUploadAlt />
        <span className="ml-2">Upload Receipt</span>
      </button>

      {showOptions && (
        <div
          ref={menuRef}
          className="fixed left-1/2 top-140 z-30 w-64 -translate-x-1/2 rounded-2xl border shadow-md"
        >
          <button
            onClick={handleUploadImage}
            className="w-full rounded-t-2xl px-5 py-3 text-center font-medium cursor-pointer"
          >
            Upload Image
          </button>
          <button
            onClick={handleManualEntry}
            className="w-full px-5 py-3 text-center font-medium cursor-pointer"
          >
            Upload Manually
          </button>
          <button
            onClick={handleTakePicture}
            className="w-full rounded-b-2xl px-5 py-3 text-center font-medium cursor-pointer"
          >
            Take Picture
          </button>
        </div>
      )}
    </div>
  );
}
