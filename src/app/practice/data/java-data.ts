import { TopicData } from "./types";

export const javaData: TopicData = {
  slug: "java",
  title: "Java",
  intro: "Master Java fundamentals and interview-focused coding patterns.",
  levels: [
    {
      level: 1,
      title: "Core Java Basics",
      description: "Types, OOP basics, and language syntax.",
      passScore: 2,
      questions: [
        {
          id: "java-1",
          question: "Which keyword is used to inherit a class in Java?",
          options: ["implements", "extends", "inherits", "super"],
          answerIndex: 1,
          explanation: "A class inherits another class with the extends keyword.",
        },
        {
          id: "java-2",
          question: "Which type stores whole numbers in Java?",
          options: ["double", "String", "int", "boolean"],
          answerIndex: 2,
          explanation: "int is the standard integer type.",
        },
        {
          id: "java-3",
          question: "What does JVM stand for?",
          options: [
            "Java Variable Model",
            "Java Virtual Machine",
            "Java Version Manager",
            "Joint Virtual Module",
          ],
          answerIndex: 1,
          explanation: "JVM runs Java bytecode across platforms.",
        },
      ],
    },
    {
      level: 2,
      title: "Collections and Exceptions",
      description: "Use collections well and handle runtime issues safely.",
      passScore: 2,
      questions: [
        {
          id: "java-4",
          question: "Which collection does not allow duplicate elements?",
          options: ["List", "Map", "Set", "Queue"],
          answerIndex: 2,
          explanation: "Set stores unique elements only.",
        },
        {
          id: "java-5",
          question: "Checked exceptions are typically handled by:",
          options: ["constructor only", "try-catch or throws", "annotations only", "interface"],
          answerIndex: 1,
          explanation: "Checked exceptions must be caught or declared.",
        },
        {
          id: "java-6",
          question: "ArrayList access by index is usually:",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          answerIndex: 0,
          explanation: "ArrayList provides constant-time indexed access.",
        },
      ],
    },
  ],
};
