"use client";

import { useCallback, useState } from "react";
import {
  getAvatarFallbackColor,
  getUserInitials,
  isPlaceholderAvatarUrl,
} from "@/lib/user-avatar";

type Props = {
  name: string;
  email: string;
  avatarUrls: string[];
  className?: string;
};

export default function UserAvatar({
  name,
  email,
  avatarUrls,
  className = "h-16 w-16",
}: Props) {
  const candidates = avatarUrls.filter(Boolean);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(candidates.length === 0);

  const initials = getUserInitials(name, email);
  const fallbackColor = getAvatarFallbackColor(email || name);
  const currentUrl = candidates[candidateIndex] ?? "";

  const tryNextCandidate = useCallback(() => {
    setCandidateIndex((current) => {
      const next = current + 1;
      if (next >= candidates.length) {
        setShowFallback(true);
        return current;
      }
      return next;
    });
  }, [candidates.length]);

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center rounded-full border-2 border-white/80 text-lg font-semibold text-white shadow-sm ${className}`}
        style={{ backgroundColor: fallbackColor }}
        aria-hidden
      >
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentUrl}
      alt={`${name} profile photo`}
      className={`rounded-full border-2 border-white/80 object-cover shadow-sm ${className}`}
      referrerPolicy="no-referrer"
      onError={tryNextCandidate}
      onLoad={(event) => {
        const src = event.currentTarget.currentSrc || event.currentTarget.src;
        if (isPlaceholderAvatarUrl(src)) {
          tryNextCandidate();
        }
      }}
    />
  );
}
