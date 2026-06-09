export const getSearchRedirectUrl = (query: string): string => {
  const q = query.toLowerCase().trim();
  
  // Language specific mappings to their mastery courses
  const languageMappings: Record<string, string> = {
    "python": "/problems/courses/python-mastery",
    "java": "/problems/courses/java-mastery",
    "c#": "/problems/courses/csharp-mastery",
    "csharp": "/problems/courses/csharp-mastery",
    "c sharp": "/problems/courses/csharp-mastery",
    "html": "/problems/courses/html-mastery",
    "css": "/problems/courses/css-mastery",
    "javascript": "/problems/courses/javascript-mastery",
    "js": "/problems/courses/javascript-mastery",
    "sql": "/problems/courses/sql-mastery",
    "react": "/problems/courses/react-mastery",
    "c++": "/problems/courses/cpp-mastery",
    "cpp": "/problems/courses/cpp-mastery",
    "c": "/problems/courses/c-mastery",
    "reactjs": "/problems/courses/react-mastery",
  };

  // If the query directly matches a key (or starts with it + space)
  for (const [key, path] of Object.entries(languageMappings)) {
    if (q === key || q.startsWith(`${key} `) || q.endsWith(` ${key}`) || q === `${key} mastery` || q === `${key} course`) {
      return path;
    }
  }

  // Fallback to default search on the problems page
  return `/problems?q=${encodeURIComponent(query.trim())}`;
};

export type SearchSuggestion = {
  title: string;
  type: "language" | "page";
  url: string;
};

export const AVAILABLE_SUGGESTIONS: SearchSuggestion[] = [
  { title: "HTML Mastery", type: "language", url: "/problems/courses/html-mastery" },
  { title: "CSS Mastery", type: "language", url: "/problems/courses/css-mastery" },
  { title: "JavaScript Mastery", type: "language", url: "/problems/courses/javascript-mastery" },
  { title: "Python Mastery", type: "language", url: "/problems/courses/python-mastery" },
  { title: "Java Mastery", type: "language", url: "/problems/courses/java-mastery" },
  { title: "C++ Mastery", type: "language", url: "/problems/courses/cpp-mastery" },
  { title: "C# Mastery", type: "language", url: "/problems/courses/csharp-mastery" },
  { title: "SQL Mastery", type: "language", url: "/problems/courses/sql-mastery" },
  { title: "React Mastery", type: "language", url: "/problems/courses/react-mastery" },
  { title: "DSA Roadmaps", type: "page", url: "/problems" },
  { title: "Mock Interviews", type: "page", url: "/mock-interviews" },
];

export const getSearchSuggestions = (query: string): SearchSuggestion[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return AVAILABLE_SUGGESTIONS.filter(item => item.title.toLowerCase().includes(q));
};
