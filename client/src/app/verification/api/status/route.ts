import { NextResponse } from "next/server";
import supabase from "@/config/supabase";

export async function GET(req: Request) {
  try {
    console.log("Status API route called.");

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "documentId is required" },
        { status: 400 }
      );
    }

    const { data: statusData, error: statusError } = await supabase
      .from("documents")
      .select("status")
      .eq("id", documentId);

    if (statusError) {
      throw statusError;
    }

    if (!statusData || statusData.length === 0) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: statusData[0].status });
  } catch (error: any) {
    console.error("Error retrieving status:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
