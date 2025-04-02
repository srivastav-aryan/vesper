import pdfParse from "pdf-parse";

export async function parseDocument(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parsed = await pdfParse(buffer);
    return parsed.text || "No text found in document.";
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse document");
  }
}
