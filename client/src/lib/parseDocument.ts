import FormData from "form-data";
import fs from "fs";
import fetch from "node-fetch";

const OCR_API_KEY = process.env.OCR_API_KEY;

interface OcrApiResponse {
  ParsedResults?: { ParsedText: string }[];
  OCRExitCode?: number;
  IsErroredOnProcessing?: boolean;
  ErrorMessage?: string;
}

export async function parseDocument(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);


    const filePath = "./temp_upload.pdf";
    fs.writeFileSync(filePath, buffer);

    const formData = new FormData();
    formData.append("apikey", OCR_API_KEY);
    formData.append("file", fs.createReadStream(filePath));
    formData.append("language", "eng"); // English
    formData.append("isOverlayRequired", "false");

    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData,
    });

     const result = (await response.json()) as OcrApiResponse;

    fs.unlinkSync(filePath); 

    if (result.IsErroredOnProcessing) {
      throw new Error(result.ErrorMessage || "OCR processing error.");
    }

    if (result.ParsedResults && result.ParsedResults.length > 0) {
      return result.ParsedResults[0].ParsedText; 
    } else {
      throw new Error("No text found in document.");
    }
  } catch (error) {
    console.error("Error parsing document:", error);
    throw new Error("Failed to parse document");
  }
}
