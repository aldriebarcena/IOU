"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCloudUploadAlt } from "react-icons/fa";
import { uploadImageToS3 } from "@/lib/s3"; // The function that uploads to S3
import Tesseract from "tesseract.js"; // Import Tesseract.js for OCR

// Function to extract text using Tesseract.js
const extractTextFromImage = async (imageUrl: string) => {
  return new Promise<string>((resolve, reject) => {
    Tesseract.recognize(imageUrl, "eng", { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => resolve(text))
      .catch(reject);
  });
};

// Function to process extracted text using GPT-4 (LLM)
const parseTextWithLLM = async (text: string) => {
  try {
    const response = await fetch("/api/parse-receipt", {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (response.ok) {
      return data.parsedData; // Return parsed data from LLM
    } else {
      console.error("Failed to parse text:", data);
      alert("Failed to parse text from the receipt.");
    }
  } catch (error) {
    console.error("Error parsing text with LLM:", error);
    alert("Error processing the text parsing.");
  }
};

export default function Home() {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<string>(""); // Store extracted text
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleUploadImage = () => {
    setShowModal(true);
    setShowOptions(false);
  };

  const handleManualEntry = () => {
    router.push(`/create/`);
    setShowOptions(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      try {
        // Step 1: Upload the file to S3
        const uploadedFileUrl = await uploadImageToS3(selectedFile);

        if (uploadedFileUrl) {
          console.log("File uploaded successfully:", uploadedFileUrl);
          alert("File processed successfully!");

          // Step 2: Extract text using Tesseract.js
          const extractedText = await extractTextFromImage(uploadedFileUrl);

          console.log("Extracted Text:", extractedText); // Log the raw text

          // Step 3: Parse the extracted text with LLM (e.g., GPT-4)
          const parsedData = await parseTextWithLLM(extractedText);
          console.log("Parsed Data:", parsedData);

          // Step 4: Display the parsed data or save it
          setExtractedData(parsedData); // Optionally display the parsed data

          // Redirect to another page if needed
          // router.push("/create");
        }
      } catch (error) {
        console.error("Error during file upload or text extraction:", error);
        alert("An error occurred during the file upload or text extraction.");
      }
    } else {
      alert("Please select a file to upload.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
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

      <div className="relative" ref={buttonRef}>
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
            className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-2xl border shadow-md z-30"
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
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="rounded-3xl p-6 w-96 border-2"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Upload Receipt Image
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mb-4 px-3 py-2 border rounded-lg"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold"
              >
                Upload
              </button>
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optionally, you can display the extracted and parsed data */}
      {extractedData && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Parsed Receipt Data:</h2>
          <textarea
            value={extractedData}
            onChange={(e) => setExtractedData(e.target.value)}
            rows={10}
            cols={50}
            className="border rounded-lg p-2 w-full"
          />
        </div>
      )}
    </div>
  );
}
