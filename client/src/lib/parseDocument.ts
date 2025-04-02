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

 // works well on its own
// export async function parseDocument(file: File): Promise<string> {
//   try {
//     console.log("parseDocument called. Bypassing pdf-parse.");
//     return "Test text from parseDocument"; 
//   } catch (error) {
//     console.error("Error in parseDocument:", error);
//     throw new Error("Failed to parse document");
//   }
// }