import { TopicData } from "./types";

export const puzzleData: TopicData = {
  slug: "puzzle",
  title: "Puzzle",
  intro: "Sharpen logic and pattern recognition with short puzzle tests.",
  levels: [
    {
      level: 1,
      title: "Logic Basics",
      description: "Simple patterns and elimination.",
      passScore: 2,
      questions: [
        {
          id: "pz-1",
          question: "Which number comes next: 2, 4, 8, 16, ?",
          options: ["18", "24", "32", "64"],
          answerIndex: 2,
          explanation: "Each step doubles the previous number.",
        },
        {
          id: "pz-2",
          question: "If all bloops are razzies and all razzies are lazzies, then all bloops are:",
          options: ["Lazzies", "Not lazzies", "Both", "Cannot say"],
          answerIndex: 0,
          explanation: "By transitive logic, bloops are lazzies.",
        },
        {
          id: "pz-3",
          question: "Odd one out: Square, Triangle, Circle, Car",
          options: ["Square", "Triangle", "Circle", "Car"],
          answerIndex: 3,
          explanation: "Car is not a geometric shape.",
        },
      ],
    },
    {
      level: 2,
      title: "Reasoning Under Constraints",
      description: "Multi-step logic and inference.",
      passScore: 2,
      questions: [
        {
          id: "pz-4",
          question: "A clock shows 3:15. The angle between hands is:",
          options: ["0 degrees", "7.5 degrees", "30 degrees", "37.5 degrees"],
          answerIndex: 1,
          explanation: "Hour hand at 97.5 and minute hand at 90 gives 7.5.",
        },
        {
          id: "pz-5",
          question: "If yesterday was Monday, what day is tomorrow?",
          options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
          answerIndex: 2,
          explanation: "Today is Tuesday, so tomorrow is Wednesday.",
        },
        {
          id: "pz-6",
          question: "Find missing letter: A, C, F, J, ?",
          options: ["M", "N", "O", "P"],
          answerIndex: 2,
          explanation: "J + 5 steps gives O (increments 2,3,4,5).",
        },
      ],
    },
  ],
};
