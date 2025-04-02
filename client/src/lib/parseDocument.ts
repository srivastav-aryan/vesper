import fs from "fs";
import pdfParse from "pdf-parse";

export async function parseDocument(file: File): Promise<string> {
  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save temporarily
    const filePath = "./temp_upload.pdf";
    fs.writeFileSync(filePath, buffer);

    // Read and parse PDF
    const dataBuffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(dataBuffer);

    // Delete temp file after processing
    fs.unlinkSync(filePath);

    return parsed.text || "No text found in document.";
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse document");
  }
}
