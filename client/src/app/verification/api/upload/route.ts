import { NextResponse } from "next/server";
import { parseDocument } from "@/lib/parseDocument"; 
import { isLegalDocument } from "@/lib/validateDocument";
import { log } from "console";



export async function POST(req: Request) {
  try {
    console.log('received request');
    
    const formData = await req.formData();
    console.log('form-data received',formData);
    
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log('file received',file.name,file.type);
    
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("Buffer created successfully");


    const extractedText = await parseDocument(file);
     console.log(" Extracted text:", extractedText);

    
    const isLegal = isLegalDocument(extractedText);
    console.log("Document validation:", isLegal);


    if (!isLegal) {
      console.error("Extracted Text:", extractedText); 
      console.error(" Invalid document detected"); 
      return NextResponse.json(
        { success: false, message: "Invalid document" },
        { status: 400 }
      );
    }

     console.log("Document verified successfully");
    return NextResponse.json({
      success: true,
      message: "Document verified successfully",
    });
  } catch (error) {
    console.error(" Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
