import { NextResponse } from "next/server";
import { parseDocument } from "@/lib/parseDocument";
import { isLegalDocument } from "@/lib/validateDocument";

export async function POST(req: Request) {
  try {
    console.log("API route called.");
    const formData = await req.formData();
    console.log("FormData received:", formData);
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("File received:", file);
    const extractedText = await parseDocument(file);
    console.log("Extracted text:", extractedText);

    console.log("File object:", file); 
    console.log("File name:", file?.name);
    console.log("File type:", file?.type);
    console.log("File size:", file?.size);

    const isLegal = isLegalDocument(extractedText);
    console.log("Document validation:", isLegal);
    if (!isLegal) {
      return NextResponse.json(
        { success: false, message: "Invalid document" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Document verified successfully",
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
