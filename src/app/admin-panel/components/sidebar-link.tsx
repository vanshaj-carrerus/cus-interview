"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  label: string;
};

export default function SidebarLink({ href, label }: Props) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/admin-panel" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-secondary hover:bg-primary/5"
      }`}
    >
      {label}
    </Link>
  );
}
