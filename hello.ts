import { TopicData } from "@/app/practice/data/types";

export const designMiscData: TopicData = {
  slug: "design-and-misc",
  title: "Design & Misc Problems",
  intro: "Solve these 20 System Design, Object-Oriented Design, and Miscellaneous problems. From easy to hard.",
  levels: [
    {
      level: 1,
      title: "Design & Misc: Coding Challenges",
      description: "Click on any problem to open the compiler and start coding.",
      passScore: 20,
      questions: [
        // ================= EASY LEVEL =================
        {
          id: "design-easy-1",
          difficulty: "easy",
          question: "Design Parking System: Design a parking system for a parking lot. The parking lot has three kinds of parking spaces: big, medium, and small, with a fixed number of slots for each size.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-easy-2",
          difficulty: "easy",
          question: "Design HashSet: Design a HashSet without using any built-in hash table libraries. Implement the add, remove, and contains functions.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-easy-3",
          difficulty: "easy",
          question: "Design HashMap: Design a HashMap without using any built-in hash table libraries. Implement the put, get, and remove functions.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-easy-4",
          difficulty: "easy",
          question: "Single Number: Given a non-empty array of integers nums, every element appears twice except for one. Find that single one using bit manipulation with linear runtime complexity and constant extra space.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-easy-5",
          difficulty: "easy",
          question: "Number of 1 Bits: Write a function that takes the binary representation of an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-easy-6",
          difficulty: "easy",
          question: "Shuffle an Array: Given an integer array nums, design an algorithm to randomly shuffle the array. All permutations of the array should be equally likely as a result of the shuffling.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-easy-7",
          difficulty: "easy",
          question: "Design an Ordered Stream: Design a stream that takes n (id, value) pairs in an arbitrary order and returns the values over several calls in increasing order of their IDs.",
          options: [], answerIndex: 0, explanation: ""
        },

        // ================= MEDIUM LEVEL =================
        {
          id: "design-med-8",
          difficulty: "medium",
          question: "LRU Cache: Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the get and put operations with O(1) average time complexity.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-med-9",
          difficulty: "medium",
          question: "Implement Trie (Prefix Tree): A trie is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the insert, search, and startsWith methods.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-med-10",
          difficulty: "medium",
          question: "Design Add and Search Words Data Structure: Design a data structure that supports adding new words and finding if a string matches any previously added string, including support for the '.' wildcard character.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-med-11",
          difficulty: "medium",
          question: "Design Browser History: Implement a browser history class that allows you to visit URLs, go back a specific number of steps in the history, and go forward a specific number of steps.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-med-12",
          difficulty: "medium",
          question: "Insert Delete GetRandom O(1): Implement the RandomizedSet class so that all operations (insert, remove, getRandom) work in average O(1) time complexity.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-med-13",
          difficulty: "medium",
          question: "Design Underground System: Implement the UndergroundSystem class that keeps track of customer check-in and check-out times between different stations to compute average travel times.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-med-14",
          difficulty: "medium",
          question: "Design Tic-Tac-Toe: Design a Tic-tac-toe game that is played between two players on an n x n grid. You may assume all moves are valid.",
          options: [], answerIndex: 0, explanation: ""
        },

        // ================= HARD LEVEL =================
        {
          id: "design-hard-15",
          difficulty: "hard",
          question: "LFU Cache: Design and implement a data structure for a Least Frequently Used (LFU) cache. Implement the get and put operations with O(1) average time complexity.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-hard-16",
          difficulty: "hard",
          question: "Design In-Memory File System: Design a data structure that simulates an in-memory file system with operations like ls, mkdir, addContentToFile, and readContentFromFile.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-hard-17",
          difficulty: "hard",
          question: "Find Median from Data Stream: The median is the middle value in an ordered integer list. Implement the MedianFinder class to add numbers from a data stream and find the median in efficient time.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-hard-18",
          difficulty: "hard",
          question: "Design Search Autocomplete System: Design a search autocomplete system for a search engine. Users may input a sentence, and you need to return the top 3 historical hot sentences that have the same prefix.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-hard-19",
          difficulty: "hard",
          question: "Design Twitter: Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and retrieve the 10 most recent tweets in their news feed.",
          options: [], answerIndex: 0, explanation: ""
        },
        {
          id: "design-hard-20",
          difficulty: "hard",
          question: "Data Stream as Disjoint Intervals: Given a data stream input of non-negative integers, summarize the numbers seen so far as a list of disjoint intervals.",
          options: [], answerIndex: 0, explanation: ""
        }
      ]
    }
  ]
};