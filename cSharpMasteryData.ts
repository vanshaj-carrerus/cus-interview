import { TopicData } from "@/app/practice/data/types";

export const arrayMasteryData: TopicData = {
  slug: "array-mastery",
  title: "Array Data Structure Mastery",
  intro: "Practice questions covering fundamental to advanced concepts in Arrays.",
  levels: [
    {
      level: 1,
      title: "Array Practice: Easy to Hard",
      description: "All 20 questions covering easy, medium, and hard levels.",
      passScore: 16,
      questions: [
        // ================= EASY LEVEL =================
        {
          id: "arr-easy-1",
          question: "What is the time complexity of accessing an element in an array by its index?",
          options: [
            "O(1)",
            "O(n)",
            "O(log n)",
            "O(n^2)"
          ],
          answerIndex: 0,
          explanation: "Arrays allow direct memory access using indices, making retrieval a constant time O(1) operation."
        },
        {
          id: "arr-easy-2",
          question: "Which index represents the first element of an array in most programming languages?",
          options: ["1", "0", "-1", "2"],
          answerIndex: 1,
          explanation: "Most programming languages (like JavaScript, C++, Java) use 0-based indexing for arrays."
        },
        {
          id: "arr-easy-3",
          question: "How are elements of a standard array stored in memory?",
          options: [
            "Randomly",
            "In contiguous memory locations",
            "In a linked list format",
            "As a tree structure"
          ],
          answerIndex: 1,
          explanation: "Arrays store elements in continuous, adjacent memory blocks, which allows for fast index-based access."
        },
        {
          id: "arr-easy-4",
          question: "What happens if you try to access an index outside the bounds of an array?",
          options: [
            "It returns 0",
            "It expands the array automatically",
            "It typically throws an Index Out Of Bounds exception/error",
            "It returns the first element"
          ],
          answerIndex: 2,
          explanation: "Accessing invalid memory locations throws an error or returns undefined (depending on the language) to prevent memory corruption."
        },
        {
          id: "arr-easy-5",
          question: "Which of the following is a common operation to add an element to the end of a dynamic array?",
          options: ["Shift", "Push / Append", "Pop", "Unshift"],
          answerIndex: 1,
          explanation: "Push (in JS) or Append (in Python) adds a new element to the tail of the dynamic array."
        },
        {
          id: "arr-easy-6",
          question: "What is a 2D array typically used to represent?",
          options: [
            "A stack",
            "A queue",
            "A matrix or grid",
            "A single linked list"
          ],
          answerIndex: 2,
          explanation: "A 2D array (array of arrays) is the standard way to model tables, grids, and mathematical matrices."
        },
        {
          id: "arr-easy-7",
          question: "What is the time complexity to find the total length/size of an array?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n!)"],
          answerIndex: 0,
          explanation: "Array length is typically tracked as a built-in property, so retrieving it is an O(1) operation."
        },

        // ================= MEDIUM LEVEL =================
        {
          id: "arr-med-8",
          question: "What is the worst-case time complexity of inserting a new element at the very beginning of an array?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
          answerIndex: 1,
          explanation: "Inserting at the beginning requires shifting all existing elements one position to the right, taking O(n) time."
        },
        {
          id: "arr-med-9",
          question: "Which algorithmic technique is most memory-efficient for reversing an array in-place?",
          options: [
            "Sliding Window",
            "Binary Search",
            "Two Pointers",
            "Divide and Conquer"
          ],
          answerIndex: 2,
          explanation: "Using two pointers (start and end) and swapping them until they meet in the middle reverses the array in O(1) auxiliary space."
        },
        {
          id: "arr-med-10",
          question: "What is the main difference between a static array and a dynamic array?",
          options: [
            "Static arrays store objects; dynamic arrays store primitives",
            "Static arrays have a fixed size; dynamic arrays resize automatically",
            "Static arrays are always faster",
            "There is no difference"
          ],
          answerIndex: 1,
          explanation: "Static arrays require knowing the size upfront. Dynamic arrays (like JS arrays or Java ArrayLists) grow under the hood as needed."
        },
        {
          id: "arr-med-11",
          question: "To use Binary Search on an array, what condition MUST be true?",
          options: [
            "It must contain only positive numbers",
            "It must be sorted",
            "It must have an even length",
            "It must not contain zeroes"
          ],
          answerIndex: 1,
          explanation: "Binary search relies on the array being sorted to eliminate half of the search space on each step."
        },
        {
          id: "arr-med-12",
          question: "Which algorithm is famously used to find the maximum contiguous subarray sum in O(n) time?",
          options: [
            "Dijkstra's Algorithm",
            "Kadane's Algorithm",
            "Floyd-Warshall",
            "Kruskal's Algorithm"
          ],
          answerIndex: 1,
          explanation: "Kadane's Algorithm keeps a running sum and resets it to zero if it becomes negative, finding the max subarray efficiently."
        },
        {
          id: "arr-med-13",
          question: "Deleting an element from the middle of an array generally requires:",
          options: [
            "O(1) time",
            "Shifting all subsequent elements to the left",
            "Shifting all previous elements to the right",
            "Re-allocating the entire array"
          ],
          answerIndex: 1,
          explanation: "To close the gap left by the deleted element, all elements to its right must be shifted one index left (O(n) operation)."
        },
        {
          id: "arr-med-14",
          question: "What is the time complexity of a linear search algorithm searching for a target in an unsorted array?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          answerIndex: 2,
          explanation: "In the worst case, you might have to check every single element once, making it O(n)."
        },

        // ================= HARD LEVEL =================
        {
          id: "arr-hard-15",
          question: "What is the time complexity of merging two sorted arrays of sizes N and M into a single new sorted array?",
          options: [
            "O(N * M)",
            "O(N log M)",
            "O(N + M)",
            "O(1)"
          ],
          answerIndex: 2,
          explanation: "By using two pointers starting at index 0 of both arrays, you traverse each array exactly once: O(N + M)."
        },
        {
          id: "arr-hard-16",
          question: "The Dutch National Flag problem (sorting an array consisting only of 0s, 1s, and 2s) can be optimally solved in what time and space complexity?",
          options: [
            "O(n) time and O(n) space",
            "O(n log n) time and O(1) space",
            "O(n) time and O(1) space",
            "O(n^2) time and O(1) space"
          ],
          answerIndex: 2,
          explanation: "Using three pointers (low, mid, high), the array can be sorted in a single pass O(n) without extra space O(1)."
        },
        {
          id: "arr-hard-17",
          question: "The Boyer-Moore Voting Algorithm is the optimal approach for finding what in an array?",
          options: [
            "The longest increasing subsequence",
            "The majority element (an element appearing more than n/2 times)",
            "The missing number in a sequence",
            "The median element"
          ],
          answerIndex: 1,
          explanation: "It finds the majority element in O(n) time and O(1) space by keeping a counter that increments and decrements."
        },
        {
          id: "arr-hard-18",
          question: "Which technique is optimally used for finding the maximum sum of a subarray of a fixed size 'K'?",
          options: [
            "Prefix Sum",
            "Sliding Window",
            "Backtracking",
            "Binary Search"
          ],
          answerIndex: 1,
          explanation: "The Sliding Window technique avoids recalculating overlapping parts of the subarrays, bringing time complexity from O(n*k) down to O(n)."
        },
        {
          id: "arr-hard-19",
          question: "If you write a recursive function to traverse an array of length N without passing any new arrays, what is the hidden space complexity?",
          options: [
            "O(1) because no variables are created",
            "O(log N)",
            "O(N) due to the call stack",
            "O(N^2)"
          ],
          answerIndex: 2,
          explanation: "Each recursive call adds a frame to the system's call stack. Traversing N elements recursively takes O(N) stack memory."
        },
        {
          id: "arr-hard-20",
          question: "What is the time complexity to PRE-COMPUTE a Prefix Sum array from a given array of size N?",
          options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
          answerIndex: 2,
          explanation: "You build the prefix sum array by looping through the original array once, where each element is the sum of the current element and the previous prefix sum."
        }
      ]
    }
  ]
};