import { TopicData } from "@/app/practice/data/types";

export const pythonMasteryData: TopicData = {
    slug: "python-mastery",
    title: "Python Mastery",
    intro: "From basic syntax to advanced concepts in Python programming.",
    levels: [
      {
        level: 1,
        title: "Level 1: Python Basics",
        description: "Fundamental syntax, variables, and data types.",
        passScore: 16,
        questions: [
          {
            id: "py-1-1",
            question: "Which keyword is used to define a function in Python?",
            options: ["func", "define", "def", "function"],
            answerIndex: 2,
            explanation: "The 'def' keyword starts the definition of a reusable block of code."
          },
          {
            id: "py-1-2",
            question: "How do you create a variable with the numeric value 5?",
            options: ["x = 5", "int x = 5", "var x = 5", "x := 5"],
            answerIndex: 0,
            explanation: "Python is dynamically typed; you don't need to declare the type explicitly."
          },
          {
            id: "py-1-3",
            question: "Which data type is used to store text?",
            options: ["char", "text", "str", "string"],
            answerIndex: 2,
            explanation: "Python uses 'str' for string sequences, which can be enclosed in single or double quotes."
          },
          {
            id: "py-1-4",
            question: "What is the output of print(type(10.5))?",
            options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'num'>"],
            answerIndex: 1,
            explanation: "Numbers with decimals are recognized as the 'float' class."
          },
          {
            id: "py-1-5",
            question: "Which of these is the correct way to write a comment?",
            options: ["// comment", "/* comment */", "# comment", "-- comment"],
            answerIndex: 2,
            explanation: "The hash character (#) is used for single-line comments in Python."
          },
          {
            id: "py-1-6",
            question: "Which operator is used for exponentiation (power)?",
            options: ["^", "**", "//", "pow"],
            answerIndex: 1,
            explanation: "While 'pow()' is a function, '**' is the standard operator for powers (e.g., 2**3 = 8)."
          },
          {
            id: "py-1-7",
            question: "What does the floor division operator (//) do?",
            options: ["Returns the remainder", "Returns the quotient as a float", "Divides and rounds down to the nearest integer", "Multiplies twice"],
            answerIndex: 2,
            explanation: "Floor division discards the fractional part (e.g., 7 // 2 results in 3)."
          },
          {
            id: "py-1-8",
            question: "How do you start a multi-line string?",
            options: ["'''", "###", "---", "[[["],
            answerIndex: 0,
            explanation: "Triple quotes (''' or \"\"\") allow strings to span multiple lines."
          },
          {
            id: "py-1-9",
            question: "Is Python case-sensitive?",
            options: ["Yes", "No", "Only for variables", "Only for functions"],
            answerIndex: 0,
            explanation: "'Variable' and 'variable' are treated as two distinct names in Python."
          },
          {
            id: "py-1-10",
            question: "Which function is used to get user input?",
            options: ["get()", "scanf()", "input()", "read()"],
            answerIndex: 2,
            explanation: "The input() function always returns the data as a string."
          },
          {
            id: "py-1-11",
            question: "What is the result of 3 + 2 * 2?",
            options: ["10", "7", "8", "9"],
            answerIndex: 1,
            explanation: "Python follows PEMDAS order; multiplication happens before addition."
          },
          {
            id: "py-1-12",
            question: "Which keyword converts a value to an integer?",
            options: ["to_int()", "Integer()", "int()", "parse_int()"],
            answerIndex: 2,
            explanation: "Casting functions like int(), float(), and str() change data types."
          },
          {
            id: "py-1-13",
            question: "What is the boolean value of an empty string?",
            options: ["True", "False", "None", "Error"],
            answerIndex: 1,
            explanation: "In Python, empty collections and empty strings are considered 'Falsy'."
          },
          {
            id: "py-1-14",
            question: "Which of these is a valid variable name?",
            options: ["2nd_value", "my-value", "my_value", "class"],
            answerIndex: 2,
            explanation: "Variable names cannot start with numbers, contain dashes, or use reserved keywords like 'class'."
          },
          {
            id: "py-1-15",
            question: "How do you find the length of a string?",
            options: ["string.length()", "len(string)", "size(string)", "count(string)"],
            answerIndex: 1,
            explanation: "The len() function is a built-in used for strings, lists, and other collections."
          },
          {
            id: "py-1-16",
            question: "What is 'None' in Python?",
            options: ["A zero value", "A placeholder for 'no value'", "An empty string", "A false boolean"],
            answerIndex: 1,
            explanation: "None represents the absence of a value, similar to 'null' in other languages."
          },
          {
            id: "py-1-17",
            question: "Which operator checks if two values are equal?",
            options: ["=", "==", "is", "==="],
            answerIndex: 1,
            explanation: "'=' is for assignment; '==' is for comparing values."
          },
          {
            id: "py-1-18",
            question: "What does 'is' check?",
            options: ["Equality of values", "Object identity (memory location)", "Data type", "If a variable exists"],
            answerIndex: 1,
            explanation: "'is' checks if two variables point to the exact same object in memory."
          },
          {
            id: "py-1-19",
            question: "How do you write 'Hello' in uppercase?",
            options: ["upper('Hello')", "'Hello'.toUpper()", "'Hello'.upper()", "UPPER('Hello')"],
            answerIndex: 2,
            explanation: "upper() is a string method called directly on the string object."
          },
          {
            id: "py-1-20",
            question: "Which of these is a 'f-string'?",
            options: ["f'Value: {x}'", "string(f, x)", "format(x)", "'Value: %f' % x"],
            answerIndex: 0,
            explanation: "Formatted string literals (f-strings) provide a concise way to embed expressions."
          }
        ]
      },
      {
        level: 2,
        title: "Level 2: Control Flow",
        description: "Loops, conditionals, and logical operators.",
        passScore: 16,
        questions: [
          {
            id: "py-2-1",
            question: "What determines a block of code in Python?",
            options: ["Curly braces {}", "Parentheses ()", "Indentation", "Semicolons ;"],
            answerIndex: 2,
            explanation: "Python uses whitespace (usually 4 spaces) to define scopes instead of symbols."
          },
          {
            id: "py-2-2",
            question: "Which keyword is used for multi-way branching?",
            options: ["else if", "elseif", "elif", "case"],
            answerIndex: 2,
            explanation: "'elif' is short for 'else if' and prevents excessive nesting."
          },
          {
            id: "py-2-3",
            question: "What will range(5) generate?",
            options: ["[1, 2, 3, 4, 5]", "0 to 4", "1 to 4", "0 to 5"],
            answerIndex: 1,
            explanation: "The stop value in range() is exclusive; it starts at 0 by default."
          },
          {
            id: "py-2-4",
            question: "Which loop is best for iterating over a collection?",
            options: ["for loop", "while loop", "do-while loop", "foreach loop"],
            answerIndex: 0,
            explanation: "Python's 'for' loop is an iterator-based loop, similar to 'for-each' in Java."
          },
          {
            id: "py-2-5",
            question: "How do you exit a loop prematurely?",
            options: ["exit", "stop", "break", "return"],
            answerIndex: 2,
            explanation: "The 'break' statement terminates the loop immediately."
          },
          {
            id: "py-2-6",
            question: "How do you skip the current iteration and move to the next?",
            options: ["skip", "pass", "continue", "next"],
            answerIndex: 2,
            explanation: "'continue' stops the current cycle and returns to the top of the loop."
          },
          {
            id: "py-2-7",
            question: "What does the 'pass' keyword do?",
            options: ["Exits the program", "Does nothing (placeholder)", "Returns a value", "Ignores errors"],
            answerIndex: 1,
            explanation: "It is used when a statement is syntactically required but you don't want any action."
          },
          {
            id: "py-2-8",
            question: "Which operator represents 'logical AND'?",
            options: ["&&", "and", "&", "AND"],
            answerIndex: 1,
            explanation: "Python uses plain English words ('and', 'or', 'not') for logical operations."
          },
          {
            id: "py-2-9",
            question: "What is the output of 'while False: print('Hi')'?",
            options: ["Prints 'Hi' once", "Infinite loop", "Nothing prints", "Error"],
            answerIndex: 2,
            explanation: "The condition is checked before the first run; if False, the body never executes."
          },
          {
            id: "py-2-10",
            question: "How do you check if a value exists in a list?",
            options: ["list.contains(val)", "val in list", "list.has(val)", "find(val, list)"],
            answerIndex: 1,
            explanation: "The 'in' operator is the idiomatic way to check for membership."
          },
          {
            id: "py-2-11",
            question: "What does range(2, 10, 2) produce?",
            options: ["2, 4, 6, 8", "2, 4, 6, 8, 10", "10, 8, 6, 4, 2", "2, 3, 4"],
            answerIndex: 0,
            explanation: "The third argument is the 'step' value (increment)."
          },
          {
            id: "py-2-12",
            question: "Which of these can have an optional 'else' block in Python?",
            options: ["if only", "if and loops", "functions", "classes"],
            answerIndex: 1,
            explanation: "Loops can have an 'else' block that runs if the loop finished naturally without a 'break'."
          },
          {
            id: "py-2-13",
            question: "What is the ternary operator equivalent in Python?",
            options: ["x ? a : b", "if x then a else b", "a if x else b", "x(a, b)"],
            answerIndex: 2,
            explanation: "This conditional expression allows one-line assignments based on a condition."
          },
          {
            id: "py-2-14",
            question: "What happens if a loop has no indentation?",
            options: ["It runs normally", "SyntaxError", "It runs once", "IndentationError"],
            answerIndex: 3,
            explanation: "Python strictly enforces indentation for logical blocks."
          },
          {
            id: "py-2-15",
            question: "Which loop checks the condition *before* execution?",
            options: ["for", "while", "Both", "Neither"],
            answerIndex: 2,
            explanation: "Both 'for' and 'while' are entry-controlled loops."
          },
          {
            id: "py-2-16",
            question: "What does 'not True' return?",
            options: ["True", "False", "None", "0"],
            answerIndex: 1,
            explanation: "The 'not' operator inverts a boolean value."
          },
          {
            id: "py-2-17",
            question: "How many times will 'for i in range(1, 1):' run?",
            options: ["1", "0", "Infinite", "Error"],
            answerIndex: 1,
            explanation: "If the start and stop values are the same, the sequence is empty."
          },
          {
            id: "py-2-18",
            question: "What is a 'nested' loop?",
            options: ["A loop inside a function", "A loop inside another loop", "A loop that never ends", "A loop using a list"],
            answerIndex: 1,
            explanation: "Nested loops are used for multi-dimensional data like matrices."
          },
          {
            id: "py-2-19",
            question: "Which operator represents 'logical OR'?",
            options: ["||", "or", "|", "OR"],
            answerIndex: 1,
            explanation: "Like 'and', 'or' is a reserved keyword for logical comparisons."
          },
          {
            id: "py-2-20",
            question: "What is the result of 5 > 3 and 2 > 4?",
            options: ["True", "False", "None", "Error"],
            answerIndex: 1,
            explanation: "Both sides must be True for an 'and' expression to be True."
          }
        ]
      },
      {
        level: 3,
        title: "Level 3: Data Structures",
        description: "Lists, Tuples, Sets, and Dictionaries.",
        passScore: 16,
        questions: [
          {
            id: "py-3-1",
            question: "Which symbol defines a List?",
            options: ["()", "{}", "[]", "<>"],
            answerIndex: 2,
            explanation: "Lists are ordered, mutable collections defined with square brackets."
          },
          {
            id: "py-3-2",
            question: "What is the main difference between a List and a Tuple?",
            options: ["Tuples are faster", "Lists are mutable, Tuples are immutable", "Tuples use square brackets", "There is no difference"],
            answerIndex: 1,
            explanation: "Once a Tuple is created, its elements cannot be changed."
          },
          {
            id: "py-3-3",
            question: "Which collection stores unique items with no order?",
            options: ["List", "Tuple", "Set", "Dictionary"],
            answerIndex: 2,
            explanation: "Sets automatically remove duplicates and do not support indexing."
          },
          {
            id: "py-3-4",
            question: "Which collection uses key-value pairs?",
            options: ["List", "Dictionary", "Tuple", "Array"],
            answerIndex: 1,
            explanation: "Dictionaries (dict) allow for fast lookups using unique keys."
          },
          {
            id: "py-3-5",
            question: "How do you add an item to the end of a list?",
            options: ["list.add()", "list.push()", "list.append()", "list.insert()"],
            answerIndex: 2,
            explanation: "append() adds a single element to the tail of the list."
          },
          {
            id: "py-3-6",
            question: "What is 'Slicing'?",
            options: ["Deleting an item", "Extracting a sub-part of a list or string", "Sorting a list", "Splitting a dictionary"],
            answerIndex: 1,
            explanation: "Syntax like list[start:stop] is used to get a portion of the data."
          },
          {
            id: "py-3-7",
            question: "How do you get a value from a dictionary safely?",
            options: ["dict[key]", "dict.get(key)", "dict.fetch(key)", "dict.val(key)"],
            answerIndex: 1,
            explanation: "get() returns None instead of crashing if the key doesn't exist."
          },
          {
            id: "py-3-8",
            question: "Which method removes and returns the last item from a list?",
            options: ["remove()", "delete()", "pop()", "discard()"],
            answerIndex: 2,
            explanation: "pop() can also take an index to remove a specific item."
          },
          {
            id: "py-3-9",
            question: "What symbol defines a Dictionary?",
            options: ["[]", "()", "{}", "||"],
            answerIndex: 2,
            explanation: "Dictionaries use curly braces with 'key: value' syntax."
          },
          {
            id: "py-3-10",
            question: "What is the output of [1, 2] + [3, 4]?",
            options: ["[4, 6]", "[[1, 2], [3, 4]]", "[1, 2, 3, 4]", "Error"],
            answerIndex: 2,
            explanation: "The '+' operator concatenates (joins) two lists together."
          },
          {
            id: "py-3-11",
            question: "Can a dictionary key be a list?",
            options: ["Yes", "No", "Only if it's small", "Only in Python 2"],
            answerIndex: 1,
            explanation: "Dictionary keys must be 'hashable' (immutable). Lists are mutable, so they cannot be keys."
          },
          {
            id: "py-3-12",
            question: "Which method removes all items from a list?",
            options: ["list.clear()", "list.empty()", "list.reset()", "list.delete_all()"],
            answerIndex: 0,
            explanation: "clear() empties the collection but keeps the variable alive."
          },
          {
            id: "py-3-13",
            question: "How do you join a list of strings into one string?",
            options: ["list.join()", "join(list)", "' '.join(list)", "list.to_string()"],
            answerIndex: 2,
            explanation: "The join() method is called on the separator string, not the list."
          },
          {
            id: "py-3-14",
            question: "What does list[::-1] do?",
            options: ["Returns the first item", "Returns the last item", "Reverses the list", "Sorts the list"],
            answerIndex: 2,
            explanation: "This slice uses a step of -1 to walk backward through the collection."
          },
          {
            id: "py-3-15",
            question: "Which method adds multiple items to a list at once?",
            options: ["append()", "extend()", "update()", "add_many()"],
            answerIndex: 1,
            explanation: "extend() takes an iterable (like another list) and adds all its elements."
          },
          {
            id: "py-3-16",
            question: "What is a 'List Comprehension'?",
            options: ["A list with comments", "A concise way to create lists using a loop in one line", "A list of complex numbers", "A way to read lists"],
            answerIndex: 1,
            explanation: "Example: [x*x for x in range(5)] creates a list of squares."
          },
          {
            id: "py-3-17",
            question: "How do you create an empty set?",
            options: ["{}", "set()", "[]", "tuple()"],
            answerIndex: 1,
            explanation: "{} creates an empty dictionary, so you must use the set() constructor."
          },
          {
            id: "py-3-18",
            question: "What happens if you add a duplicate to a Set?",
            options: ["Error", "It is ignored", "It replaces the old one", "It is stored twice"],
            answerIndex: 1,
            explanation: "Sets enforce uniqueness; adding an existing item does nothing."
          },
          {
            id: "py-3-19",
            question: "Which method returns all keys in a dictionary?",
            options: ["dict.all_keys()", "dict.keys()", "dict.names()", "dict.index()"],
            answerIndex: 1,
            explanation: "It returns a view object that updates if the dictionary changes."
          },
          {
            id: "py-3-20",
            question: "How do you sort a list in-place?",
            options: ["sorted(list)", "list.sort()", "list.order()", "sort(list)"],
            answerIndex: 1,
            explanation: "list.sort() modifies the original list, while sorted() returns a new one."
          }
        ]
      },
      {
      level: 4,
      title: "Level 4: Functions & Scope",
      description: "Writing modular code and understanding variable reach.",
      passScore: 16,
      questions: [
        {
          id: "py-4-1",
          question: "How do you call a function named 'my_func'?",
          options: ["call my_func()", "my_func()", "run my_func", "execute my_func"],
          answerIndex: 1,
          explanation: "In Python, you invoke a function by using its name followed by parentheses."
        },
        {
          id: "py-4-2",
          question: "What are 'Arguments' in a function?",
          options: ["Errors in code", "Values passed into the function", "The function's name", "The return value"],
          answerIndex: 1,
          explanation: "Arguments (args) provide data for the function to process."
        },
        {
          id: "py-4-3",
          question: "Which keyword is used to send a value back to the caller?",
          options: ["send", "output", "return", "give"],
          answerIndex: 2,
          explanation: "The 'return' statement exits a function and optionally passes back data."
        },
        {
          id: "py-4-4",
          question: "What does a function return by default if no return is specified?",
          options: ["0", "False", "None", "Empty string"],
          answerIndex: 2,
          explanation: "Every Python function returns 'None' implicitly if it reaches the end without a return."
        },
        {
          id: "py-4-5",
          question: "What is a 'Local Variable'?",
          options: ["A variable available everywhere", "A variable defined inside a function", "A global constant", "A variable stored on disk"],
          answerIndex: 1,
          explanation: "Local variables only exist while the function is executing."
        },
        {
          id: "py-4-6",
          question: "Which keyword allows you to modify a variable outside the function?",
          options: ["extern", "global", "outer", "public"],
          answerIndex: 1,
          explanation: "Using 'global' tells Python to use the variable from the top-level scope."
        },
        {
          id: "py-4-7",
          question: "What are 'Default Arguments'?",
          options: ["Arguments that are always required", "Pre-set values used if the caller doesn't provide them", "Hidden arguments", "Errors"],
          answerIndex: 1,
          explanation: "Example: def greet(name='User'): allows calling greet() without a name."
        },
        {
          id: "py-4-8",
          question: "What does *args allow in a function definition?",
          options: ["One argument only", "A variable number of positional arguments", "Keyword arguments only", "Nothing"],
          answerIndex: 1,
          explanation: "It packs multiple arguments into a tuple named 'args'."
        },
        {
          id: "py-4-9",
          question: "What does **kwargs allow?",
          options: ["A list of numbers", "A variable number of keyword (named) arguments", "A tuple of strings", "An error handle"],
          answerIndex: 1,
          explanation: "It packs named arguments into a dictionary."
        },
        {
          id: "py-4-10",
          question: "What is a Lambda function?",
          options: ["A large function", "An anonymous, one-line function", "A function that runs forever", "A built-in math function"],
          answerIndex: 1,
          explanation: "Lambdas are used for short, throwaway logic using the 'lambda' keyword."
        },
        {
          id: "py-4-11",
          question: "What is the result of (lambda x: x + 1)(5)?",
          options: ["5", "1", "6", "Error"],
          answerIndex: 2,
          explanation: "The lambda adds 1 to the input 5 and returns the result."
        },
        {
          id: "py-4-12",
          question: "What is 'Docstring'?",
          options: ["A string that prints errors", "A string used to document a function/class", "A list of strings", "A secret code"],
          answerIndex: 1,
          explanation: "Written with triple quotes at the start of a function, it explains what the code does."
        },
        {
          id: "py-4-13",
          question: "Which keyword is used for 'non-local' variables in nested functions?",
          options: ["global", "nonlocal", "parent", "inner"],
          answerIndex: 1,
          explanation: "It allows a nested function to modify a variable in the nearest enclosing scope."
        },
        {
          id: "py-4-14",
          question: "Can a function return multiple values in Python?",
          options: ["No", "Yes, as a tuple", "Only if they are strings", "Only in Python 3.12+"],
          answerIndex: 1,
          explanation: "Returning 'a, b' actually returns a single tuple (a, b)."
        },
        {
          id: "py-4-15",
          question: "What is 'Recursion'?",
          options: ["A function calling itself", "A loop that never ends", "A type of variable", "A sorting algorithm"],
          answerIndex: 0,
          explanation: "Recursive functions break problems into smaller versions of themselves."
        },
        {
          id: "py-4-16",
          question: "What is the 'Scope' of a variable?",
          options: ["Its memory size", "The region of code where it is accessible", "Its data type", "The time it takes to run"],
          answerIndex: 1,
          explanation: "Python follows the LEGB rule (Local, Enclosing, Global, Built-in)."
        },
        {
          id: "py-4-17",
          question: "Which function tells you which names are in the current scope?",
          options: ["list()", "dir()", "names()", "vars()"],
          answerIndex: 1,
          explanation: "dir() returns a list of valid attributes for an object or scope."
        },
        {
          id: "py-4-18",
          question: "What is a 'Pure Function'?",
          options: ["A function with no return", "A function that doesn't modify outside state", "A function with only integers", "A fast function"],
          answerIndex: 1,
          explanation: "It always produces the same output for the same input and has no side effects."
        },
        {
          id: "py-4-19",
          question: "What is 'Callback'?",
          options: ["A function passed as an argument to another function", "Returning a value", "An error message", "A phone number variable"],
          answerIndex: 0,
          explanation: "Commonly used in event-driven programming and sorting."
        },
        {
          id: "py-4-20",
          question: "How do you check if an object is 'callable'?",
          options: ["is_callable(obj)", "callable(obj)", "obj.can_run()", "try_run(obj)"],
          answerIndex: 1,
          explanation: "The callable() function returns True if the object can be invoked like a function."
        }
      ]
    },
    {
      level: 5,
      title: "Level 5: Modules & File I/O",
      description: "Organizing code into files and handling external data.",
      passScore: 16,
      questions: [
        {
          id: "py-5-1",
          question: "Which keyword is used to include code from another file?",
          options: ["require", "import", "include", "use"],
          answerIndex: 1,
          explanation: "The 'import' statement allows you to access functions and classes in other modules."
        },
        {
          id: "py-5-2",
          question: "How do you import a specific function 'math.sqrt'?",
          options: ["import math(sqrt)", "from math import sqrt", "math.import(sqrt)", "import sqrt from math"],
          answerIndex: 1,
          explanation: "This syntax allows you to use 'sqrt()' directly without the 'math.' prefix."
        },
        {
          id: "py-5-3",
          question: "How do you rename an imported module for convenience?",
          options: ["import pandas as pd", "rename pandas to pd", "import pandas into pd", "pd = import pandas"],
          answerIndex: 0,
          explanation: "The 'as' keyword creates an alias, commonly used for libraries like NumPy and Pandas."
        },
        {
          id: "py-5-4",
          question: "Which function is used to open a file?",
          options: ["file()", "read()", "open()", "access()"],
          answerIndex: 2,
          explanation: "The open() function returns a file object to interact with."
        },
        {
          id: "py-5-5",
          question: "What is the recommended way to open a file so it closes automatically?",
          options: ["file.open()", "with open(...) as f:", "open(...) then close()", "try open(...)"],
          answerIndex: 1,
          explanation: "The 'with' statement (context manager) ensures the file is closed even if an error occurs."
        },
        {
          id: "py-5-6",
          question: "What does the 'w' mode mean in open()?",
          options: ["Read only", "Write (overwrites existing content)", "Wait for input", "Windows mode"],
          answerIndex: 1,
          explanation: "It creates the file if it doesn't exist or truncates it if it does."
        },
        {
          id: "py-5-7",
          question: "What does the 'a' mode mean in open()?",
          options: ["Absolute", "Append", "Array", "All"],
          answerIndex: 1,
          explanation: "It adds new data to the end of the file without deleting existing content."
        },
        {
          id: "py-5-8",
          question: "How do you read the entire content of a file into a string?",
          options: ["f.read()", "f.all()", "f.get()", "f.readline()"],
          answerIndex: 0,
          explanation: "The read() method pulls the whole file content into memory."
        },
        {
          id: "py-5-9",
          question: "What is a 'pip'?",
          options: ["A file type", "A Python package manager", "A type of loop", "A data structure"],
          answerIndex: 1,
          explanation: "Pip is used to install libraries from the Python Package Index (PyPI)."
        },
        {
          id: "py-5-10",
          question: "Which file is required to treat a directory as a package?",
          options: ["main.py", "init.py", "__init__.py", "package.py"],
          answerIndex: 2,
          explanation: "Though optional in modern Python, this file marks a directory as part of a package."
        },
        {
          id: "py-5-11",
          question: "Which built-in module handles directory paths and file checks?",
          options: ["sys", "path", "os", "file_io"],
          answerIndex: 2,
          explanation: "The 'os' module provides functions for interacting with the operating system."
        },
        {
          id: "py-5-12",
          question: "What is JSON?",
          options: ["A type of loop", "A lightweight data interchange format", "A Python keyword", "A database name"],
          answerIndex: 1,
          explanation: "Python's 'json' module allows converting between Python dicts and JSON strings."
        },
        {
          id: "py-5-13",
          question: "How do you convert a Python dict to a JSON string?",
          options: ["json.to_string()", "json.dump()", "json.dumps()", "json.parse()"],
          answerIndex: 2,
          explanation: "The 's' in 'dumps' stands for 'string'."
        },
        {
          id: "py-5-14",
          question: "What does f.readline() do?",
          options: ["Reads the first char", "Reads a single line from the file", "Reads the last line", "Reads all lines into a list"],
          answerIndex: 1,
          explanation: "It moves the file pointer to the next line after reading."
        },
        {
          id: "py-5-15",
          question: "Which library is commonly used for math and science?",
          options: ["maths", "math", "numbers", "calculate"],
          answerIndex: 1,
          explanation: "The 'math' module contains constants like pi and functions like log and cos."
        },
        {
          id: "py-5-16",
          question: "How do you list all files in a folder using 'os'?",
          options: ["os.list()", "os.listdir()", "os.files()", "os.show()"],
          answerIndex: 1,
          explanation: "It returns a list containing the names of the entries in the directory."
        },
        {
          id: "py-5-17",
          question: "What does the 'b' in 'rb' mode stand for?",
          options: ["Backup", "Basic", "Binary", "Block"],
          answerIndex: 2,
          explanation: "Used for reading non-text files like images or executables."
        },
        {
          id: "py-5-18",
          question: "Which built-in module handles dates and times?",
          options: ["time", "calendar", "datetime", "clock"],
          answerIndex: 2,
          explanation: "The 'datetime' module is used to work with dates, times, and time intervals."
        },
        {
          id: "py-5-19",
          question: "How do you check if a file exists before opening it?",
          options: ["file.exists()", "os.path.exists()", "check_file()", "exists()"],
          answerIndex: 1,
          explanation: "This prevents errors if the file is missing."
        },
        {
          id: "py-5-20",
          question: "What is a 'virtual environment'?",
          options: ["A cloud PC", "An isolated environment for project-specific dependencies", "A type of loop", "A fast compiler"],
          answerIndex: 1,
          explanation: "Tools like 'venv' prevent version conflicts between different Python projects."
        }
      ]
    },
    {
      level: 6,
      title: "Level 6: Error Handling",
      description: "Managing crashes and exceptions gracefully.",
      passScore: 16,
      questions: [
        {
          id: "py-6-1",
          question: "What is an 'Exception' in Python?",
          options: ["A cool feature", "An error that occurs during program execution", "A syntax mistake", "A type of variable"],
          answerIndex: 1,
          explanation: "Unlike syntax errors, exceptions happen while the code is running."
        },
        {
          id: "py-6-2",
          question: "Which block is used to catch an exception?",
          options: ["catch", "handle", "except", "error"],
          answerIndex: 2,
          explanation: "Python uses 'try...except' blocks instead of 'try...catch'."
        },
        {
          id: "py-6-3",
          question: "What happens if an exception occurs but is not caught?",
          options: ["It is ignored", "The program crashes and prints a traceback", "The PC restarts", "It retries automatically"],
          answerIndex: 1,
          explanation: "Python stops the script and shows the error details."
        },
        {
          id: "py-6-4",
          question: "Which block runs regardless of whether an exception occurred?",
          options: ["finally", "always", "else", "finish"],
          answerIndex: 0,
          explanation: "Commonly used for cleanup tasks like closing files or database connections."
        },
        {
          id: "py-6-5",
          question: "Which keyword is used to manually trigger an error?",
          options: ["throw", "trigger", "raise", "error"],
          answerIndex: 2,
          explanation: "You can use 'raise' to signal that something went wrong."
        },
        {
          id: "py-6-6",
          question: "What does an 'else' block do in a try-except structure?",
          options: ["Runs if an exception happened", "Runs only if NO exception occurred", "Runs first", "Nothing"],
          answerIndex: 1,
          explanation: "It separates the logic that might fail from the logic that should run after success."
        },
        {
          id: "py-6-7",
          question: "Which exception occurs when dividing by zero?",
          options: ["MathError", "ZeroDivisionError", "DivError", "NullError"],
          answerIndex: 1,
          explanation: "Python provides specific exception types for different error cases."
        },
        {
          id: "py-6-8",
          question: "How do you catch a specific error and give it a name?",
          options: ["except Error(e):", "except Error as e:", "except e from Error:", "catch Error e:"],
          answerIndex: 1,
          explanation: "The 'as' keyword assigns the exception object to a variable you can inspect."
        },
        {
          id: "py-6-9",
          question: "What is a 'Traceback'?",
          options: ["A list of recent files", "The report showing the sequence of function calls that led to an error", "A type of loop", "A way to undo code"],
          answerIndex: 1,
          explanation: "It helps developers find exactly where and why the program failed."
        },
        {
          id: "py-6-10",
          question: "Which exception occurs when a key is missing in a dictionary?",
          options: ["MissingError", "KeyError", "DictError", "NullKey"],
          answerIndex: 1,
          explanation: "Attempting to access dict['invalid'] triggers this."
        },
        {
          id: "py-6-11",
          question: "Which exception occurs when a list index is out of range?",
          options: ["ListError", "IndexError", "BoundError", "OutOfRange"],
          answerIndex: 1,
          explanation: "Accessing index 10 in a list of 5 items causes this."
        },
        {
          id: "py-6-12",
          question: "Which keyword is used for 'assertions' in testing?",
          options: ["check", "verify", "assert", "must"],
          answerIndex: 2,
          explanation: "It tests a condition; if False, it raises an AssertionError."
        },
        {
          id: "py-6-13",
          question: "What is the base class for all built-in exceptions?",
          options: ["RootError", "Object", "Exception", "BaseException"],
          answerIndex: 3,
          explanation: "Most user-defined errors should inherit from 'Exception'."
        },
        {
          id: "py-6-14",
          question: "Can you catch multiple specific exceptions in one block?",
          options: ["No", "Yes, using a tuple", "Only by using multiple except blocks", "Only in async code"],
          answerIndex: 1,
          explanation: "Syntax: except (TypeError, ValueError):"
        },
        {
          id: "py-6-15",
          question: "What does 'pass' do in an except block?",
          options: ["Exits the program", "Silently ignores the error", "Retries the code", "Prints 'Pass'"],
          answerIndex: 1,
          explanation: "This is often discouraged as it hides bugs, but it's valid syntax."
        },
        {
          id: "py-6-16",
          question: "Which exception occurs when you try to use a variable that hasn't been defined?",
          options: ["NameError", "VarError", "NullError", "DefineError"],
          answerIndex: 0,
          explanation: "Python cannot find the name in any scope."
        },
        {
          id: "py-6-17",
          question: "Which exception occurs when an operation is applied to the wrong data type?",
          options: ["TypeError", "ValueError", "KindError", "DataError"],
          answerIndex: 0,
          explanation: "For example, trying to add a string and an integer."
        },
        {
          id: "py-6-18",
          question: "Which exception occurs when a function gets the right type but the wrong value?",
          options: ["TypeError", "ValueError", "LogicError", "InputError"],
          answerIndex: 1,
          explanation: "Example: int('hello') — 'hello' is a string (right type for int constructor) but it can't be converted."
        },
        {
          id: "py-6-19",
          question: "How do you create a custom exception?",
          options: ["def MyError():", "class MyError(Exception):", "raise Exception('MyError')", "MyError = new Error()"],
          answerIndex: 1,
          explanation: "You define a new class that inherits from the built-in Exception class."
        },
        {
          id: "py-6-20",
          question: "What is 'Exception Chaining'?",
          options: ["Linking errors together using the 'from' keyword", "A group of loops", "Catching one error after another", "A bug"],
          answerIndex: 0,
          explanation: "It allows you to raise a new exception while preserving the context of the original one."
        }
      ]
    },
    {
      level: 7,
      title: "Level 7: Object-Oriented Programming (OOP)",
      description: "Classes, objects, and inheritance.",
      passScore: 16,
      questions: [
        {
          id: "py-7-1",
          question: "Which keyword is used to create a class?",
          options: ["struct", "object", "class", "def"],
          answerIndex: 2,
          explanation: "The 'class' keyword defines a blueprint for creating objects."
        },
        {
          id: "py-7-2",
          question: "What is the purpose of the '__init__' method?",
          options: ["To delete an object", "To initialize an object's attributes", "To import a library", "To print the class"],
          answerIndex: 1,
          explanation: "It is the constructor method that runs automatically when a new object is created."
        },
        {
          id: "py-7-3",
          question: "What does 'self' represent in a class method?",
          options: ["The class itself", "The specific instance of the object", "A global variable", "The parent class"],
          answerIndex: 1,
          explanation: "It allows the method to access attributes and other methods belonging to that specific object."
        },
        {
          id: "py-7-4",
          question: "What is 'Inheritance'?",
          options: ["Copying code manually", "A way for one class to derive attributes/methods from another", "Deleting old classes", "Private variables"],
          answerIndex: 1,
          explanation: "It promotes code reuse by allowing a 'Child' class to inherit from a 'Parent' class."
        },
        {
          id: "py-7-5",
          question: "How do you call a method from the parent class?",
          options: ["this.method()", "parent.method()", "super().method()", "base.method()"],
          answerIndex: 2,
          explanation: "The super() function returns a temporary object of the parent class."
        },
        {
          id: "py-7-6",
          question: "What is 'Encapsulation'?",
          options: ["Hiding internal details and protecting data", "Running code in a loop", "Importing many modules", "Using f-strings"],
          answerIndex: 0,
          explanation: "It restricts direct access to some components, often using underscores (e.g., _var)."
        },
        {
          id: "py-7-7",
          question: "What is 'Polymorphism'?",
          options: ["A class with many names", "The ability for different classes to be treated as the same type", "Changing data types", "Deleting objects"],
          answerIndex: 1,
          explanation: "It allows different classes to have methods with the same name but different behaviors."
        },
        {
          id: "py-7-8",
          question: "Which symbol is used for a 'private' attribute by convention?",
          options: ["$", "@", "__ (Double underscore)", "!"],
          answerIndex: 2,
          explanation: "Double underscores trigger 'Name Mangling' to make attributes harder to access from outside."
        },
        {
          id: "py-7-9",
          question: "What is a 'Class Variable'?",
          options: ["A variable unique to each object", "A variable shared by all instances of a class", "A variable inside a loop", "A global variable"],
          answerIndex: 1,
          explanation: "Unlike instance variables, class variables are defined outside any methods."
        },
        {
          id: "py-7-10",
          question: "What does the '@classmethod' decorator do?",
          options: ["Makes a method private", "Passes the class (cls) as the first argument instead of 'self'", "Deletes the method", "Speeds up the code"],
          answerIndex: 1,
          explanation: "It is used for factory methods that create class instances in different ways."
        },
        {
          id: "py-7-11",
          question: "What is a 'Static Method'?",
          options: ["A method that can't be changed", "A method that doesn't receive self or cls", "A method in a global scope", "A method with no return"],
          answerIndex: 1,
          explanation: "Defined with @staticmethod, it behaves like a regular function but belongs to the class namespace."
        },
        {
          id: "py-7-12",
          question: "What is 'Method Overriding'?",
          options: ["Writing two functions with the same name", "Redefining a parent method in a child class", "Deleting a method", "Changing arguments"],
          answerIndex: 1,
          explanation: "The child class provides its own specific implementation of a method already defined in its parent."
        },
        {
          id: "py-7-13",
          question: "What are 'Dunder' methods?",
          options: ["Fast methods", "Methods with double underscores like __str__", "Hidden methods", "Math methods"],
          answerIndex: 1,
          explanation: "Short for 'Double Under', these allow you to emulate built-in behaviors (e.g., operator overloading)."
        },
        {
          id: "py-7-14",
          question: "Which dunder method controls the string representation for users?",
          options: ["__init__", "__str__", "__repr__", "__print__"],
          answerIndex: 1,
          explanation: "It defines what print(object) displays."
        },
        {
          id: "py-7-15",
          question: "Which dunder method defines the behavior of the '+' operator?",
          options: ["__plus__", "__add__", "__sum__", "__and__"],
          answerIndex: 1,
          explanation: "By implementing __add__, you can add two custom objects together."
        },
        {
          id: "py-7-16",
          question: "What is 'Multiple Inheritance'?",
          options: ["Inheriting from two different parents", "Creating many objects", "Using many loops", "A list of classes"],
          answerIndex: 0,
          explanation: "Python allows a class to inherit features from more than one base class."
        },
        {
          id: "py-7-17",
          question: "What is 'MRO' (Method Resolution Order)?",
          options: ["A way to sort methods", "The order in which Python searches for methods in inheritance", "A memory tool", "A naming convention"],
          answerIndex: 1,
          explanation: "It ensures Python finds the correct method when multiple parents are involved."
        },
        {
          id: "py-7-18",
          question: "What does the 'isinstance()' function check?",
          options: ["If an object is empty", "If an object is an instance of a specific class", "If a variable is a string", "If a class exists"],
          answerIndex: 1,
          explanation: "It returns True if the object matches the class or a subclass thereof."
        },
        {
          id: "py-7-19",
          question: "What is an 'Abstract Base Class' (ABC)?",
          options: ["A class that cannot be instantiated", "A very fast class", "A class with no methods", "A global class"],
          answerIndex: 0,
          explanation: "It serves as a template that requires child classes to implement specific methods."
        },
        {
          id: "py-7-20",
          question: "What is 'Composition' in OOP?",
          options: ["Writing code in a file", "Combining objects to build more complex ones", "Inheriting from a class", "Sorting attributes"],
          answerIndex: 1,
          explanation: "Instead of saying 'is-a' (inheritance), it says 'has-a' (e.g., a Car HAS AN Engine)."
        }
      ]
    },
    {
      level: 8,
      title: "Level 8: Iterators & Generators",
      description: "Handling sequences and memory-efficient data streams.",
      passScore: 16,
      questions: [
        {
          id: "py-8-1",
          question: "What is an 'Iterable'?",
          options: ["A loop", "An object that can be looped over", "A math function", "A type of string"],
          answerIndex: 1,
          explanation: "Lists, tuples, and strings are all iterables."
        },
        {
          id: "py-8-2",
          question: "Which keyword turns a function into a 'Generator'?",
          options: ["return", "yield", "gen", "produce"],
          answerIndex: 1,
          explanation: "'yield' pauses the function and saves its state, returning a value one at a time."
        },
        {
          id: "py-8-3",
          question: "What is the main advantage of a Generator?",
          options: ["It is faster", "It saves memory by not storing the whole list", "It is easier to write", "It can't have errors"],
          answerIndex: 1,
          explanation: "Generators compute values on the fly (lazy evaluation)."
        },
        {
          id: "py-8-4",
          question: "Which function is used to get the next item from an iterator?",
          options: ["get()", "fetch()", "next()", "move()"],
          answerIndex: 2,
          explanation: "Calling next() moves the iterator to its following element."
        },
        {
          id: "py-8-5",
          question: "What exception is raised when an iterator is empty?",
          options: ["EmptyError", "StopIteration", "EndError", "EOFError"],
          answerIndex: 1,
          explanation: "This is how Python loops know when to stop."
        },
        {
          id: "py-8-6",
          question: "What is a 'Generator Expression'?",
          options: ["A one-line generator similar to list comprehension", "A print statement", "A type of regex", "A class method"],
          answerIndex: 0,
          explanation: "Written with parentheses: (x*x for x in range(10))."
        },
        {
          id: "py-8-7",
          question: "Can you loop over a generator more than once?",
          options: ["Yes", "No", "Only if it is small", "Only with a for loop"],
          answerIndex: 1,
          explanation: "Generators are exhausted after one full iteration."
        },
        {
          id: "py-8-8",
          question: "Which dunder method makes an object an 'iterator'?",
          options: ["__init__", "__iter__", "__next__", "Both __iter__ and __next__"],
          answerIndex: 3,
          explanation: "An iterator must implement both to be fully functional in a loop."
        },
        {
          id: "py-8-9",
          question: "What does the 'enumerate()' function do?",
          options: ["Counts items", "Returns both the index and the value during a loop", "Sorts a list", "Deletes duplicates"],
          answerIndex: 1,
          explanation: "It simplifies loops where you need the counter (e.g., for i, val in enumerate(list):)."
        },
        {
          id: "py-8-10",
          question: "What does the 'zip()' function do?",
          options: ["Compresses files", "Combines two or more iterables element-wise", "Fastens a loop", "Joins strings"],
          answerIndex: 1,
          explanation: "It pairs elements from multiple lists: zip([1, 2], ['a', 'b']) -> (1, 'a'), (2, 'b')."
        },
        {
          id: "py-8-11",
          question: "What is 'Lazy Evaluation'?",
          options: ["Writing slow code", "Delaying computation until the value is actually needed", "Using a while loop", "Ignoring errors"],
          answerIndex: 1,
          explanation: "This is the principle behind why generators are memory-efficient."
        },
        {
          id: "py-8-12",
          question: "What is the result of list(range(3))?",
          options: ["[0, 1, 2, 3]", "[1, 2, 3]", "[0, 1, 2]", "[3, 2, 1]"],
          answerIndex: 2,
          explanation: "The range object is an iterable, and list() exhausts it to create a physical list."
        },
        {
          id: "py-8-13",
          question: "Which module provides advanced iterator tools?",
          options: ["iter", "itertools", "looptools", "collections"],
          answerIndex: 1,
          explanation: "It contains functions like 'cycle', 'chain', and 'product'."
        },
        {
          id: "py-8-14",
          question: "What does 'itertools.chain()' do?",
          options: ["Locks a file", "Links multiple iterables together as one long stream", "Repeats a value", "Filters a list"],
          answerIndex: 1,
          explanation: "It allows you to iterate over multiple lists as if they were one."
        },
        {
          id: "py-8-15",
          question: "How do you turn a list into an iterator manually?",
          options: ["iter(list)", "list.to_iter()", "next(list)", "iterator(list)"],
          answerIndex: 0,
          explanation: "The iter() function calls the object's __iter__ method."
        },
        {
          id: "py-8-16",
          question: "What is a 'Finite Iterator'?",
          options: ["A loop that ends", "An iterator that eventually raises StopIteration", "A math set", "A small list"],
          answerIndex: 1,
          explanation: "Most iterators are finite, but some (like itertools.cycle) can be infinite."
        },
        {
          id: "py-8-17",
          question: "What happens if you use 'yield' and 'return' in the same function?",
          options: ["Error", "The return value ends the generator", "It works fine", "Only return works"],
          answerIndex: 1,
          explanation: "In modern Python, returning from a generator stops it and sets the return value as the StopIteration message."
        },
        {
          id: "py-8-18",
          question: "What is 'Unpacking' in a loop?",
          options: ["Deleting items", "Assigning tuple elements to variables during iteration", "Sorting items", "Opening a zip"],
          answerIndex: 1,
          explanation: "Commonly used with zip: for a, b in zipped_list:."
        },
        {
          id: "py-8-19",
          question: "Which function filters an iterable based on a condition?",
          options: ["filter()", "map()", "reduce()", "select()"],
          answerIndex: 0,
          explanation: "It takes a function and an iterable, returning only items where the function is True."
        },
        {
          id: "py-8-20",
          question: "Which function applies a logic to every item in an iterable?",
          options: ["filter()", "map()", "reduce()", "apply()"],
          answerIndex: 1,
          explanation: "Example: map(str.upper, ['a', 'b']) -> ['A', 'B']."
        }
      ]
    },
    {
      level: 9,
      title: "Level 9: Decorators & Context Managers",
      description: "Advanced functional patterns and resource control.",
      passScore: 16,
      questions: [
        {
          id: "py-9-1",
          question: "What is a 'Decorator' in Python?",
          options: ["A UI tool", "A function that modifies the behavior of another function", "A type of class", "A comment"],
          answerIndex: 1,
          explanation: "It 'wraps' another function to extend its functionality without changing its source code."
        },
        {
          id: "py-9-2",
          question: "What symbol is used to apply a decorator?",
          options: ["#", "@", "$", "&"],
          answerIndex: 1,
          explanation: "The @ symbol is placed above the function definition (e.g., @my_decorator)."
        },
        {
          id: "py-9-3",
          question: "How do you pass arguments to a decorated function?",
          options: ["Using *args and **kwargs", "Hardcoding them", "Decorators can't take arguments", "Using a list"],
          answerIndex: 0,
          explanation: "This ensures the decorator works with any number of inputs."
        },
        {
          id: "py-9-4",
          question: "What is a 'Nested Function'?",
          options: ["A function inside another function", "A loop", "A class method", "A function in a file"],
          answerIndex: 0,
          explanation: "Decorators usually define a nested 'wrapper' function."
        },
        {
          id: "py-9-5",
          question: "What is 'functools.wraps' used for?",
          options: ["Wrapping text", "Preserving the metadata (like name/docstring) of the original function", "Speeding up code", "Error handling"],
          answerIndex: 1,
          explanation: "Without it, the decorated function would appear to have the name 'wrapper'."
        },
        {
          id: "py-9-6",
          question: "What is a 'Context Manager'?",
          options: ["A project manager", "A way to manage resources like files and locks", "A type of dictionary", "A class variable"],
          answerIndex: 1,
          explanation: "It handles the setup and teardown of resources automatically."
        },
        {
          id: "py-9-7",
          question: "Which keyword triggers a context manager?",
          options: ["with", "from", "use", "open"],
          answerIndex: 0,
          explanation: "The 'with' statement ensures the '__exit__' logic runs even if errors occur."
        },
        {
          id: "py-9-8",
          question: "Which dunder methods are needed for a custom Context Manager?",
          options: ["__init__ and __del__", "__enter__ and __exit__", "__start__ and __stop__", "__with__ and __end__"],
          answerIndex: 1,
          explanation: "__enter__ prepares the resource; __exit__ cleans it up."
        },
        {
          id: "py-9-9",
          question: "What is 'functools.lru_cache'?",
          options: ["A file storage", "A decorator for memoization (caching function results)", "A network tool", "A list sorter"],
          answerIndex: 1,
          explanation: "It significantly speeds up expensive functions by storing previous outputs."
        },
        {
          id: "py-9-10",
          question: "Can a class be used as a decorator?",
          options: ["No", "Yes, if it implements __call__", "Only for math", "Only in Python 2"],
          answerIndex: 1,
          explanation: "An object becomes 'callable' when it has a __call__ method."
        },
        {
          id: "py-9-11",
          question: "What is a 'Closure'?",
          options: ["Closing a file", "A function that remembers variables from its outer scope", "Ending a loop", "Private data"],
          answerIndex: 1,
          explanation: "Decorators rely on closures to 'remember' the function they are wrapping."
        },
        {
          id: "py-9-12",
          question: "What does @property do in a class?",
          options: ["Makes an attribute public", "Allows a method to be accessed like an attribute", "Deletes an attribute", "Makes an attribute static"],
          answerIndex: 1,
          explanation: "It is used for getters, allowing logic while appearing as a simple variable access."
        },
        {
          id: "py-9-13",
          question: "What is 'Monkey Patching'?",
          options: ["A security tool", "Changing the behavior of a module or class at runtime", "Writing bad code", "A type of loop"],
          answerIndex: 1,
          explanation: "It is powerful but can make debugging difficult."
        },
        {
          id: "py-9-14",
          question: "Which library helps in creating context managers easily?",
          options: ["ctxlib", "contextlib", "managerlib", "resourcelib"],
          answerIndex: 1,
          explanation: "It provides the @contextmanager decorator to use generators for this purpose."
        },
        {
          id: "py-9-15",
          question: "What is '@staticmethod'?",
          options: ["A constant function", "A method that doesn't take self/cls", "A function in a file", "A hidden method"],
          answerIndex: 1,
          explanation: "It’s used when you want a function inside a class namespace without needing class instance data."
        },
        {
          id: "py-9-16",
          question: "What is a 'First-Class Citizen' in Python?",
          options: ["A rich user", "An object that can be passed as an argument or returned (like functions)", "A global variable", "A main file"],
          answerIndex: 1,
          explanation: "In Python, functions are first-class objects."
        },
        {
          id: "py-9-17",
          question: "What is 'Memoization'?",
          options: ["Taking notes", "Storing the results of expensive function calls", "Clearing memory", "A sorting method"],
          answerIndex: 1,
          explanation: "It's a common optimization technique used with decorators."
        },
        {
          id: "py-9-18",
          question: "What happens if __exit__ returns True?",
          options: ["The program ends", "The exception is suppressed (ignored)", "The exception is raised", "Nothing"],
          answerIndex: 1,
          explanation: "If an error happened inside the 'with' block, returning True prevents it from crashing the script."
        },
        {
          id: "py-9-19",
          question: "Which dunder method is called when an object is 'called' like a function?",
          options: ["__init__", "__run__", "__call__", "__exec__"],
          answerIndex: 2,
          explanation: "This allows objects to behave like functions."
        },
        {
          id: "py-9-20",
          question: "How can you apply multiple decorators to one function?",
          options: ["You can't", "By stacking them one above the other", "Using a list", "Separating them with commas"],
          answerIndex: 1,
          explanation: "They are applied from the bottom up (closest to the function first)."
        }
      ]
    }
  ]
};