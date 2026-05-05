import { TopicData } from "@/app/practice/data/types";

export const cSharpMasteryData: TopicData = {
  slug: "csharp-mastery",
  title: "C# Mastery",
  intro: "From basic syntax to advanced concepts in C# programming.",
  levels: [
    {
      level: 1,
      title: "Level 1: C# Syntax & Types",
      description: "Basic structure, variables, and the .NET type system.",
      passScore: 16,
      questions: [
        {
          id: "cs-1-1",
          question:
            "Which keyword is used to output text to the console in C#?",
          options: [
            "print()",
            "Console.WriteLine()",
            "System.out.print()",
            "Log()",
          ],
          answerIndex: 1,
          explanation:
            "Console.WriteLine() is the standard method in the System namespace for printing to the terminal.",
        },
        {
          id: "cs-1-2",
          question: "How do you declare a whole number variable in C#?",
          options: [
            "num x = 5;",
            "int x = 5;",
            "var x : int = 5;",
            "number x = 5;",
          ],
          answerIndex: 1,
          explanation:
            "C# is statically typed, and 'int' is the standard 32-bit signed integer type.",
        },
        {
          id: "cs-1-3",
          question: "Which character must end almost every C# statement?",
          options: [":", ".", ";", "!"],
          answerIndex: 2,
          explanation:
            "Like C++ and Java, C# uses the semicolon (;) as a statement terminator.",
        },
        {
          id: "cs-1-4",
          question: "What does the 'var' keyword do in C#?",
          options: [
            "Makes a variable dynamic",
            "Implicitly types a local variable based on the assigned value",
            "Creates a constant",
            "Declares a global variable",
          ],
          answerIndex: 1,
          explanation:
            "Type inference occurs at compile time; the variable is still strongly typed.",
        },
        {
          id: "cs-1-5",
          question: "Which data type is used for a single character?",
          options: ["string", "chr", "char", "letter"],
          answerIndex: 2,
          explanation:
            "The 'char' type stores a single 16-bit Unicode character, enclosed in single quotes.",
        },
        {
          id: "cs-1-6",
          question: "What is the correct way to create a string variable?",
          options: [
            "String s = 'Hello';",
            'string s = "Hello";',
            'str s = "Hello";',
            's := "Hello";',
          ],
          answerIndex: 1,
          explanation:
            "In C#, strings are enclosed in double quotes. 'string' is an alias for System.String.",
        },
        {
          id: "cs-1-7",
          question:
            "Which type is best for high-precision financial calculations?",
          options: ["float", "double", "decimal", "long"],
          answerIndex: 2,
          explanation:
            "The 'decimal' type has more precision and a smaller range than float/double, making it ideal for money.",
        },
        {
          id: "cs-1-8",
          question: "How do you convert a string '10' to an integer?",
          options: [
            '(int)"10"',
            'int.Parse("10")',
            'Convert.ToInt("10")',
            'parse("10")',
          ],
          answerIndex: 1,
          explanation:
            "int.Parse() and int.TryParse() are the standard ways to convert strings to integers.",
        },
        {
          id: "cs-1-9",
          question: "What is a 'bool' in C#?",
          options: [
            "A 1 or 0 integer",
            "A logic type that is either true or false",
            "A binary object",
            "A loop type",
          ],
          answerIndex: 1,
          explanation:
            "The boolean type only accepts 'true' or 'false' literals.",
        },
        {
          id: "cs-1-10",
          question:
            "Which keyword makes a variable unchangeable after initialization?",
          options: ["static", "final", "const", "fixed"],
          answerIndex: 2,
          explanation:
            "Constants are evaluated at compile-time and cannot be modified.",
        },
        {
          id: "cs-1-11",
          question:
            "What is the entry point of a standard C# Console application?",
          options: [
            "public void Start()",
            "static void Main()",
            "private void Init()",
            "void Run()",
          ],
          answerIndex: 1,
          explanation:
            "The Main method is where the execution of the program begins.",
        },
        {
          id: "cs-1-12",
          question: "How do you write a single-line comment in C#?",
          options: ["# Comment", "// Comment", "/* Comment", "-- Comment"],
          answerIndex: 1,
          explanation:
            "Double slashes are used for single-line comments; /* */ for blocks.",
        },
        {
          id: "cs-1-13",
          question: "Which operator is used for string concatenation?",
          options: ["&", "+", ".", "$"],
          answerIndex: 1,
          explanation:
            "The '+' operator joins strings together, though String.Format or interpolation is often preferred.",
        },
        {
          id: "cs-1-14",
          question: "What is 'String Interpolation' syntax?",
          options: [
            '@"Hello {name}"',
            '$"Hello {name}"',
            'f"Hello {name}"',
            '{"{name}"}',
          ],
          answerIndex: 1,
          explanation:
            "Starting a string with $ allows embedding variables directly inside curly braces.",
        },
        {
          id: "cs-1-15",
          question: "Which namespace contains basic input/output classes?",
          options: [
            "System.IO",
            "System",
            "System.Console",
            "Microsoft.CSharp",
          ],
          answerIndex: 1,
          explanation:
            "The 'System' namespace is the root for fundamental types and classes like Console.",
        },
        {
          id: "cs-1-16",
          question: "What is the size of an 'int' in C#?",
          options: ["16-bit", "32-bit", "64-bit", "Depends on OS"],
          answerIndex: 1,
          explanation:
            "In C#, an 'int' is always a 32-bit signed integer (System.Int32).",
        },
        {
          id: "cs-1-17",
          question: "How do you declare an array of integers?",
          options: [
            "int[] nums;",
            "int nums[];",
            "Array<int> nums;",
            "list int nums;",
          ],
          answerIndex: 0,
          explanation:
            "The brackets follow the type in C#, indicating it's an array of that type.",
        },
        {
          id: "cs-1-18",
          question: "What does the 'null' keyword represent?",
          options: [
            "Zero",
            "An empty string",
            "The absence of a value or reference",
            "An error",
          ],
          answerIndex: 2,
          explanation:
            "Null indicates that a reference variable does not point to any object.",
        },
        {
          id: "cs-1-19",
          question:
            "What is the 'using' keyword used for at the top of a file?",
          options: [
            "To include a library",
            "To import a namespace",
            "To create a loop",
            "To define a class",
          ],
          answerIndex: 1,
          explanation:
            "It allows you to use types in a namespace without qualifying the full path.",
        },
        {
          id: "cs-1-20",
          question: "Is C# case-sensitive?",
          options: ["Yes", "No", "Only for classes", "Only for namespaces"],
          answerIndex: 0,
          explanation:
            "Like most C-style languages, 'MyVar' and 'myvar' are different identifiers.",
        },
      ],
    },
    {
      level: 2,
      title: "Level 2: Control Flow & Logic",
      description: "Conditionals, loops, and switch expressions.",
      passScore: 16,
      questions: [
        {
          id: "cs-2-1",
          question: "Which loop is guaranteed to run at least once?",
          options: ["for", "while", "do-while", "foreach"],
          answerIndex: 2,
          explanation:
            "The condition in a do-while loop is checked after the body executes.",
        },
        {
          id: "cs-2-2",
          question: "What is the C# equivalent of Python's 'elif'?",
          options: ["elseif", "else if", "elsif", "when"],
          answerIndex: 1,
          explanation: "C# uses two separate keywords: 'else if'.",
        },
        {
          id: "cs-2-3",
          question:
            "Which statement is used to handle multiple constant values?",
          options: ["if", "switch", "branch", "select"],
          answerIndex: 1,
          explanation:
            "The 'switch' statement compares an expression against multiple cases.",
        },
        {
          id: "cs-2-4",
          question:
            "Which keyword iterates through a collection like a List or Array?",
          options: ["for", "while", "foreach", "loop"],
          answerIndex: 2,
          explanation:
            "foreach is the idiomatic way to iterate over any IEnumerable collection.",
        },
        {
          id: "cs-2-5",
          question: "How do you exit a loop immediately?",
          options: ["exit", "stop", "break", "return"],
          answerIndex: 2,
          explanation:
            "The 'break' keyword terminates the innermost loop or switch.",
        },
        {
          id: "cs-2-6",
          question: "What does 'continue' do in a loop?",
          options: [
            "Stops the loop",
            "Restarts the program",
            "Skips the rest of the current iteration",
            "Exits the function",
          ],
          answerIndex: 2,
          explanation: "It jumps to the next cycle of the loop immediately.",
        },
        {
          id: "cs-2-7",
          question: "What is the logical 'AND' operator in C#?",
          options: ["and", "&", "&&", "AND"],
          answerIndex: 2,
          explanation: "&& is the short-circuiting logical AND operator.",
        },
        {
          id: "cs-2-8",
          question: "What is the logical 'OR' operator?",
          options: ["or", "|", "||", "OR"],
          answerIndex: 2,
          explanation: "|| is the short-circuiting logical OR operator.",
        },
        {
          id: "cs-2-9",
          question: "What is the 'Ternary Operator' in C#?",
          options: ["if-else", "? :", "??", "=>"],
          answerIndex: 1,
          explanation: 'Example: var result = (x > 0) ? "pos" : "neg";',
        },
        {
          id: "cs-2-10",
          question:
            "In a switch statement, which case runs if no others match?",
          options: ["else", "fallback", "default", "none"],
          answerIndex: 2,
          explanation:
            "The 'default' case handles all values not explicitly listed.",
        },
        {
          id: "cs-2-11",
          question: "What is the 'Null-Coalescing' operator (??) used for?",
          options: [
            "Checking equality",
            "Returning a default value if the first operand is null",
            "Defining a null variable",
            "Looping through nulls",
          ],
          answerIndex: 1,
          explanation: 'Example: string name = inputName ?? "Guest";',
        },
        {
          id: "cs-2-12",
          question: "What does the 'as' operator do?",
          options: [
            "Renames a variable",
            "Performs a safe type cast, returning null if it fails",
            "Checks if an object is null",
            "Defines an alias",
          ],
          answerIndex: 1,
          explanation:
            "It attempts to cast an object to a type without throwing an exception.",
        },
        {
          id: "cs-2-13",
          question: "What is the 'is' operator used for?",
          options: [
            "Equality",
            "Checking if an object is compatible with a given type",
            "Assigning values",
            "Logical negation",
          ],
          answerIndex: 1,
          explanation:
            "It returns true if the object can be cast to the specified type.",
        },
        {
          id: "cs-2-14",
          question: "What is a 'Switch Expression' (C# 8.0+)?",
          options: [
            "A faster switch",
            "A concise switch that returns a value",
            "A switch for strings only",
            "A nested switch",
          ],
          answerIndex: 1,
          explanation:
            'Example: var color = code switch { 1 => "Red", 2 => "Blue", _ => "Black" };',
        },
        {
          id: "cs-2-15",
          question: "How do you write 'not equal' in C#?",
          options: ["<>", "!=", "not=", "/="],
          answerIndex: 1,
          explanation: "!= is the standard inequality operator.",
        },
        {
          id: "cs-2-16",
          question: "Can you use a string in a C# switch statement?",
          options: ["Yes", "No", "Only if it's constant", "Only in .NET Core"],
          answerIndex: 0,
          explanation:
            "Unlike some languages, C# has long supported switching on string values.",
        },
        {
          id: "cs-2-17",
          question: "What is the purpose of 'yield return'?",
          options: [
            "To pause a function",
            "To create a custom iterator for a collection",
            "To return multiple errors",
            "To speed up math",
          ],
          answerIndex: 1,
          explanation:
            "It allows a method to return elements of a collection one by one as they are requested.",
        },
        {
          id: "cs-2-18",
          question: "What is short-circuiting in logic?",
          options: [
            "A hardware error",
            "Skipping the second part of a condition if the result is already known",
            "An infinite loop",
            "Automatic optimization",
          ],
          answerIndex: 1,
          explanation: "In 'A && B', if A is false, B is never evaluated.",
        },
        {
          id: "cs-2-19",
          question:
            "Which loop is best when you know the number of iterations in advance?",
          options: ["while", "for", "foreach", "do-while"],
          answerIndex: 1,
          explanation:
            "The 'for' loop structure includes initialization, condition, and iterator in one line.",
        },
        {
          id: "cs-2-20",
          question: "What is the index of the first element in a C# array?",
          options: ["1", "0", "-1", "Customizable"],
          answerIndex: 1,
          explanation: "C# uses zero-based indexing for all collections.",
        },
      ],
    },
    {
      level: 3,
      title: "Level 3: Methods & Parameters",
      description: "Defining functions, scope, and parameter modifiers.",
      passScore: 16,
      questions: [
        {
          id: "cs-3-1",
          question: "What keyword indicates a method does not return a value?",
          options: ["null", "static", "void", "empty"],
          answerIndex: 2,
          explanation:
            "A 'void' method performs an action but doesn't pass back data.",
        },
        {
          id: "cs-3-2",
          question: "What is 'Method Overloading'?",
          options: [
            "Redefining a method in a child class",
            "Having multiple methods with the same name but different parameters",
            "A method that takes too many arguments",
            "Calling a method too many times",
          ],
          answerIndex: 1,
          explanation:
            "Overloading allows a method to handle different types or numbers of inputs.",
        },
        {
          id: "cs-3-3",
          question: "What does the 'ref' keyword do?",
          options: [
            "Makes an argument optional",
            "Passes an argument by reference",
            "Returns a reference",
            "Renames a variable",
          ],
          answerIndex: 1,
          explanation:
            "It allows a method to modify the original variable passed from the caller.",
        },
        {
          id: "cs-3-4",
          question: "What is the 'out' keyword used for?",
          options: [
            "To exit a method",
            "To pass a variable that must be assigned inside the method",
            "To print values",
            "To declare a global variable",
          ],
          answerIndex: 1,
          explanation:
            "'out' is similar to 'ref' but the variable doesn't need to be initialized before passing.",
        },
        {
          id: "cs-3-5",
          question: "What are 'Optional Parameters'?",
          options: [
            "Parameters that can be null",
            "Parameters with a default value",
            "Parameters that are not used",
            "Parameters in a list",
          ],
          answerIndex: 1,
          explanation:
            "Example: void MyMethod(int x = 10) allows the caller to omit x.",
        },
        {
          id: "cs-3-6",
          question: "What does the 'params' keyword allow?",
          options: [
            "One parameter only",
            "A variable number of arguments of a specific type",
            "Named arguments",
            "Required parameters",
          ],
          answerIndex: 1,
          explanation:
            "It lets you pass a comma-separated list of values as an array to the method.",
        },
        {
          id: "cs-3-7",
          question: "What is a 'Static Method'?",
          options: [
            "A method that belongs to the class itself, not an instance",
            "A method that cannot be changed",
            "A method that runs slowly",
            "A method with no parameters",
          ],
          answerIndex: 0,
          explanation:
            "Static methods are called using the Class name (e.g., Math.Sqrt).",
        },
        {
          id: "cs-3-8",
          question: "What is an 'Extension Method'?",
          options: [
            "A method in a separate file",
            "A static method that adds functionality to an existing type",
            "A method that grows in size",
            "A method used in inheritance",
          ],
          answerIndex: 1,
          explanation:
            "They allow you to 'add' methods to types like string or int without modifying the source code.",
        },
        {
          id: "cs-3-9",
          question: "What is 'Expression-Bodied' syntax for methods?",
          options: [
            "Using curly braces",
            "Using the => (lambda) operator for single-line methods",
            "Using return only",
            "A method inside an if statement",
          ],
          answerIndex: 1,
          explanation: "Example: int Add(int x, int y) => x + y;",
        },
        {
          id: "cs-3-10",
          question:
            "Which access modifier makes a method visible only within the same class?",
          options: ["public", "protected", "private", "internal"],
          answerIndex: 2,
          explanation:
            "Private is the default access level for members if none is specified.",
        },
        {
          id: "cs-3-11",
          question: "What does 'internal' access modifier mean?",
          options: [
            "Only inside the class",
            "Only inside the same assembly (project)",
            "Everywhere",
            "Only in child classes",
          ],
          answerIndex: 1,
          explanation:
            "Internal members are accessible by any code in the same compiled DLL or EXE.",
        },
        {
          id: "cs-3-12",
          question: "What is 'Named Arguments'?",
          options: [
            "Renaming parameters",
            "Specifying arguments by name instead of position",
            "Using strings as arguments",
            "Arguments with capital letters",
          ],
          answerIndex: 1,
          explanation:
            'Example: MyMethod(name: "Vanshaj", age: 25); increases readability.',
        },
        {
          id: "cs-3-13",
          question: "What is 'Recursion' in C#?",
          options: [
            "Looping through an array",
            "A method calling itself",
            "A type of class",
            "An error",
          ],
          answerIndex: 1,
          explanation:
            "Commonly used for tree structures or mathematical sequences like Factorials.",
        },
        {
          id: "cs-3-14",
          question: "What is the 'return' keyword used for?",
          options: [
            "To start a method",
            "To exit a method and optionally pass a value back",
            "To jump to a label",
            "To restart a loop",
          ],
          answerIndex: 1,
          explanation:
            "It terminates execution of the method in which it appears.",
        },
        {
          id: "cs-3-15",
          question: "What are 'Local Functions'?",
          options: [
            "Functions in a different file",
            "Methods defined inside another method",
            "Global methods",
            "Static methods",
          ],
          answerIndex: 1,
          explanation:
            "Introduced in C# 7.0, they allow you to declare helper methods inside a scope.",
        },
        {
          id: "cs-3-16",
          question: "What is the 'in' parameter modifier?",
          options: [
            "Passes by value",
            "Passes by reference but prevents the method from modifying it",
            "Used for loops only",
            "A search keyword",
          ],
          answerIndex: 1,
          explanation:
            "It is used for performance optimization with large structs.",
        },
        {
          id: "cs-3-17",
          question: "What is a 'Method Signature'?",
          options: [
            "The method's return type",
            "The name and the parameter types/order",
            "The code inside the method",
            "The file name",
          ],
          answerIndex: 1,
          explanation:
            "C# uses the signature to differentiate between overloaded methods.",
        },
        {
          id: "cs-3-18",
          question: "Can a method return multiple values directly in C#?",
          options: [
            "No",
            "Yes, using Tuples",
            "Only if they are integers",
            "Only using ref",
          ],
          answerIndex: 1,
          explanation: 'Example: (int, string) GetUser() => (1, "Vanshaj");',
        },
        {
          id: "cs-3-19",
          question: "What is 'Encapsulation' in the context of methods?",
          options: [
            "Making everything public",
            "Hiding the logic of a method from the caller",
            "Using many parameters",
            "Writing long methods",
          ],
          answerIndex: 1,
          explanation:
            "The caller only needs to know the signature, not the internal implementation.",
        },
        {
          id: "cs-3-20",
          question:
            "Which keyword is used to refer to the current instance of a class within a method?",
          options: ["self", "base", "this", "me"],
          answerIndex: 2,
          explanation:
            "The 'this' keyword refers to the current instance of the class.",
        },
      ],
    },
    {
      level: 4,
      title: "Level 4: Classes & Objects",
      description: "Encapsulation, constructors, and instance members.",
      passScore: 16,
      questions: [
        {
          id: "cs-4-1",
          question: "Which keyword is used to create an instance of a class?",
          options: ["create", "new", "instance", "make"],
          answerIndex: 1,
          explanation:
            "The 'new' keyword allocates memory on the heap for a new object.",
        },
        {
          id: "cs-4-2",
          question: "What is a 'Constructor'?",
          options: [
            "A method that deletes an object",
            "A special method that runs when an object is created",
            "A tool for building UI",
            "A type of variable",
          ],
          answerIndex: 1,
          explanation:
            "Constructors usually have the same name as the class and initialize the object's state.",
        },
        {
          id: "cs-4-3",
          question: "What is the 'Default Constructor'?",
          options: [
            "The first method in a file",
            "A parameterless constructor provided by C# if none are defined",
            "A constructor that returns null",
            "The Main method",
          ],
          answerIndex: 1,
          explanation:
            "If you don't write any constructor, the compiler generates a parameterless one for you.",
        },
        {
          id: "cs-4-4",
          question: "How do you define a 'Property' in C#?",
          options: [
            "public int Age;",
            "public int Age { get; set; }",
            "property Age: int",
            "int getAge()",
          ],
          answerIndex: 1,
          explanation:
            "Properties use 'get' and 'set' accessors to provide a flexible mechanism to read and write private fields.",
        },
        {
          id: "cs-4-5",
          question: "What is an 'Auto-Implemented Property'?",
          options: [
            "A property that writes its own logic",
            "A property where the compiler creates a private backing field automatically",
            "A property that is always public",
            "A property used in loops",
          ],
          answerIndex: 1,
          explanation:
            "Syntax: public string Name { get; set; } simplifies code by removing the need for manual backing fields.",
        },
        {
          id: "cs-4-6",
          question: "What does the 'private' access modifier do?",
          options: [
            "Allows access from anywhere",
            "Limits access to only the containing class",
            "Allows access to child classes",
            "Limits access to the project",
          ],
          answerIndex: 1,
          explanation: "It is the fundamental building block of Encapsulation.",
        },
        {
          id: "cs-4-7",
          question: "What is an 'Object Initializer'?",
          options: [
            "A constructor",
            "Setting properties using { } syntax during creation",
            "A memory tool",
            "A type of loop",
          ],
          answerIndex: 1,
          explanation:
            "Example: var p = new Person { Name = 'Vanshaj', Age = 25 };",
        },
        {
          id: "cs-4-8",
          question: "What is the difference between a Field and a Property?",
          options: [
            "No difference",
            "Fields are variables; Properties wrap fields with logic",
            "Fields are public; Properties are private",
            "Properties are faster",
          ],
          answerIndex: 1,
          explanation:
            "Properties are preferred for public interfaces to maintain control over data validation.",
        },
        {
          id: "cs-4-9",
          question: "What keyword is used to inherit from a class?",
          options: ["extends", "inherits", ": (Colon)", "using"],
          answerIndex: 2,
          explanation:
            "In C#, a colon is used for both class inheritance and interface implementation.",
        },
        {
          id: "cs-4-10",
          question: "Can a C# class inherit from multiple classes?",
          options: [
            "Yes",
            "No",
            "Only if they are static",
            "Only in .NET Framework",
          ],
          answerIndex: 1,
          explanation:
            "C# supports single inheritance only for classes, but multiple inheritance for interfaces.",
        },
        {
          id: "cs-4-11",
          question: "What does the 'readonly' keyword do for a field?",
          options: [
            "Makes it a constant",
            "Prevents modification except in the constructor",
            "Makes it private",
            "Speeds up access",
          ],
          answerIndex: 1,
          explanation:
            "Unlike 'const', 'readonly' values can be calculated at runtime during construction.",
        },
        {
          id: "cs-4-12",
          question: "What is 'Object-Oriented Programming' (OOP)?",
          options: [
            "Writing code in a single file",
            "A paradigm based on 'objects' containing data and code",
            "A type of database",
            "A specific C# library",
          ],
          answerIndex: 1,
          explanation:
            "OOP focuses on modularity, reuse, and modeling real-world entities.",
        },
        {
          id: "cs-4-13",
          question: "What is a 'Destructor' (Finalizer)?",
          options: [
            "A method to clear the screen",
            "A method that runs before an object is garbage collected",
            "A tool to delete files",
            "An error handler",
          ],
          answerIndex: 1,
          explanation:
            "Syntax: ~ClassName(). It is used for cleaning up unmanaged resources.",
        },
        {
          id: "cs-4-14",
          question: "What is the 'partial' keyword used for?",
          options: [
            "To write half a method",
            "To split a class definition across multiple files",
            "To make a class private",
            "To create a small object",
          ],
          answerIndex: 1,
          explanation:
            "Commonly used in large projects or with generated code (like WinForms or WPF).",
        },
        {
          id: "cs-4-15",
          question: "What is a 'Static Class'?",
          options: [
            "A class that cannot be instantiated or inherited",
            "A class that doesn't change",
            "A class with no methods",
            "A class that is always public",
          ],
          answerIndex: 0,
          explanation:
            "A static class can only contain static members (e.g., System.Math).",
        },
        {
          id: "cs-4-16",
          question: "What is 'this' keyword used for in a constructor?",
          options: [
            "To delete an object",
            "To call another constructor in the same class",
            "To refer to the parent class",
            "To stop the program",
          ],
          answerIndex: 1,
          explanation: "This is called 'Constructor Chaining'.",
        },
        {
          id: "cs-4-17",
          question: "What is a 'Nested Class'?",
          options: [
            "A class inside a loop",
            "A class defined inside another class",
            "A class in a list",
            "A class with no name",
          ],
          answerIndex: 1,
          explanation:
            "It is used when a class is only logically relevant to its outer class.",
        },
        {
          id: "cs-4-18",
          question: "What are 'Required' members (C# 11)?",
          options: [
            "Members that must be set during object initialization",
            "Public members",
            "Static members",
            "Methods with return types",
          ],
          answerIndex: 0,
          explanation:
            "The 'required' modifier ensures a property is assigned a value by the caller.",
        },
        {
          id: "cs-4-19",
          question: "What is 'Composition' in C#?",
          options: [
            "Inheriting from a class",
            "Including an object of one class as a member of another",
            "Writing a poem",
            "Compiling code",
          ],
          answerIndex: 1,
          explanation:
            "It follows the 'has-a' relationship (e.g., House has a Room).",
        },
        {
          id: "cs-4-20",
          question: "Which keyword prevents a class from being inherited?",
          options: ["final", "sealed", "static", "locked"],
          answerIndex: 1,
          explanation: "A 'sealed' class cannot be used as a base class.",
        },
      ],
    },
    {
      level: 5,
      title: "Level 5: Structs vs Classes",
      description: "Value types, reference types, and memory allocation.",
      passScore: 16,
      questions: [
        {
          id: "cs-5-1",
          question: "In C#, a 'Class' is a:",
          options: [
            "Value Type",
            "Reference Type",
            "Pointer Type",
            "Static Type",
          ],
          answerIndex: 1,
          explanation:
            "Classes are stored on the 'Heap', and variables hold a reference to that memory.",
        },
        {
          id: "cs-5-2",
          question: "In C#, a 'Struct' is a:",
          options: [
            "Value Type",
            "Reference Type",
            "Interface Type",
            "Dynamic Type",
          ],
          answerIndex: 0,
          explanation:
            "Structs are generally stored on the 'Stack' (unless part of a class) and contain actual data.",
        },
        {
          id: "cs-5-3",
          question: "What happens when you copy a Class variable?",
          options: [
            "A new object is created",
            "Both variables point to the same object",
            "An error occurs",
            "The data is moved",
          ],
          answerIndex: 1,
          explanation:
            "Copying a reference type only copies the memory address (the reference).",
        },
        {
          id: "cs-5-4",
          question: "What happens when you copy a Struct variable?",
          options: [
            "Both point to the same data",
            "A completely independent copy of the data is made",
            "It becomes null",
            "It is deleted",
          ],
          answerIndex: 1,
          explanation: "Value types copy the actual bit-for-bit values.",
        },
        {
          id: "cs-5-5",
          question: "Can a 'Struct' inherit from a 'Class'?",
          options: [
            "Yes",
            "No",
            "Only if the class is abstract",
            "Only in C# 10+",
          ],
          answerIndex: 1,
          explanation:
            "Structs do not support inheritance (though they can implement interfaces).",
        },
        {
          id: "cs-5-6",
          question: "Where are Reference Types usually stored?",
          options: ["The Stack", "The Heap", "The CPU Cache", "The Hard Drive"],
          answerIndex: 1,
          explanation: "The Heap is used for long-lived data and objects.",
        },
        {
          id: "cs-5-7",
          question:
            "Where are local Value Types (like int or small structs) usually stored?",
          options: ["The Stack", "The Heap", "The GPU", "The Cloud"],
          answerIndex: 0,
          explanation:
            "The Stack is used for fast, short-lived memory management.",
        },
        {
          id: "cs-5-8",
          question: "What is 'Boxing'?",
          options: [
            "Deleting an object",
            "Converting a Value Type to a Reference Type",
            "Packing files",
            "A UI layout",
          ],
          answerIndex: 1,
          explanation:
            "Example: int i = 10; object o = i; (This has a performance cost).",
        },
        {
          id: "cs-5-9",
          question: "What is 'Unboxing'?",
          options: [
            "Converting a Reference Type back to a Value Type",
            "Opening a zip file",
            "Deleting a class",
            "Clearing the stack",
          ],
          answerIndex: 0,
          explanation: "Example: int j = (int)o; (Requires an explicit cast).",
        },
        {
          id: "cs-5-10",
          question:
            "Which keyword creates a struct that cannot be modified after creation?",
          options: [
            "const struct",
            "readonly struct",
            "fixed struct",
            "static struct",
          ],
          answerIndex: 1,
          explanation:
            "Ensures that all members of the struct are also readonly.",
        },
        {
          id: "cs-5-11",
          question: "What is a 'Record' (C# 9.0+)?",
          options: [
            "A database row",
            "A reference type with built-in value-based equality",
            "A type of list",
            "A way to save files",
          ],
          answerIndex: 1,
          explanation:
            "Records are ideal for data-only objects where you care about the content, not the identity.",
        },
        {
          id: "cs-5-12",
          question: "What is 'Value-based Equality' in Records?",
          options: [
            "Comparing memory addresses",
            "Two objects are equal if their properties have the same values",
            "Comparing variable names",
            "Using the 'is' operator",
          ],
          answerIndex: 1,
          explanation:
            "Unlike classes, two different Record instances with the same data will return true for Equals().",
        },
        {
          id: "cs-5-13",
          question: "Can a Struct have a parameterless constructor (C# 10+)?",
          options: ["No", "Yes", "Only if it is static", "Only if it is empty"],
          answerIndex: 1,
          explanation:
            "Modern C# now allows you to define custom parameterless constructors for structs.",
        },
        {
          id: "cs-5-14",
          question: "What is the 'with' expression used for?",
          options: [
            "Loops",
            "Non-destructive mutation of Records",
            "File management",
            "Error handling",
          ],
          answerIndex: 1,
          explanation:
            "Example: var p2 = p1 with { Name = 'NewName' }; creates a copy with one change.",
        },
        {
          id: "cs-5-15",
          question:
            "Which type is typically faster for small, short-lived data?",
          options: ["Class", "Struct", "Interface", "Object"],
          answerIndex: 1,
          explanation:
            "Structs avoid heap allocation and garbage collection overhead.",
        },
        {
          id: "cs-5-16",
          question: "Which keyword defines a Record that is a Value Type?",
          options: ["record", "record struct", "value record", "struct record"],
          answerIndex: 1,
          explanation:
            "'record struct' combines record features with value-type performance.",
        },
        {
          id: "cs-5-17",
          question: "What is the default access modifier for a class member?",
          options: ["public", "internal", "private", "protected"],
          answerIndex: 2,
          explanation:
            "Members are private by default unless otherwise specified.",
        },
        {
          id: "cs-5-18",
          question:
            "What happens to heap memory when an object is no longer referenced?",
          options: [
            "It leaks",
            "It is cleared by the Garbage Collector (GC)",
            "It stays forever",
            "The OS crashes",
          ],
          answerIndex: 1,
          explanation:
            "The GC automatically reclaims memory that is no longer reachable.",
        },
        {
          id: "cs-5-19",
          question: "What is a 'Reference'?",
          options: [
            "A copy of data",
            "The memory address where an object is stored",
            "A type of string",
            "A library link",
          ],
          answerIndex: 1,
          explanation: "References 'point' to the actual data on the heap.",
        },
        {
          id: "cs-5-20",
          question: "Can you assign 'null' to a standard Struct?",
          options: ["Yes", "No", "Only in .NET Core", "Only if it is empty"],
          answerIndex: 1,
          explanation:
            "Value types cannot be null unless you use Nullable types (e.g., int?).",
        },
      ],
    },
    {
      level: 6,
      title: "Level 6: Interfaces & Abstract Classes",
      description: "Defining contracts and polymorphic behavior.",
      passScore: 16,
      questions: [
        {
          id: "cs-6-1",
          question: "What is an 'Interface'?",
          options: [
            "A GUI",
            "A contract that defines what a class can do, but not how",
            "A base class",
            "A type of loop",
          ],
          answerIndex: 1,
          explanation:
            "It contains only declarations of methods, properties, etc., which a class must implement.",
        },
        {
          id: "cs-6-2",
          question: "Which keyword is used to implement an interface?",
          options: ["implements", "uses", ": (Colon)", "with"],
          answerIndex: 2,
          explanation:
            "C# uses the same colon syntax for both inheritance and interfaces.",
        },
        {
          id: "cs-6-3",
          question: "What is an 'Abstract Class'?",
          options: [
            "A class that cannot be instantiated",
            "A class with no code",
            "A class that is always public",
            "A class used for math",
          ],
          answerIndex: 0,
          explanation:
            "It acts as a partially implemented base class for other classes to inherit from.",
        },
        {
          id: "cs-6-4",
          question: "Can an Interface contain implementation code (C# 8.0+)?",
          options: [
            "No, never",
            "Yes, using Default Interface Methods",
            "Only for static methods",
            "Only for strings",
          ],
          answerIndex: 1,
          explanation:
            "Default methods allow interfaces to evolve without breaking existing implementations.",
        },
        {
          id: "cs-6-5",
          question: "What is the naming convention for Interfaces in C#?",
          options: [
            "Start with 'A'",
            "Start with 'I'",
            "End with 'Interface'",
            "All caps",
          ],
          answerIndex: 1,
          explanation: "Example: IRepository, IDisposable, IEnumerable.",
        },
        {
          id: "cs-6-6",
          question:
            "What keyword is used to mark a method for overriding in a base class?",
          options: ["override", "virtual", "abstract", "base"],
          answerIndex: 1,
          explanation:
            "A 'virtual' method has a default implementation but can be changed by child classes.",
        },
        {
          id: "cs-6-7",
          question:
            "What keyword is used in the child class to change a virtual method?",
          options: ["new", "change", "override", "replace"],
          answerIndex: 2,
          explanation:
            "The 'override' keyword explicitly tells the compiler you are replacing the base behavior.",
        },
        {
          id: "cs-6-8",
          question: "What is a 'Pure Abstract Method'?",
          options: [
            "A method with no body in an abstract class",
            "A fast method",
            "A method with no parameters",
            "A private method",
          ],
          answerIndex: 0,
          explanation:
            "An 'abstract' method has no implementation and MUST be overridden by child classes.",
        },
        {
          id: "cs-6-9",
          question: "Can a class implement multiple interfaces?",
          options: ["No", "Yes", "Only two", "Only if they are empty"],
          answerIndex: 1,
          explanation:
            "This is C#'s way of providing multiple inheritance-like capabilities.",
        },
        {
          id: "cs-6-10",
          question: "What is 'Polymorphism'?",
          options: [
            "Changing variable names",
            "The ability to treat different objects as a common base type",
            "Creating many objects",
            "Using many loops",
          ],
          answerIndex: 1,
          explanation: "Example: Treating a Dog and Cat as an Animal.",
        },
        {
          id: "cs-6-11",
          question: "What is the 'base' keyword used for?",
          options: [
            "To exit a method",
            "To access members of the parent class",
            "To start the program",
            "To create a new class",
          ],
          answerIndex: 1,
          explanation:
            "It allows you to call the parent's constructor or methods.",
        },
        {
          id: "cs-6-12",
          question: "What is 'Explicit Interface Implementation'?",
          options: [
            "Implementing an interface privately",
            "Defining interface methods with the interface name prefix",
            "Using only strings",
            "Making all methods public",
          ],
          answerIndex: 1,
          explanation:
            "Used when a class implements two interfaces with identical method names.",
        },
        {
          id: "cs-6-13",
          question: "What is the 'sealed' modifier on a method?",
          options: [
            "Prevents further overriding in subclasses",
            "Makes the method private",
            "Speeds up the method",
            "Hides the method",
          ],
          answerIndex: 0,
          explanation:
            "It 'locks' the implementation for all classes further down the inheritance chain.",
        },
        {
          id: "cs-6-14",
          question: "Can an abstract class have a constructor?",
          options: ["Yes", "No", "Only if it is static", "Only in .NET Core"],
          answerIndex: 0,
          explanation:
            "Even though you can't 'new' it, the constructor runs when a child class is instantiated.",
        },
        {
          id: "cs-6-15",
          question: "What is 'Loose Coupling'?",
          options: [
            "Writing messy code",
            "Coding to an interface rather than a concrete class",
            "Using few variables",
            "Having many files",
          ],
          answerIndex: 1,
          explanation:
            "It makes code more flexible and easier to test/swap components.",
        },
        {
          id: "cs-6-16",
          question: "Which of these can an interface NOT contain?",
          options: [
            "Methods",
            "Properties",
            "Fields (instance variables)",
            "Events",
          ],
          answerIndex: 2,
          explanation: "Interfaces define behavior, not state storage.",
        },
        {
          id: "cs-6-17",
          question: "What is a 'Marker Interface'?",
          options: [
            "An interface with many methods",
            "An empty interface used to tag a class with metadata",
            "A UI interface",
            "A hidden interface",
          ],
          answerIndex: 1,
          explanation:
            "Used to signify a class has a certain property (though Attributes are more common now).",
        },
        {
          id: "cs-6-18",
          question: "What is 'Downcasting'?",
          options: [
            "Converting a base class reference back to a child class type",
            "Deleting a class",
            "Moving data to a database",
            "Lowering memory usage",
          ],
          answerIndex: 0,
          explanation:
            "It can be dangerous and should be done with 'is' or 'as' checks.",
        },
        {
          id: "cs-6-19",
          question: "What is the 'Liskov Substitution Principle'?",
          options: [
            "A math rule",
            "A principle stating that child classes should be replaceable by their base classes",
            "A way to name variables",
            "A sorting algorithm",
          ],
          answerIndex: 1,
          explanation:
            "It is a key part of SOLID principles for healthy OOP design.",
        },
        {
          id: "cs-6-20",
          question:
            "Which keyword creates a new version of a member in a child class, hiding the base version?",
          options: ["new", "override", "hide", "replace"],
          answerIndex: 0,
          explanation:
            "The 'new' modifier explicitly hides a member inherited from a base class.",
        },
      ],
    },
    {
      level: 7,
      title: "Level 7: Generics & Collections",
      description: "Type-safe data structures and reusable code logic.",
      passScore: 16,
      questions: [
        {
          id: "cs-7-1",
          question: "What are 'Generics' in C#?",
          options: [
            "General variables",
            "A way to define classes/methods with placeholders for types",
            "A type of list",
            "Random data",
          ],
          answerIndex: 1,
          explanation:
            "Generics allow you to write a class or method that can work with any data type while maintaining type safety.",
        },
        {
          id: "cs-7-2",
          question: "Which symbol is used to define a Generic type?",
          options: ["( )", "[ ]", "< >", "{ }"],
          answerIndex: 2,
          explanation: "Example: List<T> where T is the type parameter.",
        },
        {
          id: "cs-7-3",
          question: "What is the main advantage of List<T> over ArrayList?",
          options: [
            "It is older",
            "It avoids boxing/unboxing and provides type safety",
            "It can hold any type",
            "It is easier to name",
          ],
          answerIndex: 1,
          explanation:
            "ArrayList treats everything as an 'object', whereas List<int> only allows integers.",
        },
        {
          id: "cs-7-4",
          question: "What is a 'Generic Constraint'?",
          options: [
            "A limit on list size",
            "Restricting which types can be used as a generic argument",
            "A math rule",
            "A private class",
          ],
          answerIndex: 1,
          explanation:
            "Using the 'where' keyword, you can restrict T to be a class, a struct, or implement a specific interface.",
        },
        {
          id: "cs-7-5",
          question: "Which collection stores data as Key-Value pairs?",
          options: [
            "List<T>",
            "HashSet<T>",
            "Dictionary<TKey, TValue>",
            "Queue<T>",
          ],
          answerIndex: 2,
          explanation:
            "Dictionaries allow for extremely fast lookups based on a unique key.",
        },
        {
          id: "cs-7-6",
          question: "What is a 'HashSet<T>'?",
          options: [
            "A list that allows duplicates",
            "A collection of unique elements with high-performance set operations",
            "A sorted list",
            "A type of dictionary",
          ],
          answerIndex: 1,
          explanation:
            "HashSet prevents duplicate entries and offers near-instant search times.",
        },
        {
          id: "cs-7-7",
          question: "Which collection follows FIFO (First-In, First-Out)?",
          options: ["Stack<T>", "Queue<T>", "List<T>", "Array"],
          answerIndex: 1,
          explanation:
            "Queues are used for processing items in the order they arrived.",
        },
        {
          id: "cs-7-8",
          question: "Which collection follows LIFO (Last-In, First-Out)?",
          options: ["Stack<T>", "Queue<T>", "LinkedList<T>", "Dictionary<T>"],
          answerIndex: 0,
          explanation:
            "Stacks are like a pile of plates; you take the top one first.",
        },
        {
          id: "cs-7-9",
          question: "What does the 'default(T)' expression do?",
          options: [
            "Creates a new object",
            "Returns the default value for a type (null for reference, 0 for numeric)",
            "Deletes a variable",
            "Resets a list",
          ],
          answerIndex: 1,
          explanation:
            "It's a safe way to initialize a generic variable without knowing if it's a value or reference type.",
        },
        {
          id: "cs-7-10",
          question: "What is 'IEnumerable<T>'?",
          options: [
            "A type of array",
            "The base interface for all non-scalar collections that can be iterated",
            "A math function",
            "A database link",
          ],
          answerIndex: 1,
          explanation:
            "It allows a collection to be the source of a 'foreach' loop.",
        },
        {
          id: "cs-7-11",
          question: "What is the difference between List and LinkedList?",
          options: [
            "None",
            "List is better for random access; LinkedList is better for frequent insertions/deletions",
            "List is slower",
            "LinkedList is only for strings",
          ],
          answerIndex: 1,
          explanation:
            "LinkedLists consist of nodes pointing to the next item, making reordering easier than shifting array elements.",
        },
        {
          id: "cs-7-12",
          question:
            "What is 'Variance' (Covariance/Contravariance) in Generics?",
          options: [
            "Changing variable names",
            "How subtyping of complex types relates to subtyping of their component types",
            "A type of error",
            "Mathematical deviation",
          ],
          answerIndex: 1,
          explanation:
            "It allows you to use a more derived type than originally specified (e.g., IEnumerable<string> as IEnumerable<object>).",
        },
        {
          id: "cs-7-13",
          question: "Which namespace contains generic collections?",
          options: [
            "System.Collections",
            "System.Collections.Generic",
            "System.Linq",
            "System.IO",
          ],
          answerIndex: 1,
          explanation:
            "This namespace must be imported to use List, Dictionary, etc.",
        },
        {
          id: "cs-7-14",
          question: "How do you check if a Key exists in a Dictionary?",
          options: ["Contains()", "ContainsKey()", "HasKey()", "Exists()"],
          answerIndex: 1,
          explanation:
            "ContainsKey() returns a boolean without throwing an exception.",
        },
        {
          id: "cs-7-15",
          question: "What is 'ReadOnlyCollection<T>'?",
          options: [
            "A hidden list",
            "A wrapper that prevents users from modifying the underlying collection",
            "A fast list",
            "An empty list",
          ],
          answerIndex: 1,
          explanation:
            "It provides a 'view' of data that cannot be changed by the consumer.",
        },
        {
          id: "cs-7-16",
          question: "What is the 'capacity' of a List?",
          options: [
            "The number of items in it",
            "The total internal array size before it needs to resize",
            "The maximum possible items",
            "The memory size",
          ],
          answerIndex: 1,
          explanation:
            "Lists resize dynamically by doubling their capacity when the limit is reached.",
        },
        {
          id: "cs-7-17",
          question: "What is the 'Count' property in a collection?",
          options: [
            "The capacity",
            "The actual number of elements currently in the collection",
            "A math method",
            "A timer",
          ],
          answerIndex: 1,
          explanation: "Count tells you how many items you've actually added.",
        },
        {
          id: "cs-7-18",
          question: "Can a Dictionary have duplicate Keys?",
          options: ["Yes", "No", "Only if they are null", "Only in .NET Core"],
          answerIndex: 1,
          explanation:
            "Keys must be unique to allow the hashing algorithm to function.",
        },
        {
          id: "cs-7-19",
          question: "What is 'Type Erasure'?",
          options: [
            "Deleting types",
            "Something C# does NOT do (unlike Java)",
            "A memory error",
            "A way to hide code",
          ],
          answerIndex: 1,
          explanation:
            "In C#, generic type information is preserved at runtime, allowing for better performance and reflection.",
        },
        {
          id: "cs-7-20",
          question:
            "Which generic collection is best for removing the smallest or largest item quickly?",
          options: ["List", "SortedSet", "PriorityQueue (C# 6+)", "Queue"],
          answerIndex: 2,
          explanation:
            "PriorityQueue allows items to be dequeued based on a priority value.",
        },
      ],
    },
    {
      level: 8,
      title: "Level 8: LINQ (Language Integrated Query)",
      description: "Functional-style data querying for objects and databases.",
      passScore: 16,
      questions: [
        {
          id: "cs-8-1",
          question: "What does 'LINQ' stand for?",
          options: [
            "Logic In Network Queries",
            "Language Integrated Query",
            "List Indexing Native Quality",
            "Linked Internal Numbers",
          ],
          answerIndex: 1,
          explanation:
            "LINQ provides a consistent syntax for querying data from different sources (Arrays, SQL, XML).",
        },
        {
          id: "cs-8-2",
          question: "Which LINQ method is used to filter a collection?",
          options: ["Select", "Where", "Filter", "Find"],
          answerIndex: 1,
          explanation:
            "Where() takes a predicate (true/false) and returns matching elements.",
        },
        {
          id: "cs-8-3",
          question: "Which LINQ method transforms elements into a new form?",
          options: ["Change", "Select", "Transform", "Map"],
          answerIndex: 1,
          explanation:
            "Select() projects each element into a new shape (e.g., extracting just names from a list of Users).",
        },
        {
          id: "cs-8-4",
          question: "What is 'Deferred Execution' in LINQ?",
          options: [
            "Fast execution",
            "The query is not run until you iterate over the results",
            "An error handling method",
            "Running code in the background",
          ],
          answerIndex: 1,
          explanation:
            "A LINQ query only 'executes' when you use it in a foreach or call .ToList().",
        },
        {
          id: "cs-8-5",
          question: "Which method forces a LINQ query to execute immediately?",
          options: ["Run()", "Execute()", "ToList()", "Iterate()"],
          answerIndex: 2,
          explanation:
            "Methods like ToList(), ToArray(), or Count() trigger immediate execution.",
        },
        {
          id: "cs-8-6",
          question:
            "What is the difference between 'First()' and 'FirstOrDefault()'?",
          options: [
            "No difference",
            "FirstOrDefault() returns a default value if no item is found, while First() throws an exception",
            "First() is faster",
            "FirstOrDefault() is for lists only",
          ],
          answerIndex: 1,
          explanation:
            "FirstOrDefault() is safer when you aren't sure if the data exists.",
        },
        {
          id: "cs-8-7",
          question: "Which method is used to sort data in ascending order?",
          options: ["Sort()", "OrderBy()", "Arrange()", "Ascend()"],
          answerIndex: 1,
          explanation: "OrderBy() creates a sorted sequence based on a key.",
        },
        {
          id: "cs-8-8",
          question: "How do you add a second sorting criteria in LINQ?",
          options: ["ThenBy()", "AlsoBy()", "OrderByAgain()", "Next()"],
          answerIndex: 0,
          explanation:
            "Example: list.OrderBy(x => x.LastName).ThenBy(x => x.FirstName).",
        },
        {
          id: "cs-8-9",
          question: "What does 'GroupBy' return?",
          options: [
            "A list of lists",
            "A sequence of IGrouping objects (Key and a collection of values)",
            "A dictionary",
            "A single string",
          ],
          answerIndex: 1,
          explanation: "It organizes data into buckets based on a common key.",
        },
        {
          id: "cs-8-10",
          question: "What is 'Method Syntax' vs 'Query Syntax'?",
          options: [
            "C# vs SQL",
            "Dot-notation (list.Where...) vs SQL-like (from x in list...)",
            "Private vs Public",
            "Fast vs Slow",
          ],
          answerIndex: 1,
          explanation:
            "Both are compiled to the same code, but Method Syntax is more common in modern C#.",
        },
        {
          id: "cs-8-11",
          question:
            "Which method returns only the unique elements of a collection?",
          options: ["Unique()", "Distinct()", "Single()", "Group()"],
          answerIndex: 1,
          explanation:
            "Distinct() removes duplicates from the resulting sequence.",
        },
        {
          id: "cs-8-12",
          question: "What is 'Any()' used for?",
          options: [
            "To get any random item",
            "To check if at least one element satisfies a condition",
            "To count items",
            "To clear a list",
          ],
          answerIndex: 1,
          explanation:
            "It returns a boolean and is more efficient than .Count() > 0.",
        },
        {
          id: "cs-8-13",
          question: "What is 'All()' used for?",
          options: [
            "To select all items",
            "To check if EVERY element satisfies a condition",
            "To join lists",
            "To print data",
          ],
          answerIndex: 1,
          explanation:
            "It returns true only if every single item matches the predicate.",
        },
        {
          id: "cs-8-14",
          question: "What does 'SelectMany' do?",
          options: [
            "Selects multiple items",
            "Flattens a sequence of sequences into a single sequence",
            "Filters data twice",
            "Joins two tables",
          ],
          answerIndex: 1,
          explanation:
            "If you have a list of Departments and each has a list of Employees, SelectMany gives you one flat list of all Employees.",
        },
        {
          id: "cs-8-15",
          question: "Which method combines two collections based on a key?",
          options: ["Combine()", "Join()", "Union()", "Merge()"],
          answerIndex: 1,
          explanation: "Join() is similar to a SQL INNER JOIN.",
        },
        {
          id: "cs-8-16",
          question: "What is the 'Single()' method?",
          options: [
            "Returns one item and throws an exception if there isn't EXACTLY one",
            "Returns the first item",
            "Returns the last item",
            "Makes a list smaller",
          ],
          answerIndex: 0,
          explanation:
            "Use Single() when your logic dictates there should never be duplicates or empty results.",
        },
        {
          id: "cs-8-17",
          question: "What does 'Take(n)' do?",
          options: [
            "Removes n items",
            "Returns only the first n items",
            "Skips n items",
            "Multiplies items",
          ],
          answerIndex: 1,
          explanation:
            "Commonly used for pagination (e.g., showing only 10 results per page).",
        },
        {
          id: "cs-8-18",
          question: "What does 'Skip(n)' do?",
          options: [
            "Deletes n items",
            "Ignores the first n items and returns the rest",
            "Moves items",
            "Filters items",
          ],
          answerIndex: 1,
          explanation:
            "Used with Take() for paging: .Skip(20).Take(10) gets the 3rd page.",
        },
        {
          id: "cs-8-19",
          question: "What is 'LINQ to SQL' or 'Entity Framework'?",
          options: [
            "A way to write SQL inside C#",
            "Providers that translate LINQ queries into database commands",
            "A type of database",
            "A server",
          ],
          answerIndex: 1,
          explanation:
            "It allows you to query a database using C# objects without writing raw SQL strings.",
        },
        {
          id: "cs-8-20",
          question: "What is an 'Anonymous Type' in LINQ?",
          options: [
            "A hidden class",
            "A temporary class created on the fly to hold query results",
            "A dynamic variable",
            "An error",
          ],
          answerIndex: 1,
          explanation:
            "Example: select new { x.Name, x.Email }; creates an object without a formal class definition.",
        },
      ],
    },
    {
      level: 9,
      title: "Level 9: Asynchronous Programming (Async/Await)",
      description: "Non-blocking code for high-performance applications.",
      passScore: 16,
      questions: [
        {
          id: "cs-9-1",
          question: "What is the primary goal of Asynchronous programming?",
          options: [
            "To make code run faster",
            "To prevent blocking the main thread while waiting for I/O",
            "To use less memory",
            "To simplify math",
          ],
          answerIndex: 1,
          explanation:
            "It keeps applications responsive (like a UI not freezing) during long tasks like web requests.",
        },
        {
          id: "cs-9-2",
          question: "Which keyword marks a method as asynchronous?",
          options: ["task", "wait", "async", "thread"],
          answerIndex: 2,
          explanation:
            "The 'async' modifier allows the use of the 'await' keyword inside the method.",
        },
        {
          id: "cs-9-3",
          question:
            "Which keyword is used to pause execution until a task completes?",
          options: ["stop", "await", "hold", "yield"],
          answerIndex: 1,
          explanation:
            "'await' tells the program to yield control back to the caller until the task is finished.",
        },
        {
          id: "cs-9-4",
          question:
            "What is the typical return type of an async method that doesn't return a value?",
          options: ["void", "Task", "Thread", "AsyncResult"],
          answerIndex: 1,
          explanation: "'Task' is the C# object representing the ongoing work.",
        },
        {
          id: "cs-9-5",
          question:
            "What return type is used for an async method that returns a string?",
          options: ["Task<string>", "string", "AsyncString", "Task.String"],
          answerIndex: 0,
          explanation: "The result is wrapped in a Task container.",
        },
        {
          id: "cs-9-6",
          question:
            "Why should you avoid 'async void' (except for event handlers)?",
          options: [
            "It's slow",
            "Exceptions cannot be caught easily and you can't await it",
            "It uses more memory",
            "It's deprecated",
          ],
          answerIndex: 1,
          explanation:
            "'Async void' is 'fire-and-forget', making error handling nearly impossible.",
        },
        {
          id: "cs-9-7",
          question: "What does 'Task.WhenAll' do?",
          options: [
            "Runs tasks one by one",
            "Waits for multiple tasks to complete in parallel",
            "Cancels all tasks",
            "Restarts tasks",
          ],
          answerIndex: 1,
          explanation:
            "It's a way to perform multiple independent operations simultaneously.",
        },
        {
          id: "cs-9-8",
          question: "What does 'Task.Run' do?",
          options: [
            "Starts a UI thread",
            "Queues work to run on a background thread (ThreadPool)",
            "Runs a task synchronously",
            "Deletes a task",
          ],
          answerIndex: 1,
          explanation:
            "It is used for CPU-bound work that would otherwise freeze the main thread.",
        },
        {
          id: "cs-9-9",
          question: "What is a 'CancellationToken'?",
          options: [
            "An error message",
            "A way to signal that an asynchronous operation should stop",
            "A security key",
            "A timer",
          ],
          answerIndex: 1,
          explanation:
            "It allows users to cancel long-running tasks (like a 'Cancel' button on a download).",
        },
        {
          id: "cs-9-10",
          question: "What is the 'Deadlock' risk in async code?",
          options: [
            "The computer crashing",
            "Two tasks waiting for each other to finish, freezing the app",
            "Running out of memory",
            "A security breach",
          ],
          answerIndex: 1,
          explanation:
            "Commonly caused by calling .Result or .Wait() on a task from the UI thread.",
        },
        {
          id: "cs-9-11",
          question: "What does 'ConfigureAwait(false)' do?",
          options: [
            "Speeds up the task",
            "Tells the task it doesn't need to return to the original context/thread",
            "Handles errors",
            "Logs data",
          ],
          answerIndex: 1,
          explanation:
            "Used in library code to improve performance and prevent deadlocks.",
        },
        {
          id: "cs-9-12",
          question: "What is the 'TAP' pattern?",
          options: [
            "Type Async Pattern",
            "Task-based Asynchronous Pattern",
            "Threaded Application Process",
            "Timed Async Processing",
          ],
          answerIndex: 1,
          explanation:
            "It is the standard way .NET handles asynchrony using Tasks.",
        },
        {
          id: "cs-9-13",
          question: "What is 'ValueTask<T>'?",
          options: [
            "A slower Task",
            "A lightweight, value-type alternative to Task for high-performance scenarios",
            "A task for integers only",
            "A task that returns null",
          ],
          answerIndex: 1,
          explanation:
            "It reduces allocations when a result might already be available synchronously.",
        },
        {
          id: "cs-9-14",
          question: "How do you handle exceptions in an awaited task?",
          options: [
            "You can't",
            "Using standard try-catch blocks",
            "Using an if statement",
            "Using Task.Error",
          ],
          answerIndex: 1,
          explanation:
            "Awaiting a task 'unwraps' the exception, allowing normal catch logic.",
        },
        {
          id: "cs-9-15",
          question: "What happens if you don't 'await' an async call?",
          options: [
            "The program crashes",
            "The code continues immediately without waiting for the result (Fire-and-forget)",
            "The compiler fixes it",
            "The task is deleted",
          ],
          answerIndex: 1,
          explanation:
            "This often leads to bugs where data isn't ready when you try to use it.",
        },
        {
          id: "cs-9-16",
          question: "What is 'IAsyncEnumerable<T>' (C# 8.0+)?",
          options: [
            "An async list",
            "A way to stream data asynchronously using 'await foreach'",
            "A database table",
            "A type of array",
          ],
          answerIndex: 1,
          explanation:
            "Perfect for reading large amounts of data from a web API or database in chunks.",
        },
        {
          id: "cs-9-17",
          question: "What is the 'Thread Pool'?",
          options: [
            "A place to store variables",
            "A collection of worker threads managed by the .NET runtime",
            "A memory area",
            "A type of loop",
          ],
          answerIndex: 1,
          explanation:
            "It efficiently reuses threads to avoid the cost of creating new ones for every task.",
        },
        {
          id: "cs-9-18",
          question: "What is 'Concurrency' vs 'Parallelism'?",
          options: [
            "No difference",
            "Concurrency is managing many tasks; Parallelism is doing many tasks at once",
            "Parallelism is slower",
            "Concurrency is for web only",
          ],
          answerIndex: 1,
          explanation:
            "Parallelism requires multiple CPU cores; Concurrency can happen on one core via context switching.",
        },
        {
          id: "cs-9-19",
          question: "What does 'Task.Delay' do?",
          options: [
            "Freezes the thread",
            "Asynchronously waits for a set time without blocking the thread",
            "Slows down the CPU",
            "Is a timer error",
          ],
          answerIndex: 1,
          explanation: "It is the async-friendly version of Thread.Sleep().",
        },
        {
          id: "cs-9-20",
          question: "Can 'Main' be async in C#?",
          options: [
            "No",
            "Yes, since C# 7.1",
            "Only in .NET Framework",
            "Only for console apps",
          ],
          answerIndex: 1,
          explanation:
            "Static Task Main() allows you to use await directly in your entry point.",
        },
      ],
    },
    {
      level: 10,
      title: "Level 10: Delegates, Events & Lambdas",
      description: "Function pointers and reactive programming.",
      passScore: 16,
      questions: [
        {
          id: "cs-10-1",
          question: "What is a 'Delegate'?",
          options: [
            "A project manager",
            "A type-safe function pointer",
            "A class attribute",
            "A type of loop",
          ],
          answerIndex: 1,
          explanation:
            "It defines a method signature that can be passed as a parameter.",
        },
        {
          id: "cs-10-2",
          question: "What is an 'Event'?",
          options: [
            "A calendar item",
            "An encapsulated delegate used for notifications",
            "A type of method",
            "A global variable",
          ],
          answerIndex: 1,
          explanation:
            "Events follow the Publisher-Subscriber pattern to alert other classes when something happens.",
        },
        {
          id: "cs-10-3",
          question: "What is a 'Lambda Expression'?",
          options: [
            "A math symbol",
            "An anonymous function using the => operator",
            "A private class",
            "A string formatter",
          ],
          answerIndex: 1,
          explanation:
            "Example: (x, y) => x + y; is a concise way to write methods.",
        },
        {
          id: "cs-10-4",
          question: "What is the 'Action' delegate?",
          options: [
            "A UI button",
            "A built-in delegate that returns void",
            "A math operation",
            "A movement command",
          ],
          answerIndex: 1,
          explanation: "Action<int> takes an int and returns nothing.",
        },
        {
          id: "cs-10-5",
          question: "What is the 'Func' delegate?",
          options: [
            "A funny function",
            "A built-in delegate that MUST return a value",
            "A loop tool",
            "A class name",
          ],
          answerIndex: 1,
          explanation:
            "Func<int, string> takes an int and returns a string (the last parameter is always the return type).",
        },
        {
          id: "cs-10-6",
          question: "What is the 'Predicate' delegate?",
          options: [
            "A search tool",
            "A delegate that returns a boolean",
            "A sorting rule",
            "A logic gate",
          ],
          answerIndex: 1,
          explanation:
            "Commonly used in LINQ for filtering (e.g., Where(x => x > 5)).",
        },
        {
          id: "cs-10-7",
          question: "What is a 'Multicast Delegate'?",
          options: [
            "A fast delegate",
            "A delegate that holds references to multiple methods",
            "A delegate used in video",
            "A global delegate",
          ],
          answerIndex: 1,
          explanation:
            "When invoked, it calls all registered methods in order.",
        },
        {
          id: "cs-10-8",
          question: "Which operator adds a method to an event?",
          options: ["+", "+=", "=", "++"],
          answerIndex: 1,
          explanation: "The += operator 'subscribes' to an event.",
        },
        {
          id: "cs-10-9",
          question: "Which operator removes a method from an event?",
          options: ["-", "-=", "--", "delete"],
          answerIndex: 1,
          explanation:
            "The -= operator 'unsubscribes' to prevent memory leaks.",
        },
        {
          id: "cs-10-10",
          question: "What is a 'Closure' in C# Lambdas?",
          options: [
            "Closing a file",
            "A lambda capturing variables from its outer scope",
            "Ending a program",
            "A private method",
          ],
          answerIndex: 1,
          explanation:
            "The lambda 'remembers' the variable even after the outer method finished executing.",
        },
        {
          id: "cs-10-11",
          question: "What is the purpose of the 'event' keyword?",
          options: [
            "To make a delegate public",
            "To protect the delegate so only += and -= can be used from outside",
            "To speed up code",
            "To create a log",
          ],
          answerIndex: 1,
          explanation:
            "It prevents external code from clearing the subscriber list or triggering the event directly.",
        },
        {
          id: "cs-10-12",
          question: "What is 'Expression Trees'?",
          options: [
            "A type of UI",
            "Representing code as a data structure that can be parsed (used in LINQ providers)",
            "A folder structure",
            "A math diagram",
          ],
          answerIndex: 1,
          explanation:
            "This is how Entity Framework turns your C# code into SQL.",
        },
        {
          id: "cs-10-13",
          question: "What is the 'EventArgs' class?",
          options: [
            "An error message",
            "The base class for classes containing event data",
            "A list of arguments",
            "A math result",
          ],
          answerIndex: 1,
          explanation:
            "It is standard practice to pass data to subscribers via a class inheriting from EventArgs.",
        },
        {
          id: "cs-10-14",
          question: "What is 'Anonymous Method' syntax?",
          options: [
            "Using the 'delegate' keyword instead of lambdas",
            "Methods with no name",
            "Private methods",
            "Internal methods",
          ],
          answerIndex: 0,
          explanation:
            "The old way (pre-C# 3.0) to write inline functions; lambdas have mostly replaced them.",
        },
        {
          id: "cs-10-15",
          question: "What is 'Covariance' in delegates?",
          options: [
            "Using a method that returns a more derived type",
            "Using multiple threads",
            "Using math symbols",
            "Error handling",
          ],
          answerIndex: 0,
          explanation:
            "It allows flexibility in matching method signatures to delegates.",
        },
        {
          id: "cs-10-16",
          question: "What happens if an event is null when triggered?",
          options: [
            "Nothing",
            "A NullReferenceException is thrown",
            "The program restarts",
            "A log is created",
          ],
          answerIndex: 1,
          explanation:
            "You must always check 'if (MyEvent != null)' or use 'MyEvent?.Invoke()'.",
        },
        {
          id: "cs-10-17",
          question: "What is the 'EventHandler' delegate?",
          options: [
            "A built-in delegate for standard events",
            "A UI controller",
            "A file manager",
            "An error logger",
          ],
          answerIndex: 0,
          explanation: "It follows the signature (object sender, EventArgs e).",
        },
        {
          id: "cs-10-18",
          question: "What is 'Statement Lambda'?",
          options: [
            "A one-line lambda",
            "A lambda with multiple lines inside { }",
            "A print statement",
            "A logic gate",
          ],
          answerIndex: 1,
          explanation: "Example: (x) => { var y = x + 1; return y; };",
        },
        {
          id: "cs-10-19",
          question: "What is 'Discard' in lambdas?",
          options: [
            "Deleting code",
            "Using an underscore (_) for parameters you don't intend to use",
            "Exiting a loop",
            "A memory tool",
          ],
          answerIndex: 1,
          explanation: "Example: (_, y) => Console.WriteLine(y);",
        },
        {
          id: "cs-10-20",
          question:
            "Which keyword allows a lambda to be used in an async context?",
          options: ["wait", "task", "async", "thread"],
          answerIndex: 2,
          explanation: "Example: async (x) => await DoSomething(x);",
        },
      ],
    },
    {
      level: 11,
      title: "Level 11: Advanced C# & Internals",
      description:
        "Reflection, Attributes, Unsafe Code, and Garbage Collection.",
      passScore: 16,
      questions: [
        {
          id: "cs-11-1",
          question: "What is 'Reflection'?",
          options: [
            "A mirror effect",
            "The ability to inspect and interact with metadata and types at runtime",
            "A memory leak",
            "A type of loop",
          ],
          answerIndex: 1,
          explanation:
            "Reflection allows you to browse assemblies, find classes, and even invoke methods dynamically.",
        },
        {
          id: "cs-11-2",
          question: "What are 'Attributes'?",
          options: [
            "Class variables",
            "Metadata tags added to code elements like [Serializable]",
            "Private fields",
            "Project settings",
          ],
          answerIndex: 1,
          explanation:
            "Attributes provide extra information to the compiler or runtime tools.",
        },
        {
          id: "cs-11-3",
          question: "What is 'The Garbage Collector' (GC)?",
          options: [
            "A physical device",
            "An automatic memory management system that reclaims unused objects",
            "A file deleter",
            "An error handler",
          ],
          answerIndex: 1,
          explanation:
            "The GC runs in the background to free up memory on the Heap.",
        },
        {
          id: "cs-11-4",
          question: "What is 'Generation 0' in the GC?",
          options: [
            "Old objects",
            "Short-lived objects (the most frequent collection)",
            "Static variables",
            "System files",
          ],
          answerIndex: 1,
          explanation:
            "The GC uses generations (0, 1, 2) to optimize performance based on object lifespan.",
        },
        {
          id: "cs-11-5",
          question: "What does the 'unsafe' keyword do?",
          options: [
            "Allows viruses",
            "Enables the use of pointers and direct memory manipulation",
            "Skips error handling",
            "Speeds up UI",
          ],
          answerIndex: 1,
          explanation:
            "It is used for low-level performance or interop with C/C++ libraries.",
        },
        {
          id: "cs-11-6",
          question: "What is a 'Pointer' in C#?",
          options: [
            "A mouse cursor",
            "A variable that holds the memory address of another variable",
            "A type of list",
            "A class reference",
          ],
          answerIndex: 1,
          explanation: "Pointers are only allowed in 'unsafe' blocks.",
        },
        {
          id: "cs-11-7",
          question: "What is 'P/Invoke'?",
          options: [
            "Printing data",
            "Platform Invocation Services (calling unmanaged DLL functions from C#)",
            "A loop tool",
            "A security protocol",
          ],
          answerIndex: 1,
          explanation:
            "It's how C# communicates with the Windows API or other C-based libraries.",
        },
        {
          id: "cs-11-8",
          question: "What is 'Memory Leak' in a managed language like C#?",
          options: [
            "Impossible",
            "Holding onto references of objects that are no longer needed, preventing GC",
            "The CPU overheating",
            "Deleting files too fast",
          ],
          answerIndex: 1,
          explanation:
            "Static variables or forgotten event subscriptions are common causes.",
        },
        {
          id: "cs-11-9",
          question: "What is 'The Stack'?",
          options: [
            "A pile of files",
            "Fast memory used for local variables and method calls",
            "Large object storage",
            "A database table",
          ],
          answerIndex: 1,
          explanation: "The Stack is automatically managed and very fast.",
        },
        {
          id: "cs-11-10",
          question: "What is 'The Heap'?",
          options: [
            "A mess of code",
            "Memory used for long-lived objects managed by the GC",
            "A sorting algorithm",
            "A hardware component",
          ],
          answerIndex: 1,
          explanation: "The Heap is where all class instances live.",
        },
        {
          id: "cs-11-11",
          question: "What is 'Span<T>' (C# 7.2+)?",
          options: [
            "A type of bridge",
            "A memory-safe representation of contiguous regions of arbitrary memory",
            "A loop over time",
            "A type of list",
          ],
          answerIndex: 1,
          explanation:
            "It allows for high-performance slicing of arrays and strings without making copies.",
        },
        {
          id: "cs-11-12",
          question: "What is 'Dynamic' keyword?",
          options: [
            "A fast variable",
            "Bypasses compile-time type checking for a variable",
            "A type of animation",
            "A cloud variable",
          ],
          answerIndex: 1,
          explanation:
            "The type is resolved at runtime using the DLR (Dynamic Language Runtime).",
        },
        {
          id: "cs-11-13",
          question: "What is 'JIT' (Just-In-Time) compilation?",
          options: [
            "Writing code fast",
            "Compiling IL code into machine code right before it runs",
            "A version control tool",
            "A debug mode",
          ],
          answerIndex: 1,
          explanation:
            "The .NET runtime uses JIT to optimize code for the specific CPU it is running on.",
        },
        {
          id: "cs-11-14",
          question: "What is 'IL' (Intermediate Language)?",
          options: [
            "International Language",
            "The CPU-independent instruction set that C# compiles into",
            "A type of script",
            "A database query",
          ],
          answerIndex: 1,
          explanation:
            "This is what allows .NET code to be portable across different operating systems.",
        },
        {
          id: "cs-11-15",
          question: "What is 'Memory Profiling'?",
          options: [
            "Setting a password",
            "The process of analyzing memory usage to find leaks or bottlenecks",
            "Sorting data",
            "Encrypting files",
          ],
          answerIndex: 1,
          explanation:
            "Tools like dotMemory or Visual Studio Profiler help with this.",
        },
        {
          id: "cs-11-16",
          question: "What is the 'fixed' statement used for?",
          options: [
            "Fixing a bug",
            "Pinning an object in memory so the GC doesn't move it",
            "A static variable",
            "A math constant",
          ],
          answerIndex: 1,
          explanation: "Crucial when passing pointers to unmanaged code.",
        },
        {
          id: "cs-11-17",
          question: "What is 'AOT' (Ahead-Of-Time) compilation?",
          options: [
            "Compiling code early",
            "Compiling to machine code before the app is ever run",
            "A legacy tool",
            "A type of database",
          ],
          answerIndex: 1,
          explanation:
            "Common in mobile development (Xamarin/MAUI) and Blazor for faster startup.",
        },
        {
          id: "cs-11-18",
          question: "What is 'The LOH' (Large Object Heap)?",
          options: [
            "A big database",
            "A special part of the heap for objects larger than 85,000 bytes",
            "A slow list",
            "A global storage",
          ],
          answerIndex: 1,
          explanation:
            "LOH is collected less frequently and can cause fragmentation.",
        },
        {
          id: "cs-11-19",
          question: "What does 'IDisposable' do?",
          options: [
            "Deletes a variable",
            "Provides a mechanism for releasing unmanaged resources like file handles",
            "Clears the screen",
            "Restarts the app",
          ],
          answerIndex: 1,
          explanation:
            "Usually used with a 'using' block to ensure Dispose() is called.",
        },
        {
          id: "cs-11-20",
          question: "What is 'Native AOT' (C# 11+)?",
          options: [
            "A type of UI",
            "Compiling a C# app into a self-contained, native executable with no runtime dependency",
            "A browser tool",
            "A cloud server",
          ],
          answerIndex: 1,
          explanation:
            "It results in tiny footprints and near-instant startup times.",
        },
      ],
    },
  ],
};
