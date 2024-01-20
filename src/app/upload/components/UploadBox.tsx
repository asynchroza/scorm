"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { type toast as ToastType, useToast } from "~/components/ui/use-toast";

type APIResponse = {
    error?: string,
    message?: string
}

async function uploadCourse(file: File) {
    const data = new FormData()
    data.set('file', file);

    // do not cache -- otherwise we might get a good response even though files are not actually updated
    return await fetch("/api/courses", {
        method: "POST",
        body: data,
        cache: 'no-cache'
    });
}

async function handleUpload(file: File | undefined, toast: typeof ToastType) {

    if (!file) {
        toast({
            title: "Please, select a file using the input field!",
        });
        return;
    }

    try {
        const response = await uploadCourse(file);

        if (!response.ok) {
            toast({
                title: `File upload failed: ${(await response.json() as APIResponse).error ?? "Unkown reason"}`
            })
            return;
        }

        toast({
            title: "File uploaded successfully!",
        });
    } catch (error) {
        toast({
            title: "File upload failed. Please try again later.",
        });
    }
}

export function UploadBox() {
    const { toast } = useToast()
    const [file, setFile] = useState<File>();
    const [isLoading, setIsLoading] = useState(false);

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
                    setIsLoading(true);
                    await handleUpload(file, toast);
                    setIsLoading(false);
                }}
            >
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : "Upload course"}
            </Button>
        </div>
    );
}
