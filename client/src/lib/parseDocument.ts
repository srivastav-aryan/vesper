import fs from "fs";
import pdfParse from "pdf-parse";

export async function parseDocument(file: File): Promise<string> {
  try {
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

   
    const filePath = "./temp_upload.pdf";
    fs.writeFileSync(filePath, buffer);

    
    const dataBuffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(dataBuffer);

    fs.unlinkSync(filePath);

    return parsed.text || "No text found in document.";
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse document");
  }
}
