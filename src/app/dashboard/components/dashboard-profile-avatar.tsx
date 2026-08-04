"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import UserAvatar from "@/components/user/UserAvatar";

type Props = {
  name: string;
  email: string;
  initialAvatarUrls: string[];
};

export default function DashboardProfileAvatar({
  name,
  email,
  initialAvatarUrls,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarUrls, setAvatarUrls] = useState(initialAvatarUrls);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (file: File) => {
    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/auth/profile-image", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        error?: string;
        url?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to upload profile photo.");
      }

      setAvatarUrls([data.url]);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload profile photo."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label="Change profile photo"
      >
        <UserAvatar
          name={name}
          email={email}
          avatarUrls={avatarUrls}
          className="h-14 w-14"
        />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-secondary/45 opacity-0 transition group-hover:opacity-100">
          <Camera className="h-5 w-5 text-white" />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleUpload(file);
          event.target.value = "";
        }}
      />

      {uploadError ? (
        <p className="absolute left-0 top-full mt-2 w-48 text-left text-[11px] text-red-500">
          {uploadError}
        </p>
      ) : null}
    </div>
  );
}
