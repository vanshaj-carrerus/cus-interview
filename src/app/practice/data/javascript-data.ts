import { TopicData } from "./types";

export const javascriptData: TopicData = {
  slug: "javascript",
  title: "JavaScript",
  intro: "Prepare for modern JavaScript interviews with practical concept checks.",
  levels: [
    {
      level: 1,
      title: "JavaScript Fundamentals",
      description: "Scope, data types, and basic runtime behavior.",
      passScore: 2,
      questions: [
        {
          id: "js-1",
          question: "Which keyword creates a block-scoped variable?",
          options: ["var", "const", "global", "function"],
          answerIndex: 1,
          explanation: "const is block-scoped and cannot be reassigned.",
        },
        {
          id: "js-2",
          question: "What does === compare?",
          options: ["Only value", "Only type", "Value and type", "Object references only"],
          answerIndex: 2,
          explanation: "Strict equality compares both value and type.",
        },
        {
          id: "js-3",
          question: "Which method transforms each array item and returns a new array?",
          options: ["forEach", "map", "filter", "reduceRight"],
          answerIndex: 1,
          explanation: "map returns a new array with transformed elements.",
        },
      ],
    },
    {
      level: 2,
      title: "Async JavaScript",
      description: "Promises, async/await, and event loop awareness.",
      passScore: 2,
      questions: [
        {
          id: "js-4",
          question: "async functions always return:",
          options: ["number", "string", "Promise", "boolean"],
          answerIndex: 2,
          explanation: "An async function wraps returns into a Promise.",
        },
        {
          id: "js-5",
          question: "What is a key use of Promise.all?",
          options: [
            "Run all tasks serially",
            "Wait for multiple promises in parallel",
            "Catch only syntax errors",
            "Create class instances",
          ],
          answerIndex: 1,
          explanation: "Promise.all resolves when all included promises resolve.",
        },
        {
          id: "js-6",
          question: "Which queue typically processes Promise callbacks?",
          options: ["Render queue", "Microtask queue", "Style queue", "Layout queue"],
          answerIndex: 1,
          explanation: "Promise then/catch callbacks run in the microtask queue.",
        },
      ],
    },
  ],
};
