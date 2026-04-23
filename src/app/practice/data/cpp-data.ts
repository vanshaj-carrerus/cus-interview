import { TopicData } from "./types";

export const cppData: TopicData = {
  slug: "cpp",
  title: "C++",
  intro: "Sharpen C++ interview readiness across syntax, STL, and memory model.",
  levels: [
    {
      level: 1,
      title: "C++ Core Concepts",
      description: "Types, references, and object-oriented basics.",
      passScore: 2,
      questions: [
        {
          id: "cpp-1",
          question: "Which operator accesses members via pointer?",
          options: [".", "::", "->", "&"],
          answerIndex: 2,
          explanation: "Use -> to access members through a pointer.",
        },
        {
          id: "cpp-2",
          question: "What does std:: stand for?",
          options: ["Standard object", "Namespace qualifier", "Template alias", "Compiler flag"],
          answerIndex: 1,
          explanation: "std:: qualifies symbols in the standard namespace.",
        },
        {
          id: "cpp-3",
          question: "Which keyword prevents function overriding?",
          options: ["final", "const", "static", "virtual"],
          answerIndex: 0,
          explanation: "final on virtual functions blocks further overrides.",
        },
      ],
    },
    {
      level: 2,
      title: "STL and Performance",
      description: "Containers, complexity, and modern C++ style.",
      passScore: 2,
      questions: [
        {
          id: "cpp-4",
          question: "Which container provides dynamic contiguous storage?",
          options: ["std::map", "std::vector", "std::set", "std::stack"],
          answerIndex: 1,
          explanation: "std::vector stores elements contiguously and grows dynamically.",
        },
        {
          id: "cpp-5",
          question: "What is RAII in C++ mainly used for?",
          options: [
            "Manual garbage collection",
            "Automatic resource management by object lifetime",
            "Improved integer arithmetic",
            "Network encryption",
          ],
          answerIndex: 1,
          explanation: "RAII ties resource lifetime to object lifetime.",
        },
        {
          id: "cpp-6",
          question: "move semantics primarily help by:",
          options: [
            "Reducing unnecessary deep copies",
            "Making code single-threaded",
            "Removing templates",
            "Avoiding constructors",
          ],
          answerIndex: 0,
          explanation: "Moves transfer ownership efficiently instead of copying.",
        },
      ],
    },
  ],
};
