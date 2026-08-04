"use client";

import { useDashboardAuthModal } from "./dashboard-auth-modal-provider";

type Props = {
  className?: string;
  loginClassName?: string;
  signupClassName?: string;
};

export default function DashboardAuthLinks({
  className = "",
  loginClassName = "text-[15px] font-semibold text-secondary transition-colors hover:text-primary",
  signupClassName = "rounded-full bg-primary px-7 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90",
}: Props) {
  const { openLogin, openSignup } = useDashboardAuthModal();

  return (
    <div className={`flex items-center justify-center gap-7 ${className}`}>
      <button type="button" onClick={openLogin} className={loginClassName}>
        Log in
      </button>
      <button type="button" onClick={openSignup} className={signupClassName}>
        Sign up
      </button>
    </div>
  );
}
