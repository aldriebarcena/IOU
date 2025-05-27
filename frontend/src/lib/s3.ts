import heic2any from "heic2any"; // Import the heic2any library for HEIC conversion

export const uploadImageToS3 = async (
  file: File
): Promise<string | undefined> => {
  try {
    // Check if the file is HEIC
    if (file.type === "image/heic" || file.name.endsWith(".heic")) {
      // Convert the HEIC file to JPEG using heic2any
      const convertedFile = await heic2any({
        blob: file, // Pass the file as a blob
        toType: "image/jpeg", // Specify the output type as JPEG
      });

      // Check if the conversion returns a Blob or an array of Blobs
      // If it's a Blob, we can use it directly
      const convertedBlob = Array.isArray(convertedFile)
        ? convertedFile[0]
        : convertedFile;

      const convertedFileName = `${file.name.replace(/\.[^/.]+$/, "")}.jpg`; // Change file extension to .jpg

      // Create a new FormData object with the converted file
      const formData = new FormData();
      formData.append("file", convertedBlob, convertedFileName); // Append the Blob with the new file name

      // Upload the converted file to S3
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("File uploaded successfully:", responseData);
        return responseData.url; // Return the URL of the uploaded file
      } else {
        console.error("Failed to upload file:", responseData);
        alert(`Failed to upload file: ${responseData.message}`);
      }
    } else {
      // If not HEIC, proceed with the original file
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("File uploaded successfully:", responseData);
        return responseData.url; // Return the URL of the uploaded file
      } else {
        console.error("Failed to upload file:", responseData);
        alert(`Failed to upload file: ${responseData.message}`);
      }
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("An error occurred while uploading.");
  }
};
