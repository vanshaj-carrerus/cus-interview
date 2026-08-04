"use client";

import Image from "next/image";

const LOGOS = [
  { name: "Amazon", src: "/logos/amazon.png" },
  { name: "Facebook", src: "/logos/facebook.png" },
  { name: "Goldman Sachs", src: "/logos/goldman-sachs.png" },
  { name: "TCS", src: "/logos/tcs.png" },
  { name: "Accenture", src: "/logos/accenture.png" },
  { name: "HCL", src: "/logos/HCL.png" },
];

function CompanyLogo({
  name,
  src,
  variant = "light",
}: {
  name: string;
  src: string;
  variant?: "light" | "dark";
}) {
  return (
    <div className="relative flex h-8 w-24 shrink-0 items-center justify-center sm:h-10 sm:w-28 md:w-32">
      <Image
        src={src}
        alt={name}
        fill
        className={
          variant === "dark"
            ? "object-contain opacity-50 grayscale brightness-0 invert transition-opacity hover:opacity-70"
            : "object-contain opacity-50 grayscale transition-opacity hover:opacity-80"
        }
      />
    </div>
  );
}

function LogoMarquee({ variant = "light" }: { variant?: "light" | "dark" }) {
  if (variant === "dark") {
    return (
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="animate-company-logo-marquee flex w-max items-center">
          <div className="flex items-center gap-10 pr-10 sm:gap-14 md:gap-16">
            {LOGOS.map((logo) => (
              <CompanyLogo
                key={logo.name}
                name={logo.name}
                src={logo.src}
                variant={variant}
              />
            ))}
          </div>
          <div
            className="flex items-center gap-10 pr-10 sm:gap-14 md:gap-16"
            aria-hidden
          >
            {LOGOS.map((logo) => (
              <CompanyLogo
                key={`${logo.name}-duplicate`}
                name={logo.name}
                src={logo.src}
                variant={variant}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-24" />

      <div className="animate-company-logo-marquee flex w-max items-center">
        <div className="flex items-center gap-10 pr-10 sm:gap-14 md:gap-16">
          {LOGOS.map((logo) => (
            <CompanyLogo
              key={logo.name}
              name={logo.name}
              src={logo.src}
              variant={variant}
            />
          ))}
        </div>
        <div
          className="flex items-center gap-10 pr-10 sm:gap-14 md:gap-16"
          aria-hidden
        >
          {LOGOS.map((logo) => (
            <CompanyLogo
              key={`${logo.name}-duplicate`}
              name={logo.name}
              src={logo.src}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroCompanyLogos() {
  return (
    <div className="mx-auto mt-auto w-full max-w-5xl pt-10 pb-2 md:pt-0">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/60 sm:text-sm">
        Our candidates work at
      </p>
      <div className="mx-auto w-full">
        <LogoMarquee variant="dark" />
      </div>
    </div>
  );
}

export default function CompanyLogosBand() {
  return (
    <section className="border-b border-slate-100 bg-white py-10 md:py-12">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm">
        Our candidates work at
      </p>
      <div className="relative mx-auto max-w-6xl px-6">
        <LogoMarquee variant="light" />
      </div>
    </section>
  );
}
