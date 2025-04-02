"use client";
import { Input } from "@/components/ui/uploaderinput";
import { Label } from "@/components/ui/uploaderlabel";
import { Button } from "@/components/ui/button";
import { useId, useState } from "react";
import axios from "axios";

export function Uploader() {
  const id = useId();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/verification/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message || "Upload successful!");
    } catch (err) {
      const error = err as any;
      console.error("Upload error:", error);
      setMessage(
        error.response?.data?.message || "Error uploading file. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center  p-4">
      <div className=" p-6 rounded-lg shadow-lg max-w-md w-full space-y-4 border">
        <Label htmlFor={id} className="text-lg font-medium text-gray-400">
          Upload a document
        </Label>
        <Input
          id={id}
          type="file"
          className="p-2 border rounded-md"
          onChange={handleFileChange}
        />

        {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}

        <Button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Submit"}
        </Button>

        {message && <p className="text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
}
