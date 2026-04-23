import { TopicData } from "./types";

export const databasesData: TopicData = {
  slug: "databases",
  title: "Databases",
  intro: "Master schema design, SQL basics, and data integrity.",
  levels: [
    {
      level: 1,
      title: "Database Fundamentals",
      description: "Tables, keys, and normalization basics.",
      passScore: 2,
      questions: [
        {
          id: "db-1",
          question: "Primary key is used to:",
          options: [
            "Store duplicate rows",
            "Uniquely identify each row",
            "Speed up CSS loading",
            "Replace indexes",
          ],
          answerIndex: 1,
          explanation: "Primary key uniquely identifies records.",
        },
        {
          id: "db-2",
          question: "Which SQL statement retrieves data?",
          options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
          answerIndex: 2,
          explanation: "SELECT is used to query data from tables.",
        },
        {
          id: "db-3",
          question: "Normalization helps mainly by:",
          options: [
            "Reducing data redundancy",
            "Increasing duplicate columns",
            "Removing all joins",
            "Avoiding constraints",
          ],
          answerIndex: 0,
          explanation: "Normalization minimizes duplication and anomalies.",
        },
      ],
    },
    {
      level: 2,
      title: "Querying and Optimization",
      description: "Indexes, joins, and query performance.",
      passScore: 2,
      questions: [
        {
          id: "db-4",
          question: "Which join returns matching rows from both tables?",
          options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "CROSS JOIN"],
          answerIndex: 2,
          explanation: "INNER JOIN returns rows with matches in both tables.",
        },
        {
          id: "db-5",
          question: "What is a common purpose of indexes?",
          options: [
            "Speeding up reads on searched columns",
            "Guaranteeing zero storage use",
            "Replacing backups",
            "Avoiding transactions",
          ],
          answerIndex: 0,
          explanation: "Indexes improve query speed at some write/storage cost.",
        },
        {
          id: "db-6",
          question: "Transactions mainly ensure:",
          options: [
            "UI responsiveness",
            "ACID guarantees for grouped operations",
            "Faster internet speed",
            "No need for constraints",
          ],
          answerIndex: 1,
          explanation: "Transactions keep grouped operations consistent.",
        },
      ],
    },
  ],
};
