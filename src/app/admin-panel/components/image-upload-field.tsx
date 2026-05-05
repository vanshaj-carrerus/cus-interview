"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";

type ImageUploadFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
};

export default function ImageUploadField({ name, label, defaultValue = "" }: ImageUploadFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { status: string; url: string | null };
      if (!response.ok || data.status !== "success" || !data.url) {
        throw new Error("Image upload failed.");
      }
      setValue(data.url);
    } catch (error) {
      console.error(error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-secondary">{label}</label>
      <input
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="https://..."
        className="w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary"
      />
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        disabled={uploading}
        className="w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-secondary disabled:opacity-60"
      />
      {value ? (
        <Image
          src={value}
          width={200}
          height={200}
          alt="Uploaded preview"
          className="h-14 w-14 rounded-md border border-primary/20 object-cover"
        />
      ) : null}
      {uploading ? <p className="text-xs text-secondary/60">Uploading image...</p> : null}
    </div>
  );
}
