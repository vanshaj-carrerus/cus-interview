const LANGUAGE_ICON_URLS: Record<string, string> = {
  javascript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  typescript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  python:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  c: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  csharp:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  react:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  sql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
  go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
  kotlin:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  swift:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  php: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
  dart: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
  scala:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
  elixir:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg",
};

function normalizeLanguageKey(value: string): string | null {
  const input = value.trim().toLowerCase();
  if (!input) return null;

  if (input.includes("javascript") || input === "js" || input === "node.js") {
    return "javascript";
  }
  if (input.includes("typescript") || input === "ts") return "typescript";
  if (input.includes("python")) return "python";
  if (input.includes("csharp") || input.includes("c#")) return "csharp";
  if (input.includes("cplusplus") || input.includes("c++") || input === "cpp") {
    return "cpp";
  }
  if (input.includes("html")) return "html";
  if (input.includes("css")) return "css";
  if (input.includes("react")) return "react";
  if (input.includes("mysql") || input.includes("sql")) return "sql";
  if (input.includes("kotlin")) return "kotlin";
  if (input.includes("swift")) return "swift";
  if (input.includes("elixir")) return "elixir";
  if (input.includes("scala")) return "scala";
  if (input.includes("dart")) return "dart";
  if (input.includes("ruby")) return "ruby";
  if (input.includes("php")) return "php";
  if (input.includes("rust")) return "rust";
  if (input.includes("golang") || input === "go") return "go";
  if (input.includes("java")) return "java";
  if (input === "c" || input.endsWith("-c") || input.startsWith("c-")) return "c";

  return input in LANGUAGE_ICON_URLS ? input : null;
}

export function getLanguageIconUrl(languageOrSlug: string): string | null {
  const key = normalizeLanguageKey(languageOrSlug);
  if (!key) return null;
  return LANGUAGE_ICON_URLS[key] ?? null;
}

export function getLanguageIconUrlFromParts(...parts: string[]): string | null {
  for (const part of parts) {
    const url = getLanguageIconUrl(part);
    if (url) return url;
  }
  return null;
}
