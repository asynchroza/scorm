"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/use-toast";

async function handleUpload(file: File | undefined) {
  if (!file) {
    toast({
      title: "Please, select a file using the input field!",
    });
    return;
  }

  try {
    const response = await fetch("/api/courses", {
      method: "POST",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    toast({
      title: "File uploaded successfully!",
    });
  } catch (error) {
    console.error("Upload failed:", (error as Error).message);
    toast({
      title: "File upload failed. Please try again later.",
    });
  }
}

export function UploadBox() {
  const [file, setFile] = useState<File>();

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="course"> Course </Label>
      <Input
        id="course"
        type="file"
        className="text-black bg-white"
        onChange={(e) => {
          if (e.target.files) setFile(e.target.files[0]);
        }}
      />
      <Button
        onClick={async () => {
          await handleUpload(file);
        }}
      >
        Upload file
      </Button>
    </div>
  );
}
