import { TopicData } from "./types";

export const pythonData: TopicData = {
  slug: "python",
  title: "Python",
  intro: "Build confidence in Python syntax, idioms, and interview patterns.",
  levels: [
    {
      level: 1,
      title: "Python Essentials",
      description: "Data structures, functions, and control flow.",
      passScore: 2,
      questions: [
        {
          id: "py-1",
          question: "Which data structure is mutable?",
          options: ["tuple", "string", "list", "frozenset"],
          answerIndex: 2,
          explanation: "Lists are mutable and support in-place updates.",
        },
        {
          id: "py-2",
          question: "What keyword defines a function?",
          options: ["function", "func", "def", "lambda"],
          answerIndex: 2,
          explanation: "Python uses def for named functions.",
        },
        {
          id: "py-3",
          question: "Which comprehension creates a dictionary?",
          options: ["[x for x in a]", "{x for x in a}", "{k: v for k, v in a}", "(x for x in a)"],
          answerIndex: 2,
          explanation: "Key-value pairs in braces create dict comprehensions.",
        },
      ],
    },
    {
      level: 2,
      title: "Python Interview Patterns",
      description: "Performance, exceptions, and clean solutions.",
      passScore: 2,
      questions: [
        {
          id: "py-4",
          question: "Average-case lookup in a Python dict is:",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answerIndex: 0,
          explanation: "Hash table based lookup is average constant time.",
        },
        {
          id: "py-5",
          question: "What does try/except block provide?",
          options: ["Threading", "Error handling", "Type casting", "Code minification"],
          answerIndex: 1,
          explanation: "try/except handles runtime exceptions safely.",
        },
        {
          id: "py-6",
          question: "Which is generally more memory-efficient for large sequences?",
          options: ["list", "tuple", "generator", "dict"],
          answerIndex: 2,
          explanation: "Generators produce items lazily without storing all at once.",
        },
      ],
    },
  ],
};
