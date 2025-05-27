export const uploadImageToS3 = async (
  file: File
): Promise<string | undefined> => {
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
      return responseData.url; // return the URL of the uploaded file
    } else {
      console.error("Failed to upload file:", responseData);
      alert(`Failed to upload file: ${responseData.message}`);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("An error occurred while uploading.");
  }
};
