"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function Home() {
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal state for upload form
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // To store the uploaded file
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const uploadImageToS3 = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("File uploaded successfully:", responseData);
        alert("File uploaded successfully!");
      } else {
        // Log the error message returned from the backend
        console.error("Failed to upload file:", responseData);
        alert(`Failed to upload file: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading.");
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      uploadImageToS3(selectedFile); // Upload the file to S3 via the backend
      setShowModal(false); // Close the modal after upload
    } else {
      alert("Please select a file to upload.");
    }
  };

  const handleUploadImage = () => {
    setShowModal(true); // Open the upload modal
    setShowOptions(false); // Close the options menu
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
        setShowOptions(false); // Close options menu when clicking outside
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
    </div>
  );
}
