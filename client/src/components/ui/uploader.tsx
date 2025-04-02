"use client";
import supabase from "@/config/supabase";
import { Input } from "@/components/ui/uploaderinput";
import { Label } from "@/components/ui/uploaderlabel";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios"; // Import axios

export function Uploader() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [signedUrl, setSignedUrl] = useState<string>("");

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

    setLoading(true);
    setMessage("");
    setSignedUrl("");

    try {
      // send file to API for validation using axios
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/verification/api/upload", formData, {
        
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data.success) {
        setMessage(response.data.message || "Document verification failed.");
        setLoading(false);
        return;
      }

      // if valid, upload to Supabase
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (!user || authError) {
        throw new Error("User must be signed in to upload files.");
      }

      const sanitizedFileName = file.name.replace(/[^\w\s.-]/gi, "_");
      const filePath = `uploads/${user.id}/${Date.now()}_${sanitizedFileName}`;

      const { error } = await supabase.storage
        .from("documents")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data, error: urlError } = await supabase.storage
        .from("documents")
        .createSignedUrl(filePath, 3600);

      if (urlError) throw urlError;

      setSignedUrl(data.signedUrl);
      setMessage("File uploaded successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Error uploading file. Try again."
      ); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="p-6 rounded-lg shadow-lg max-w-md w-full space-y-4 border">
        <Label
          htmlFor="file-upload"
          className="text-lg font-medium text-gray-400"
        >
          Upload a document
        </Label>
        <Input
          id="file-upload"
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

        {signedUrl && (
          <p className="text-sm text-green-500">
            Access file securely:{" "}
            <a
              href={signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600"
            >
              Click here (valid for 1 hour)
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
