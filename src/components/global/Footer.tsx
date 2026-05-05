import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Tracks", href: "/practice", description: "Domain roadmaps and learning paths" },
  { label: "Languages", href: "/practice#language-syntax", description: "Language and course roadmaps" },
  { label: "Mock interviews", href: "/mock-interviews", description: "AI-powered interview practice" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-secondary text-white/75 px-6 py-12 border-t border-white/10">
      <div className="max-w-7xl md:container! mx-auto flex flex-col gap-10 md:flex-row md:items-start">
        <div className="max-w-sm space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Image
              src="/favicon.png"
              alt="CareerUs"
              width={40}
              height={40}
              className="rounded-xl shadow-md group-hover:opacity-90 transition-opacity"
              loading="lazy"
            />
            <div className="flex flex-col leading-none">
              <span className="font-black text-white text-lg tracking-tighter uppercase">
                CareerUs
              </span>
              <span className="text-primary text-[8px] font-black tracking-[0.3em] uppercase">
                Interview Solutions
              </span>
            </div>
          </Link>
          <p className="text-sm text-white/60 leading-relaxed">
            Structured practice, language tracks, and realistic mock interviews in one place.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-white font-black text-xs uppercase tracking-widest mb-4">
            Explore
          </h2>
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map(({ label, href, description }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group block font-bold text-sm text-white hover:text-primary transition-colors"
                >
                  {label}
                  <span className="block text-xs font-normal text-white/50 group-hover:text-white/65 mt-0.5">
                    {description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="max-w-7xl md:container! mx-auto mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/45">
        © {new Date().getFullYear()} CareerUs Solutions. All rights reserved.
      </div>
    </footer>
  );
}
