import { TopicData } from "./types";

export const programmingData: TopicData = {
  slug: "programming",
  title: "Programming",
  intro: "Practice core coding concepts with guided tutor-style tests.",
  levels: [
    {
      level: 1,
      title: "Programming Basics",
      description: "Variables, loops, and functions.",
      passScore: 2,
      questions: [
        {
          id: "prog-1",
          question: "Which data type is best for storing true/false values?",
          options: ["String", "Boolean", "Array", "Float"],
          answerIndex: 1,
          explanation: "Boolean is designed to store true/false values.",
        },
        {
          id: "prog-2",
          question: "What is the result of 5 % 2?",
          options: ["1", "2", "2.5", "0"],
          answerIndex: 0,
          explanation: "Modulo returns the remainder after division.",
        },
        {
          id: "prog-3",
          question: "Why do we use functions?",
          options: [
            "To slow down code",
            "To avoid naming variables",
            "To reuse logic and improve readability",
            "To replace loops always",
          ],
          answerIndex: 2,
          explanation: "Functions help reuse and organize logic.",
        },
      ],
    },
    {
      level: 2,
      title: "Intermediate Problem Solving",
      description: "Complexity awareness and clean implementation.",
      passScore: 2,
      questions: [
        {
          id: "prog-4",
          question: "Which structure is most suitable for LIFO behavior?",
          options: ["Queue", "Stack", "Tree", "Graph"],
          answerIndex: 1,
          explanation: "Stack follows Last In First Out behavior.",
        },
        {
          id: "prog-5",
          question: "What is the time complexity of binary search?",
          options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
          answerIndex: 1,
          explanation: "Binary search halves the search space every step.",
        },
        {
          id: "prog-6",
          question: "Which is a good clean-code habit?",
          options: [
            "Long functions with many tasks",
            "Meaningful naming and small functions",
            "Avoid comments and tests always",
            "Use global variables everywhere",
          ],
          answerIndex: 1,
          explanation:
            "Clear naming and small focused functions improve quality.",
        },
      ],
    },
    {
      level: 3,
      title: "Advanced Data Structures",
      description: "Non-linear structures and balancing acts.",
      passScore: 5,
      questions: [
        {
          id: "prog-7",
          question:
            "What is the worst-case time complexity of a Hash Map operation if there are many collisions?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answerIndex: 2,
          explanation:
            "In the worst case, all items hash to the same bucket, creating a linked list.",
        },
        {
          id: "prog-8",
          question:
            "Which tree structure ensures the height difference between subtrees is at most 1?",
          options: ["Binary Search Tree", "AVL Tree", "Trie", "Min-Heap"],
          answerIndex: 1,
          explanation: "AVL trees are self-balancing binary search trees.",
        },
        {
          id: "prog-9",
          question:
            "A 'Trie' (Prefix Tree) is most efficient for which use case?",
          options: [
            "Sorting integers",
            "Autocomplete and dictionary searches",
            "Storing GPS coordinates",
            "Calculating shortest paths",
          ],
          answerIndex: 1,
          explanation:
            "Tries excel at prefix-based lookups by sharing common ancestors among strings.",
        },
        {
          id: "prog-10",
          question: "What is the primary difference between a Set and a List?",
          options: [
            "Sets allow duplicates",
            "Sets are always sorted",
            "Sets guarantee unique elements",
            "Lists are faster to search",
          ],
          answerIndex: 2,
          explanation:
            "A Set is a collection that contains no duplicate elements.",
        },
        {
          id: "prog-11",
          question: "Which traversal visits nodes in level-order?",
          options: [
            "In-order",
            "Pre-order",
            "Breadth-First Search",
            "Depth-First Search",
          ],
          answerIndex: 2,
          explanation:
            "BFS explores all neighbors at the present depth before moving to the next level.",
        },
        {
          id: "prog-12",
          question:
            "What is the space complexity of a recursive Fibonacci function without memoization?",
          options: ["O(1)", "O(n)", "O(log n)", "O(2^n)"],
          answerIndex: 1,
          explanation:
            "The space complexity is O(n) due to the depth of the recursion stack.",
        },
      ],
    },
    {
      level: 4,
      title: "Memory Management & Pointers",
      description: "Low-level resource handling.",
      passScore: 6,
      questions: [
        {
          id: "prog-13",
          question: "Where are local variables usually stored in memory?",
          options: ["Heap", "Stack", "Data Segment", "Register"],
          answerIndex: 1,
          explanation:
            "Local variables are stored in the Stack, which is managed automatically by the CPU.",
        },
        {
          id: "prog-14",
          question: "What is a 'memory leak'?",
          options: [
            "Using too much RAM",
            "Allocating memory and failing to release it",
            "Accessing out-of-bounds array indices",
            "A hardware failure in the RAM stick",
          ],
          answerIndex: 1,
          explanation:
            "A leak occurs when the program loses the reference to allocated memory without freeing it.",
        },
        {
          id: "prog-15",
          question: "In C++, what does a 'Dangling Pointer' point to?",
          options: [
            "Null",
            "An uninitialized variable",
            "A memory location that has been deallocated",
            "The beginning of the Heap",
          ],
          answerIndex: 2,
          explanation:
            "Dangling pointers occur when the object they point to is deleted but the pointer is not cleared.",
        },
        {
          id: "prog-16",
          question:
            "Which concept allows multiple pointers to point to the same memory without manual tracking in high-level languages?",
          options: [
            "Garbage Collection",
            "Pointer Arithmetic",
            "Deep Copying",
            "Encapsulation",
          ],
          answerIndex: 0,
          explanation:
            "Garbage collectors track references and free memory when it is no longer reachable.",
        },
        {
          id: "prog-17",
          question:
            "What is the size of an Integer pointer on a 64-bit system?",
          options: ["2 bytes", "4 bytes", "8 bytes", "Variable size"],
          answerIndex: 2,
          explanation:
            "On a 64-bit architecture, pointers are 8 bytes (64 bits) regardless of the data type they point to.",
        },
        {
          id: "prog-18",
          question: "What is 'Heap Fragmentation'?",
          options: [
            "Memory becomes divided into small, non-contiguous blocks",
            "The CPU cache fails",
            "The stack grows into the heap",
            "Data is corrupted during transmission",
          ],
          answerIndex: 0,
          explanation:
            "Fragmentation happens when small allocations leave gaps that are too small for larger new allocations.",
        },
        {
          id: "prog-19",
          question: "Which of the following describes a 'Buffer Overflow'?",
          options: [
            "The CPU runs out of registers",
            "A program writes data beyond the boundary of a buffer",
            "A recursive function calls itself too many times",
            "The database is too large for the disk",
          ],
          answerIndex: 1,
          explanation:
            "Buffer overflows overwrite adjacent memory, often leading to security vulnerabilities.",
        },
        {
          id: "prog-20",
          question: "What does the 'Free' function in C do?",
          options: [
            "Deletes a variable",
            "Clears the screen",
            "Deallocates a block of memory from the heap",
            "Resets the CPU",
          ],
          answerIndex: 2,
          explanation:
            "free() marks memory previously allocated via malloc/calloc as available for reuse.",
        },
      ],
    },
    {
      level: 5,
      title: "Concurrency & Multithreading",
      description: "Managing simultaneous execution.",
      passScore: 6,
      questions: [
        {
          id: "prog-21",
          question: "What is a 'Race Condition'?",
          options: [
            "A bug that makes code run too fast",
            "When two threads access shared data simultaneously and the outcome depends on timing",
            "When the CPU overheats",
            "A competition between two programmers",
          ],
          answerIndex: 1,
          explanation:
            "Race conditions occur when unsynchronized access to shared state causes unpredictable results.",
        },
        {
          id: "prog-22",
          question:
            "Which primitive is used to ensure only one thread accesses a resource at a time?",
          options: ["Semaphore", "Mutex", "Pipe", "Signal"],
          answerIndex: 1,
          explanation:
            "A Mutex (Mutual Exclusion) locks a resource for a single thread.",
        },
        {
          id: "prog-23",
          question: "What is a 'Deadlock'?",
          options: [
            "A thread that finishes instantly",
            "Two or more threads waiting for each other to release resources, causing a permanent hang",
            "A program that cannot be closed",
            "A server crash",
          ],
          answerIndex: 1,
          explanation:
            "Deadlock happens when a cycle of dependencies exists between threads waiting for locks.",
        },
        {
          id: "prog-24",
          question: "What is the difference between a Process and a Thread?",
          options: [
            "Threads share the same memory space; Processes have their own",
            "Processes are faster than threads",
            "Threads cannot run in parallel",
            "Processes do not use CPU",
          ],
          answerIndex: 0,
          explanation:
            "Processes are independent execution units; threads are subsets of a process sharing memory.",
        },
        {
          id: "prog-25",
          question: "Which of these is an 'Atomic' operation?",
          options: [
            "A complex math equation",
            "An operation that completes in a single step without interruption",
            "A function that calls an API",
            "A loop that runs 100 times",
          ],
          answerIndex: 1,
          explanation:
            "Atomic operations are indivisible; other threads cannot see them in a partial state.",
        },
        {
          id: "prog-26",
          question: "What is 'Context Switching'?",
          options: [
            "Changing the programming language",
            "The process of the CPU storing state of a thread to start another",
            "Moving code from dev to production",
            "Replacing a variable with a constant",
          ],
          answerIndex: 1,
          explanation:
            "Context switching allows multitasking by saving and loading execution states.",
        },
        {
          id: "prog-27",
          question: "What is a 'Thread Pool'?",
          options: [
            "A group of threads waiting for work to avoid the cost of creation",
            "A memory region for threads",
            "A debugging tool for concurrent code",
            "A collection of recursive functions",
          ],
          answerIndex: 0,
          explanation:
            "Thread pools reuse existing threads to improve performance and resource management.",
        },
        {
          id: "prog-28",
          question: "What does 'Starvation' mean in OS scheduling?",
          options: [
            "The computer is out of power",
            "A process is perpetually denied necessary resources",
            "The hard drive is full",
            "The network is disconnected",
          ],
          answerIndex: 1,
          explanation:
            "Starvation occurs when high-priority tasks prevent low-priority tasks from ever executing.",
        },
      ],
    },
    {
      level: 6,
      title: "Advanced Algorithms & Optimization",
      description: "Efficiency at scale.",
      passScore: 6,
      questions: [
        {
          id: "prog-29",
          question: "Dijkstra's algorithm is used to find what?",
          options: [
            "The longest path in a graph",
            "The shortest path from a source to all other nodes",
            "Minimum spanning tree",
            "Nodes in a cycle",
          ],
          answerIndex: 1,
          explanation:
            "Dijkstra's is a greedy algorithm for shortest paths in graphs with non-negative weights.",
        },
        {
          id: "prog-30",
          question:
            "What is the main advantage of Dynamic Programming over simple recursion?",
          options: [
            "It is easier to write",
            "It uses less memory",
            "It avoids redundant calculations by storing subproblem results",
            "It only works for sorting",
          ],
          answerIndex: 2,
          explanation:
            "DP uses memoization or tabulation to solve subproblems only once.",
        },
        {
          id: "prog-31",
          question:
            "In Big O notation, what is the complexity of Quicksort in the absolute worst case?",
          options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
          answerIndex: 2,
          explanation:
            "If the pivot is poorly chosen (e.g., already sorted array), Quicksort degrades to O(n^2).",
        },
        {
          id: "prog-32",
          question: "What is a 'Greedy' algorithm?",
          options: [
            "An algorithm that takes all available RAM",
            "An algorithm that makes the locally optimal choice at each step",
            "An algorithm that tries every possible combination",
            "A sorting algorithm",
          ],
          answerIndex: 1,
          explanation:
            "Greedy algorithms hope that local optimums lead to a global optimum.",
        },
        {
          id: "prog-33",
          question:
            "What does the 'Traveling Salesperson Problem' represent in complexity theory?",
          options: [
            "P complexity",
            "NP-Hard complexity",
            "O(1) complexity",
            "Logarithmic complexity",
          ],
          answerIndex: 1,
          explanation:
            "TSP is a classic NP-Hard problem where finding the optimal path is computationally expensive.",
        },
        {
          id: "prog-34",
          question:
            "Which data structure is essential for implementing Kruskal’s Algorithm?",
          options: ["Stack", "Disjoint Set Union (DSU)", "Queue", "Hash Table"],
          answerIndex: 1,
          explanation:
            "DSU (Union-Find) is used to detect cycles while building the Minimum Spanning Tree.",
        },
        {
          id: "prog-35",
          question:
            "What is the time complexity of building a Heap from an array of size N?",
          options: ["O(n log n)", "O(n)", "O(1)", "O(n^2)"],
          answerIndex: 1,
          explanation:
            "While inserting N times is O(n log n), the 'buildHeap' algorithm is mathematically O(n).",
        },
        {
          id: "prog-36",
          question: "What is 'Memoization'?",
          options: [
            "Writing notes in code",
            "Caching the results of expensive function calls",
            "Managing memory manually",
            "Increasing CPU clock speed",
          ],
          answerIndex: 1,
          explanation:
            "Memoization is a technique used to speed up programs by storing results of heavy computations.",
        },
      ],
    },
    {
      level: 7,
      title: "System Design & Architecture",
      description: "Building scalable software systems.",
      passScore: 6,
      questions: [
        {
          id: "prog-37",
          question: "What does the 'S' in SOLID stand for?",
          options: [
            "Secure Coding",
            "Single Responsibility Principle",
            "System Integration",
            "Static Typing",
          ],
          answerIndex: 1,
          explanation:
            "SRP states that a class should have only one reason to change.",
        },
        {
          id: "prog-38",
          question:
            "Which pattern provides a single point of entry for a group of interfaces in a subsystem?",
          options: [
            "Factory Pattern",
            "Singleton Pattern",
            "Facade Pattern",
            "Observer Pattern",
          ],
          answerIndex: 2,
          explanation:
            "The Facade pattern simplifies complex systems by providing a unified interface.",
        },
        {
          id: "prog-39",
          question: "What is 'Horizontal Scaling'?",
          options: [
            "Adding more RAM to a single server",
            "Adding more machines to a pool of resources",
            "Optimizing the code to run faster",
            "Changing the database schema",
          ],
          answerIndex: 1,
          explanation:
            "Horizontal scaling (scaling out) involves adding more servers to handle load.",
        },
        {
          id: "prog-40",
          question:
            "In a Microservices architecture, what is an 'API Gateway'?",
          options: [
            "A database for storing API keys",
            "A server that acts as an entry point for all client requests",
            "A firewall",
            "A type of load balancer",
          ],
          answerIndex: 1,
          explanation:
            "The gateway routes requests, handles authentication, and aggregates responses.",
        },
        {
          id: "prog-41",
          question: "What is 'Idempotency' in the context of APIs?",
          options: [
            "An API that never fails",
            "An operation that can be performed multiple times with the same result",
            "The speed of an API call",
            "A secure way to store passwords",
          ],
          answerIndex: 1,
          explanation:
            "An idempotent request (like GET or PUT) results in the same state no matter how many times it's called.",
        },
        {
          id: "prog-42",
          question:
            "Which CAP theorem property ensures all nodes see the same data at the same time?",
          options: [
            "Consistency",
            "Availability",
            "Partition Tolerance",
            "Concurrency",
          ],
          answerIndex: 0,
          explanation:
            "Consistency ensures every read receives the most recent write or an error.",
        },
        {
          id: "prog-43",
          question: "What is the primary purpose of a 'Load Balancer'?",
          options: [
            "To encrypt data",
            "To distribute incoming network traffic across multiple servers",
            "To back up the database",
            "To speed up the internet",
          ],
          answerIndex: 1,
          explanation:
            "Load balancers prevent any single server from becoming a bottleneck.",
        },
        {
          id: "prog-44",
          question: "What is 'Dependency Injection' used for?",
          options: [
            "To increase code coupling",
            "To inject viruses into a system",
            "To achieve loose coupling and easier testing",
            "To automate database backups",
          ],
          answerIndex: 2,
          explanation:
            "DI allows a class's dependencies to be provided externally rather than hard-coded.",
        },
      ],
    },
    {
      level: 8,
      title: "Advanced Web & Networking",
      description: "Protocols and the modern web stack.",
      passScore: 6,
      questions: [
        {
          id: "prog-45",
          question: "What is the main difference between HTTP/1.1 and HTTP/2?",
          options: [
            "HTTP/2 is text-based",
            "HTTP/2 supports multiplexing over a single connection",
            "HTTP/1.1 is more secure",
            "HTTP/2 does not use headers",
          ],
          answerIndex: 1,
          explanation:
            "HTTP/2 allows multiple requests and responses to be sent simultaneously over one TCP connection.",
        },
        {
          id: "prog-46",
          question: "What is a 'Websocket'?",
          options: [
            "A type of encrypted hard drive",
            "A protocol for full-duplex communication over a single TCP connection",
            "A CSS framework",
            "A JavaScript library for UI",
          ],
          answerIndex: 1,
          explanation:
            "Websockets allow persistent connections for real-time data flow.",
        },
        {
          id: "prog-47",
          question: "What does 'CORS' stand for?",
          options: [
            "Cross-Origin Resource Sharing",
            "Centralized Object Recovery System",
            "Core Object Relationship Schema",
            "Customized Origin Redirect Service",
          ],
          answerIndex: 0,
          explanation:
            "CORS is a security feature that controls how resources are requested from different domains.",
        },
        {
          id: "prog-48",
          question: "What is the purpose of a 'Reverse Proxy'?",
          options: [
            "To hide the user's IP",
            "To protect and manage servers by intercepting requests from the internet",
            "To speed up local loops",
            "To bypass firewalls",
          ],
          answerIndex: 1,
          explanation:
            "A reverse proxy (like Nginx) sits in front of web servers to handle load balancing and security.",
        },
        {
          id: "prog-49",
          question: "What is the 'Event Loop' in JavaScript?",
          options: [
            "A way to write infinite loops",
            "The mechanism that allows non-blocking I/O by offloading tasks",
            "A graphical tool for events",
            "A type of database trigger",
          ],
          answerIndex: 1,
          explanation:
            "The event loop monitors the call stack and callback queue to handle asynchronous tasks.",
        },
        {
          id: "prog-50",
          question: "What is a 'JWT' (JSON Web Token) typically used for?",
          options: [
            "Storing large images",
            "Authentication and secure information exchange",
            "Database indexing",
            "Compiling code",
          ],
          answerIndex: 1,
          explanation:
            "JWTs are compact, URL-safe means of representing claims between two parties.",
        },
        {
          id: "prog-51",
          question:
            "What is 'Hydration' in modern frontend frameworks (like React/Next.js)?",
          options: [
            "Cleaning the code of bugs",
            "Attaching event listeners to static HTML sent from the server",
            "Downloading all images at once",
            "Allocating memory for variables",
          ],
          answerIndex: 1,
          explanation:
            "Hydration makes a server-rendered page interactive by initializing the client-side scripts.",
        },
        {
          id: "prog-52",
          question: "Which HTTP status code represents 'Permanent Redirect'?",
          options: ["301", "302", "404", "500"],
          answerIndex: 0,
          explanation:
            "301 indicates the resource has been moved permanently to a new URL.",
        },
      ],
    },
    {
      level: 9,
      title: "Security & Cryptography",
      description: "Protecting data and systems.",
      passScore: 4,
      questions: [
        {
          id: "prog-53",
          question: "What is 'Salting' in the context of password storage?",
          options: [
            "Encrypting the whole database",
            "Adding random data to a password before hashing",
            "Making the password longer",
            "Deleting old passwords",
          ],
          answerIndex: 1,
          explanation:
            "Salting ensures that the same password results in a different hash, preventing rainbow table attacks.",
        },
        {
          id: "prog-54",
          question: "What is a 'SQL Injection'?",
          options: [
            "A way to speed up queries",
            "Inserting malicious SQL code into input fields to manipulate a database",
            "Updating a database driver",
            "A type of database join",
          ],
          answerIndex: 1,
          explanation:
            "SQLi allows attackers to bypass authentication or view unauthorized data.",
        },
        {
          id: "prog-55",
          question:
            "What is the difference between Symmetric and Asymmetric encryption?",
          options: [
            "Symmetric uses one key for both encryption and decryption; Asymmetric uses two",
            "Asymmetric is faster",
            "Symmetric is only for text",
            "There is no difference",
          ],
          answerIndex: 0,
          explanation:
            "Asymmetric (Public/Private key) allows secure communication without sharing a secret key first.",
        },
        {
          id: "prog-56",
          question: "What is 'Cross-Site Scripting' (XSS)?",
          options: [
            "Cracking a server password",
            "Injecting malicious scripts into web pages viewed by other users",
            "Stealing a Wi-Fi signal",
            "A way to style websites",
          ],
          answerIndex: 1,
          explanation:
            "XSS occurs when an application includes untrusted data in a web page without proper validation.",
        },
      ],
    },
  ],
};
