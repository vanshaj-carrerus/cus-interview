"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";

export default function GetStartedButton() {
  const { user } = useAuth();

  return (
    <Link
      href={user ? "/dashboard" : "/signup"}
      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-slate-800"
    >
      Get started
    </Link>
  );
}
