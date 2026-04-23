import { TopicData } from "./types";

export const systemDesignData: TopicData = {
  slug: "system-design",
  title: "System Design",
  intro: "Learn to design scalable and reliable systems step by step.",
  levels: [
    {
      level: 1,
      title: "System Design Basics",
      description: "Scalability, latency, and architecture primitives.",
      passScore: 2,
      questions: [
        {
          id: "sd-1",
          question: "What is horizontal scaling?",
          options: [
            "Adding more CPU to one machine",
            "Adding more machines",
            "Reducing database indexes",
            "Using bigger cache keys",
          ],
          answerIndex: 1,
          explanation: "Horizontal scaling means adding more servers.",
        },
        {
          id: "sd-2",
          question: "What does a load balancer do?",
          options: [
            "Encrypt user passwords",
            "Distribute traffic across servers",
            "Store database backups",
            "Create frontend UI components",
          ],
          answerIndex: 1,
          explanation: "It spreads requests to avoid overloading one server.",
        },
        {
          id: "sd-3",
          question: "Caching is primarily used to:",
          options: [
            "Increase latency",
            "Reduce repeated expensive work",
            "Replace authentication",
            "Disable logging",
          ],
          answerIndex: 1,
          explanation: "Cache stores frequently accessed data for faster reads.",
        },
      ],
    },
    {
      level: 2,
      title: "Reliability and Trade-offs",
      description: "Understand consistency, partitions, and fault tolerance.",
      passScore: 2,
      questions: [
        {
          id: "sd-4",
          question: "In CAP theorem, partition tolerance means:",
          options: [
            "System works with network failures between nodes",
            "System can ignore security checks",
            "Database writes are always immediate",
            "Users never face retries",
          ],
          answerIndex: 0,
          explanation: "Partition tolerance handles communication failures.",
        },
        {
          id: "sd-5",
          question: "Replication is useful for:",
          options: [
            "Single point of failure",
            "High availability and read scaling",
            "Reducing all write conflicts to zero",
            "Replacing observability",
          ],
          answerIndex: 1,
          explanation: "Replicas improve fault tolerance and read throughput.",
        },
        {
          id: "sd-6",
          question: "What is a key benefit of asynchronous queues?",
          options: [
            "Tighter coupling between services",
            "Decoupling and traffic smoothing",
            "No need for retries",
            "Guaranteed zero failures",
          ],
          answerIndex: 1,
          explanation: "Queues decouple producers/consumers and absorb bursts.",
        },
      ],
    },
  ],
};
