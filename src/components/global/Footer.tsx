// Footer.tsx

const COMPILERS = [
  "Online C Compiler",
  "Online C++ Compiler",
  "Online Java Compiler",
  "Online Javascript Compiler",
  "Online Python Compiler",
];

const INTERVIEW_LANGUAGES = [
  "Java Interview Questions",
  "Sql Interview Questions",
  "Python Interview Questions",
  "Javascript Interview Questions",
  "Angular Interview Questions",
  "Networking Interview Questions",
  "Selenium Interview Questions",
  "Data Structure Interview Questions",
  "Data Science Interview Questions",
  "System Design Interview Questions",
  "Hr Interview Questions",
  "Html Interview Questions",
  "C Interview Questions",
];

const INTERVIEW_COMPANIES = [
  "Amazon Interview Questions",
  "Facebook Interview Questions",
  "Google Interview Questions",
  "Tcs Interview Questions",
  "Accenture Interview Questions",
  "Infosys Interview Questions",
  "Capgemini Interview Questions",
  "Wipro Interview Questions",
  "Cognizant Interview Questions",
  "Deloitte Interview Questions",
  "Zoho Interview Questions",
  "Hcl Interview Questions",
];

const TOP_ARTICLES = [
  "Highest Paying Jobs In India",
  "Exciting C Projects Ideas With Source Code",
  "Top Java 8 Features",
  "Angular Vs React",
  "10 Best Data Structures And Algorithms Books",
  "Exciting C Projects Ideas With Source Code",
  "Best Full Stack Developer Courses",
  "Best Data Science Courses",
  "Python Commands List",
  "Data Scientist Salary",
  "Maximum Subarray Sum Kadane's Algorithm",
];

const CHEAT_SHEETS = [
  "Python Cheat Sheet",
  "C++ Cheat Sheet",
  "Javascript Cheat Sheet",
  "Git Cheat Sheet",
  "Java Cheat Sheet",
];

const MCQS = [
  "Java Mcq",
  "Data Structure Mcq",
  "Dbms Mcq",
  "C Programming Mcq",
  "C++ Mcq",
  "Python Mcq",
  "Javascript Mcq",
];

const PRACTICE = [
  "Programming",
  "Scripting",
  "System Design",
  "Databases",
  "Puzzle",
];
const FAST_TRACK = ["Python", "Java", "C++", "Javascript"];

function PipeSeparated({
  items,
  viewAll = true,
}: {
  items: string[];
  viewAll?: boolean;
}) {
  return (
    <p className="text-gray-400 text-xs leading-6">
      {items.map((item, i) => (
        <span key={item}>
          <a href="#" className="hover:text-white transition-colors">
            {item}
          </a>
          {i < items.length - 1 && (
            <span className="mx-2 text-gray-600">|</span>
          )}
        </span>
      ))}
      {viewAll && (
        <>
          <span className="mx-2 text-gray-600">|</span>
          <a href="#" className="hover:text-white transition-colors">
            View All
          </a>
        </>
      )}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-white font-bold text-sm mb-3">{children}</h3>;
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-white font-semibold text-xs mb-2 mt-3">{children}</p>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#1a1f2e] text-gray-400 px-6 py-12">
      <div className="max-w-6xl md:container! mx-auto flex flex-col md:flex-row gap-10">
        {/* ── LEFT COLUMN ── */}
        <div className="w-full md:w-60 shrink-0 flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <span className="text-white font-black text-xl italic uppercase font-mono">C</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-gray-100 text-xl tracking-tighter uppercase">CareerUs</span>
            <span className="text-primary text-[8px] font-black tracking-[0.3em] uppercase">Interview Solutions</span>
          </div>
        </div>

          {/* App download card */}
          <div className="bg-[#252b3b] rounded-xl p-4 flex flex-col gap-3 border border-[#2d3548]">
            <p className="text-white text-xs font-medium uppercase tracking-tight">
              Download the <br />
              <span className="font-black text-primary tracking-widest text-sm">CUS</span>
              <span className="text-[10px] align-super ml-0.5 text-primary">↗</span> App
            </p>
            <div className="flex items-center gap-3">
              {/* QR code placeholder */}
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0">
                <svg viewBox="0 0 60 60" className="w-14 h-14" fill="none">
                  {/* QR pattern approximation */}
                  <rect
                    x="4"
                    y="4"
                    width="22"
                    height="22"
                    rx="2"
                    fill="none"
                    stroke="#000"
                    strokeWidth="3"
                  />
                  <rect x="9" y="9" width="12" height="12" rx="1" fill="#000" />
                  <rect
                    x="34"
                    y="4"
                    width="22"
                    height="22"
                    rx="2"
                    fill="none"
                    stroke="#000"
                    strokeWidth="3"
                  />
                  <rect
                    x="39"
                    y="9"
                    width="12"
                    height="12"
                    rx="1"
                    fill="#000"
                  />
                  <rect
                    x="4"
                    y="34"
                    width="22"
                    height="22"
                    rx="2"
                    fill="none"
                    stroke="#000"
                    strokeWidth="3"
                  />
                  <rect
                    x="9"
                    y="39"
                    width="12"
                    height="12"
                    rx="1"
                    fill="#000"
                  />
                  <rect x="34" y="34" width="6" height="6" fill="#000" />
                  <rect x="42" y="34" width="6" height="6" fill="#000" />
                  <rect x="50" y="34" width="6" height="6" fill="#000" />
                  <rect x="34" y="42" width="6" height="6" fill="#000" />
                  <rect x="42" y="50" width="6" height="6" fill="#000" />
                  <rect x="50" y="42" width="6" height="6" fill="#000" />
                  <rect x="50" y="50" width="6" height="6" fill="#000" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-white text-xs font-bold">4.5</span>
                  <span className="text-gray-500 text-[10px]">Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-white text-xs font-bold">100K+</span>
                  <span className="text-gray-500 text-[10px]">Downloads</span>
                </div>
              </div>
            </div>
            {/* Google Play button */}
            <a
              href="#"
              className="flex items-center gap-2 bg-black rounded-lg px-3 py-2 hover:bg-gray-900 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 20.5v-17l18 8.5-18 8.5z" fill="none" />
                <path d="M3.18 3.5L13.5 12 3.18 20.5V3.5z" fill="#ea4335" />
                <path
                  d="M3.18 20.5L13.5 12l3.5 3.5-10.5 6-3.32-1z"
                  fill="#fbbc05"
                />
                <path
                  d="M3.18 3.5l10.5 6L17 13l-3.5-1-10.32-8.5z"
                  fill="#34a853"
                />
                <path
                  d="M17 9.5L13.5 12 17 14.5l3.5-2.5L17 9.5z"
                  fill="#4285f4"
                />
              </svg>
              <div>
                <p className="text-gray-400 text-[8px] leading-none">
                  GET IT ON
                </p>
                <p className="text-white text-xs font-semibold leading-tight">
                  Google Play
                </p>
              </div>
            </a>
          </div>

          {/* Nav links */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {["Blog", "About Us", "Contact Us", "Privacy Policy"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-gray-400 text-xs hover:text-white transition-colors col-span-1"
              >
                {l}
              </a>
            ))}
            {["Community", "FAQ", "Terms"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-gray-400 text-xs hover:text-white transition-colors col-span-1"
              >
                {l}
              </a>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {/* Instagram */}
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>

          {/* Practice Questions */}
          <div>
            <SectionHeading>Practice Questions</SectionHeading>
            <div className="flex flex-col gap-1.5">
              {PRACTICE.map((p) => (
                <a
                  key={p}
                  href="#"
                  className="text-gray-400 text-xs hover:text-white transition-colors"
                >
                  {p}
                </a>
              ))}
            </div>
          </div>

          {/* Fast Track Courses */}
          <div>
            <SectionHeading>Fast Track Courses</SectionHeading>
            <div className="flex flex-col gap-1.5">
              {FAST_TRACK.map((c) => (
                <a
                  key={c}
                  href="#"
                  className="text-gray-400 text-xs hover:text-white transition-colors"
                >
                  {c}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Online Compilers */}
          <div>
            <SectionHeading>Online CUS Compilers</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2">
              {COMPILERS.map((c) => (
                <a
                  key={c}
                  href="#"
                  className="text-gray-400 text-xs hover:text-white transition-colors"
                >
                  {c}
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-[#2d3548]" />

          {/* Interview Preparation */}
          <div>
            <SectionHeading>Interview Preparation</SectionHeading>

            <p className="text-white text-xs font-semibold mb-3">
              Top Interview Questions
            </p>

            <SubHeading>Language, Tools &amp; Technologies</SubHeading>
            <PipeSeparated items={INTERVIEW_LANGUAGES} />

            <SubHeading>Companies</SubHeading>
            <PipeSeparated items={INTERVIEW_COMPANIES} />
          </div>

          <div className="border-t border-[#2d3548]" />

          {/* Top Articles */}
          <div>
            <SectionHeading>Top Articles</SectionHeading>
            <PipeSeparated items={TOP_ARTICLES} />
          </div>

          <div className="border-t border-[#2d3548]" />

          {/* Top Cheat Sheet */}
          <div>
            <SectionHeading>Top Cheat Sheet</SectionHeading>
            <PipeSeparated items={CHEAT_SHEETS} />
          </div>

          <div className="border-t border-[#2d3548]" />

          {/* Top MCQ */}
          <div>
            <SectionHeading>Top MCQ</SectionHeading>
            <PipeSeparated items={MCQS} />
            <a
              href="#"
              className="text-gray-400 text-xs hover:text-white transition-colors mt-1 inline-block"
            >
              View All
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
