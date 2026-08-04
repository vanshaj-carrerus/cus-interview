"use client";

import { Layers } from "lucide-react";
import { getLanguageIconUrlFromParts } from "@/lib/language-icons";

type Props = {
  language: string;
  slug?: string;
  title?: string;
  className?: string;
  iconClassName?: string;
};

export default function LanguageIcon({
  language,
  slug,
  title,
  className = "h-5 w-5",
  iconClassName = "",
}: Props) {
  const src = getLanguageIconUrlFromParts(language, slug ?? "", title ?? "");

  if (!src) {
    return <Layers className={`${className} text-primary ${iconClassName}`.trim()} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      className={`${className} shrink-0 object-contain ${iconClassName}`.trim()}
    />
  );
}
