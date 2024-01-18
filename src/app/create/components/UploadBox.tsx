"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { type toast as ToastType, useToast } from "~/components/ui/use-toast";

type APIResponse = {
    error?: string,
    message?: string
}

async function handleUpload(file: File | undefined, toast: typeof ToastType) {
    if (!file) {
        toast({
            title: "Please, select a file using the input field!",
        });
        return;
    }

    try {
        const data = new FormData()
        data.set('file', file);

        const response = await fetch("/api/courses", {
            method: "POST",
            body: data,
        });

        if (!response.ok) {
            toast({
                title: `File upload failed: ${(await response.json() as APIResponse).error ?? "Unkown reason"}`
            })
        } else {
            toast({
                title: "File uploaded successfully!",
            });
        }
    } catch (error) {
        toast({
            title: "File upload failed. Please try again later.",
        });
    }
}

export function UploadBox() {
    const { toast } = useToast()
    const [file, setFile] = useState<File>();

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="course"> Course </Label>
            <Input
                id="course"
                type="file"
                accept="zip"
                className="text-black bg-white"
                onChange={(e) => {
                    if (e.target.files) setFile(e.target.files[0]);
                }}
            />
            <Button
                onClick={async () => {
                    await handleUpload(file, toast);
                }}
            >
                Upload file
            </Button>
        </div>
    );
}
