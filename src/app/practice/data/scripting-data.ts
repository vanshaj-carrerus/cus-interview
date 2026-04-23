import { TopicData } from "./types";

export const scriptingData: TopicData = {
  slug: "scripting",
  title: "Scripting",
  intro: "Automate tasks using shell and script fundamentals.",
  levels: [
    {
      level: 1,
      title: "Scripting Basics",
      description: "Variables, flow, and command usage.",
      passScore: 2,
      questions: [
        {
          id: "sc-1",
          question: "What is a script generally used for?",
          options: [
            "Manual repetitive work",
            "Automating repetitive tasks",
            "Rendering only graphics",
            "Replacing databases",
          ],
          answerIndex: 1,
          explanation: "Scripts automate repeated actions.",
        },
        {
          id: "sc-2",
          question: "Which is commonly used to make a script executable in Unix?",
          options: ["chmod +x", "chdir", "touch -r", "ls -a"],
          answerIndex: 0,
          explanation: "chmod +x grants execute permission.",
        },
        {
          id: "sc-3",
          question: "Why add error handling in scripts?",
          options: [
            "To make script slower",
            "To ignore all failures",
            "To fail safely and debug faster",
            "To remove outputs",
          ],
          answerIndex: 2,
          explanation: "Error handling improves reliability and diagnosis.",
        },
      ],
    },
    {
      level: 2,
      title: "Automation Reliability",
      description: "Idempotency, logging, and safe operations.",
      passScore: 2,
      questions: [
        {
          id: "sc-4",
          question: "Idempotent script means:",
          options: [
            "Produces different result every run",
            "Safe to run repeatedly with same outcome",
            "Cannot use conditionals",
            "Runs only once",
          ],
          answerIndex: 1,
          explanation: "Idempotency avoids side effects on repeat runs.",
        },
        {
          id: "sc-5",
          question: "Why is logging useful in automation?",
          options: [
            "To hide failures",
            "To understand what happened during execution",
            "To increase file size only",
            "To remove alerts",
          ],
          answerIndex: 1,
          explanation: "Logs provide traceability and debugging context.",
        },
        {
          id: "sc-6",
          question: "Best practice before destructive script actions is:",
          options: [
            "Skip confirmation always",
            "Test in staging or dry-run mode",
            "Delete backups first",
            "Suppress all output",
          ],
          answerIndex: 1,
          explanation: "Dry-runs reduce risk before real changes.",
        },
      ],
    },
  ],
};
