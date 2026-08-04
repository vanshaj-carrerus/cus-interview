export type PortfolioProjectIcon = "code" | "globe" | "server" | "folder";

export const PORTFOLIO_PROJECT_IDEAS = [
  {
    title: "Full-Stack Todo App",
    description: "Build a CRUD app with authentication, REST API, and a modern frontend.",
    stack: "React · Node.js · MongoDB",
    difficulty: "Beginner",
    icon: "code" as const,
  },
  {
    title: "URL Shortener",
    description: "Design a scalable URL shortening service with caching and analytics.",
    stack: "Next.js · Redis · PostgreSQL",
    difficulty: "Intermediate",
    icon: "globe" as const,
  },
  {
    title: "Real-Time Chat App",
    description: "WebSocket-based chat with rooms, typing indicators, and message history.",
    stack: "Socket.io · Express · React",
    difficulty: "Intermediate",
    icon: "server" as const,
  },
  {
    title: "Dev Portfolio Website",
    description: "Showcase your projects, skills, and resume with a polished personal site.",
    stack: "Next.js · Tailwind · Framer Motion",
    difficulty: "Beginner",
    icon: "folder" as const,
  },
] as const;

export const PORTFOLIO_PROJECT_COUNT = PORTFOLIO_PROJECT_IDEAS.length;
