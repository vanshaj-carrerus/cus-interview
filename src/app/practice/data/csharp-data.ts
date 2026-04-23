import { TopicData } from "./types";

export const csharpData: TopicData = {
  slug: "csharp",
  title: "C#",
  intro: "Practice modern C# with strong OOP, LINQ, and runtime fundamentals.",
  levels: [
    {
      level: 1,
      title: "C# Foundations",
      description: "Classes, interfaces, and type system basics.",
      passScore: 2,
      questions: [
        {
          id: "cs-1",
          question: "Which keyword defines a class in C#?",
          options: ["struct", "class", "record", "namespace"],
          answerIndex: 1,
          explanation: "class defines a reference type.",
        },
        {
          id: "cs-2",
          question: "Which feature supports polymorphism contracts?",
          options: ["interface", "enum", "delegate only", "using"],
          answerIndex: 0,
          explanation: "Interfaces define behavior contracts for polymorphism.",
        },
        {
          id: "cs-3",
          question: "What does var do in C#?",
          options: [
            "Creates dynamic type always",
            "Infers compile-time type from assignment",
            "Makes variable global",
            "Creates nullable type",
          ],
          answerIndex: 1,
          explanation: "var uses compile-time type inference.",
        },
      ],
    },
    {
      level: 2,
      title: "LINQ and Async",
      description: "Query data fluently and write non-blocking operations.",
      passScore: 2,
      questions: [
        {
          id: "cs-4",
          question: "LINQ Where is used to:",
          options: ["Sort data", "Filter data", "Mutate classes", "Define events"],
          answerIndex: 1,
          explanation: "Where filters sequences based on a predicate.",
        },
        {
          id: "cs-5",
          question: "async/await in C# is mainly for:",
          options: [
            "Parallel CPU loops only",
            "Non-blocking asynchronous code",
            "Replacing exceptions",
            "Removing tasks",
          ],
          answerIndex: 1,
          explanation: "async/await helps write readable asynchronous logic.",
        },
        {
          id: "cs-6",
          question: "Which return type is common for async methods?",
          options: ["bool", "Task", "IEnumerable", "object"],
          answerIndex: 1,
          explanation: "Task and Task<T> are standard async return types.",
        },
      ],
    },
  ],
};
