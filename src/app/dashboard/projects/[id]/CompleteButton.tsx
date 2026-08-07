"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CompleteButtonProps {
  projectId: string;
  initialCompleted: boolean;
}

export default function CompleteButton({ projectId, initialCompleted }: CompleteButtonProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isToggling, setIsToggling] = useState(false);

  return (
    <button
      disabled={isToggling}
      onClick={async () => {
        setIsToggling(true);
        try {
          const res = await fetch(`/api/projects/${projectId}/toggle-complete`, { method: "POST" });
          if (res.ok) {
            const data = await res.json();
            setIsCompleted(data.completed);
            router.refresh();
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsToggling(false);
        }
      }}
      className={`w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
        isCompleted
          ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
          : "bg-[#20b2aa] text-white hover:bg-[#1a908a]"
      }`}
    >
      {isToggling ? "Updating..." : (isCompleted ? "Mark as Incomplete" : "Mark as Complete")}
    </button>
  );
}
