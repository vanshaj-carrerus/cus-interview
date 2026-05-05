import { TopicData } from "@/app/practice/data/types";


export const rustMasteryData: TopicData = {
    slug: "rust-mastery",
    title: "Rust Mastery",
    intro: "From basic syntax to advanced concepts in Rust programming.",
    levels: [
      {
        level: 1,
        title: "Level 1: Rust Basics",
        description: "Syntax, variables, and basic data types.",
        passScore: 16,
        questions: [
          {
            id: "rs-1-1",
            question: "Which keyword is used to declare a variable in Rust?",
            options: ["var", "let", "const", "def"],
            answerIndex: 1,
            explanation: "In Rust, variables are immutable by default and require this keyword for declaration."
          },
          {
            id: "rs-1-2",
            question: "How do you make a variable mutable?",
            options: ["mut let x = 5;", "let x mut = 5;", "let mut x = 5;", "x = mut 5;"],
            answerIndex: 2,
            explanation: "You must explicitly signal to the compiler that a value's data is allowed to change."
          },
          {
            id: "rs-1-3",
            question: "Which macro is used to print text to the console?",
            options: ["print()", "log!()", "println!()", "echo!()"],
            answerIndex: 2,
            explanation: "The '!' indicates a macro rather than a standard function call."
          },
          {
            id: "rs-1-4",
            question: "What is the file extension for Rust source files?",
            options: [".rl", ".rust", ".rs", ".rb"],
            answerIndex: 2,
            explanation: "It follows a two-letter shorthand similar to other systems languages."
          },
          {
            id: "rs-1-5",
            question: "What is the standard build tool and package manager for Rust?",
            options: ["npm", "pip", "cargo", "maven"],
            answerIndex: 2,
            explanation: "This tool handles downloading libraries, compiling code, and making packages."
          },
          {
            id: "rs-1-6",
            question: "Which type represents a signed 32-bit integer?",
            options: ["u32", "i32", "int32", "f32"],
            answerIndex: 1,
            explanation: "The prefix distinguishes between 'signed' (negative/positive) and 'unsigned'."
          },
          {
            id: "rs-1-7",
            question: "What does 'const' require that 'let' does not?",
            options: ["A semicolon", "Explicit type annotation", "A value", "Mutable access"],
            answerIndex: 1,
            explanation: "Constants must be defined with a specific type because the compiler cannot infer them."
          },
          {
            id: "rs-1-8",
            question: "How do you define a function in Rust?",
            options: ["function name()", "def name()", "fn name()", "func name()"],
            answerIndex: 2,
            explanation: "Rust uses a two-letter keyword to start function definitions."
          },
          {
            id: "rs-1-9",
            question: "What is a 'Scalar' type in Rust?",
            options: ["Array", "Integer", "Struct", "Tuple"],
            answerIndex: 1,
            explanation: "This represents a single value, such as a number, boolean, or character."
          },
          {
            id: "rs-1-10",
            question: "What is the default integer type in Rust?",
            options: ["i32", "i64", "isize", "u32"],
            answerIndex: 0,
            explanation: "Unless specified, the compiler defaults to this signed 32-bit format."
          },
          {
            id: "rs-1-11",
            question: "Which compound type has a fixed length and can hold multiple types?",
            options: ["Array", "Vector", "Tuple", "Slice"],
            answerIndex: 2,
            explanation: "It is written as a comma-separated list inside parentheses."
          },
          {
            id: "rs-1-12",
            question: "How do you access the first element of an array 'a'?",
            options: ["a(0)", "a[0]", "a.first", "a{0}"],
            answerIndex: 1,
            explanation: "Rust uses standard square bracket indexing starting from zero."
          },
          {
            id: "rs-1-13",
            question: "What is the boolean type in Rust?",
            options: ["bit", "bool", "boolean", "binary"],
            answerIndex: 1,
            explanation: "It is one byte in size and can be either true or false."
          },
          {
            id: "rs-1-14",
            question: "Which command creates a new Rust project via Cargo?",
            options: ["cargo build", "cargo create", "cargo new", "cargo init"],
            answerIndex: 2,
            explanation: "This command generates the directory structure and a configuration file."
          },
          {
            id: "rs-1-15",
            question: "What does 'f64' represent?",
            options: ["Fast 64-bit integer", "Floating-point 64-bit", "Fixed 64-bit", "Function 64"],
            answerIndex: 1,
            explanation: "It is the default type for decimal numbers in Rust."
          },
          {
            id: "rs-1-16",
            question: "How do you write a single-line comment?",
            options: ["# comment", "// comment", "-- comment", "/* comment"],
            answerIndex: 1,
            explanation: "It uses the same syntax as C++ or Java for comments."
          },
          {
            id: "rs-1-17",
            question: "What is 'Shadowing' in Rust?",
            options: ["Deleting a variable", "Declaring a new variable with the same name", "Changing a variable's memory address", "A security feature"],
            answerIndex: 1,
            explanation: "This allows you to reuse a name and change its type while remaining immutable."
          },
          {
            id: "rs-1-18",
            question: "Which type is used for a single Unicode character?",
            options: ["string", "str", "char", "utf8"],
            answerIndex: 2,
            explanation: "It is four bytes in size and defined with single quotes."
          },
          {
            id: "rs-1-19",
            question: "What is the entry point of every Rust program?",
            options: ["fn start()", "fn run()", "fn main()", "fn init()"],
            answerIndex: 2,
            explanation: "The execution of the binary begins within this specific function name."
          },
          {
            id: "rs-1-20",
            question: "Which keyword returns a value from a function early?",
            options: ["break", "exit", "return", "stop"],
            answerIndex: 2,
            explanation: "While Rust uses expressions for returns, this keyword is needed for exiting before the end."
          }
        ]
      },
      {
        level: 2,
        title: "Level 2: Ownership & Borrowing",
        description: "The core concept of Rust's memory management.",
        passScore: 16,
        questions: [
          {
            id: "rs-2-1",
            question: "How many owners can a value have at one time?",
            options: ["One", "Two", "Unlimited", "Zero"],
            answerIndex: 0,
            explanation: "This rule prevents data races and ensures safe memory cleanup."
          },
          {
            id: "rs-2-2",
            question: "What happens when an owner goes out of scope?",
            options: ["The value is moved", "The memory is dropped", "The value becomes static", "Nothing"],
            answerIndex: 1,
            explanation: "Rust automatically cleans up memory without a garbage collector."
          },
          {
            id: "rs-2-3",
            question: "What is it called when you pass a value to a function?",
            options: ["Copying", "Borrowing", "Moving", "Linking"],
            answerIndex: 2,
            explanation: "The original variable can no longer be used because the function now owns it."
          },
          {
            id: "rs-2-4",
            question: "What symbol denotes a reference (borrowing)?",
            options: ["*", "&", "@", "%"],
            answerIndex: 1,
            explanation: "This allows you to refer to a value without taking ownership of it."
          },
          {
            id: "rs-2-5",
            question: "Which of these is a valid mutable reference?",
            options: ["&mut x", "mut &x", "*mut x", "&x mut"],
            answerIndex: 0,
            explanation: "This allows a function to modify a borrowed value."
          },
          {
            id: "rs-2-6",
            question: "How many mutable references can exist for one piece of data at a time?",
            options: ["One", "Two", "Infinite", "Zero"],
            answerIndex: 0,
            explanation: "This restriction prevents data races at compile time."
          },
          {
            id: "rs-2-7",
            question: "Can you have a mutable reference while immutable references exist?",
            options: ["Yes", "No", "Only in main", "Only for integers"],
            answerIndex: 1,
            explanation: "Multiple readers are allowed, or one writer, but never both simultaneously."
          },
          {
            id: "rs-2-8",
            question: "What is a 'Dangling Reference'?",
            options: ["A reference to null", "A reference to memory that has been freed", "A reference with no name", "A slow reference"],
            answerIndex: 1,
            explanation: "The compiler prevents this by ensuring the data lives longer than the pointer."
          },
          {
            id: "rs-2-9",
            question: "Which data type is stored on the stack?",
            options: ["String", "Vector", "i32", "Box"],
            answerIndex: 2,
            explanation: "Types with a fixed, known size at compile time use this fast memory segment."
          },
          {
            id: "rs-2-10",
            question: "Which data type is stored on the heap?",
            options: ["bool", "char", "String", "u8"],
            answerIndex: 2,
            explanation: "Data that can grow in size or has an unknown size at runtime uses this memory."
          },
          {
            id: "rs-2-11",
            question: "What is the difference between String and &str?",
            options: ["No difference", "String is owned; &str is a reference", "&str is owned; String is a reference", "String is for numbers"],
            answerIndex: 1,
            explanation: "One is a growable buffer on the heap, the other is an immutable view."
          },
          {
            id: "rs-2-12",
            question: "What does .clone() do?",
            options: ["Creates a reference", "Makes a deep copy of heap data", "Moves ownership", "Deletes data"],
            answerIndex: 1,
            explanation: "This allows you to have two independent owners of the same data."
          },
          {
            id: "rs-2-13",
            question: "Which trait allows a type to be duplicated by simple bitwise copying?",
            options: ["Clone", "Copy", "Dup", "Sync"],
            answerIndex: 1,
            explanation: "Simple types like integers implement this so they aren't moved when used."
          },
          {
            id: "rs-2-14",
            question: "What is a 'Slice'?",
            options: ["A copy of an array", "A reference to a contiguous sequence in a collection", "A type of struct", "A file reader"],
            answerIndex: 1,
            explanation: "It lets you look at a part of a collection without owning it."
          },
          {
            id: "rs-2-15",
            question: "What is the syntax for a slice of array 'a' from index 1 to 3?",
            options: ["&a[1-3]", "&a[1..3]", "a{1..3}", "&a[1:3]"],
            answerIndex: 1,
            explanation: "The range syntax in Rust uses two dots and is exclusive of the end index."
          },
          {
            id: "rs-2-16",
            question: "What does 'RAII' stand for in Rust?",
            options: ["Run All Internal Items", "Resource Acquisition Is Initialization", "Random Access Input Interface", "Rust Advanced Internal Implementation"],
            answerIndex: 1,
            explanation: "It means the lifetime of an object is tied to its scope."
          },
          {
            id: "rs-2-17",
            question: "What happens if you try to use a variable after it has been moved?",
            options: ["Null pointer", "Runtime crash", "Compile-time error", "It works normally"],
            answerIndex: 2,
            explanation: "The 'borrow checker' validates ownership before the program even runs."
          },
          {
            id: "rs-2-18",
            question: "What is the purpose of 'Borrowing'?",
            options: ["To slow down code", "To access data without taking ownership", "To bypass security", "To create global variables"],
            answerIndex: 1,
            explanation: "It enables multiple parts of code to read data without the overhead of copying."
          },
          {
            id: "rs-2-19",
            question: "Which of these is a string literal's type?",
            options: ["String", "str", "&str", "char[]"],
            answerIndex: 2,
            explanation: "Literals are hardcoded into the binary and accessed as immutable slices."
          },
          {
            id: "rs-2-20",
            question: "Can a function return a reference to a local variable?",
            options: ["Yes", "No", "Only if it is mut", "Only if it is i32"],
            answerIndex: 1,
            explanation: "Since the local data is dropped at the end of the function, the reference would be invalid."
          }
        ]
      },
      {
        level: 3,
        title: "Level 3: Structs & Enums",
        description: "Defining custom types and patterns.",
        passScore: 16,
        questions: [
          {
            id: "rs-3-1",
            question: "Which keyword defines a custom data structure?",
            options: ["class", "object", "struct", "type"],
            answerIndex: 2,
            explanation: "It allows you to group related values of different types into a named unit."
          },
          {
            id: "rs-3-2",
            question: "How do you access a field 'age' in a struct 'user'?",
            options: ["user['age']", "user->age", "user.age", "user::age"],
            answerIndex: 2,
            explanation: "Rust uses dot notation for member access."
          },
          {
            id: "rs-3-3",
            question: "What is a 'Tuple Struct'?",
            options: ["A struct with no fields", "A struct with named fields", "A struct with fields that have no names", "A type of array"],
            answerIndex: 2,
            explanation: "It behaves like a named tuple, useful for simple wrappers."
          },
          {
            id: "rs-3-4",
            question: "Which block is used to define methods for a struct?",
            options: ["def", "impl", "methods", "fn"],
            answerIndex: 1,
            explanation: "This keyword stands for 'implementation' and separates data from logic."
          },
          {
            id: "rs-3-5",
            question: "What is the first parameter of most methods?",
            options: ["this", "self", "&self", "ctx"],
            answerIndex: 2,
            explanation: "This represents the instance of the struct the method is being called on."
          },
          {
            id: "rs-3-6",
            question: "What is an 'Associated Function'?",
            options: ["A method with &self", "A function in an impl block without self", "A global function", "A closure"],
            answerIndex: 1,
            explanation: "These are called using the '::' syntax, often used for constructors."
          },
          {
            id: "rs-3-7",
            question: "Which keyword defines a type that can be one of several variants?",
            options: ["union", "select", "enum", "choice"],
            answerIndex: 2,
            explanation: "Short for 'enumeration', it allows a variable to hold different kinds of data."
          },
          {
            id: "rs-3-8",
            question: "What is a 'Unit Struct'?",
            options: ["A struct with one field", "A struct with no fields at all", "A struct for math", "A default struct"],
            answerIndex: 1,
            explanation: "Useful for implementing traits on a type without storing any data."
          },
          {
            id: "rs-3-9",
            question: "How do you extract values from an Enum?",
            options: ["if statements", "match expressions", "for loops", "dot notation"],
            answerIndex: 1,
            explanation: "This control flow operator is exhaustive and ensures every possibility is handled."
          },
          {
            id: "rs-3-10",
            question: "What does the 'Option' enum handle?",
            options: ["Errors", "The presence or absence of a value", "Loop choices", "Config settings"],
            answerIndex: 1,
            explanation: "It replaces the concept of 'null' with 'Some' and 'None'."
          },
          {
            id: "rs-3-11",
            question: "What are the two variants of the 'Result' enum?",
            options: ["True and False", "Yes and No", "Ok and Err", "Some and None"],
            answerIndex: 2,
            explanation: "This is the standard way Rust handles functions that might fail."
          },
          {
            id: "rs-3-12",
            question: "What is the 'placeholder' symbol in a match arm?",
            options: ["*", "?", "_", "."],
            answerIndex: 2,
            explanation: "It matches any value and is used to handle default cases."
          },
          {
            id: "rs-3-13",
            question: "Which keyword creates a concise match for only one pattern?",
            options: ["match", "if let", "when", "if"],
            answerIndex: 1,
            explanation: "It is less verbose than a full match when you only care about one variant."
          },
          {
            id: "rs-3-14",
            question: "Can Rust Enums store data inside their variants?",
            options: ["No", "Yes", "Only strings", "Only integers"],
            answerIndex: 1,
            explanation: "This makes them much more powerful than enums in languages like C."
          },
          {
            id: "rs-3-15",
            question: "How do you instantiate an associated function like 'String::new()'?",
            options: ["String.new()", "String->new()", "String::new()", "new String()"],
            answerIndex: 2,
            explanation: "The double colon is used for namespacing and associated items."
          },
          {
            id: "rs-3-16",
            question: "What is 'Pattern Matching'?",
            options: ["Comparing strings", "A mechanism to check a value against a series of patterns", "Searching for files", "Styling code"],
            answerIndex: 1,
            explanation: "It allows you to deconstruct complex types like structs and enums safely."
          },
          {
            id: "rs-3-17",
            question: "What does the 'derive' attribute do for a struct?",
            options: ["Calculates values", "Automatically generates basic trait implementations", "Hides the struct", "Connects to a database"],
            answerIndex: 1,
            explanation: "Commonly used with #[derive(Debug)] to allow printing of the structure."
          },
          {
            id: "rs-3-18",
            question: "What is 'Exhaustive' matching?",
            options: ["A slow match", "The requirement to cover every possible enum variant in a match", "Matching until tired", "Matching all variables"],
            answerIndex: 1,
            explanation: "This prevents bugs where a new variant is added but not handled in logic."
          },
          {
            id: "rs-3-19",
            question: "How do you update a struct while keeping most fields the same?",
            options: ["Copy/Paste", "Struct Update Syntax (..)", "Using a loop", "It's not possible"],
            answerIndex: 1,
            explanation: "The '..' syntax allows you to fill in remaining fields from another instance."
          },
          {
            id: "rs-3-20",
            question: "What is 'self' (lowercase) in an impl block?",
            options: ["The type name", "An alias for the instance being called", "A global variable", "A keyword for loop"],
            answerIndex: 1,
            explanation: "It refers to the object itself, similar to 'this' in other languages."
          }
        ]
      },{
        level: 4,
        title: "Level 4: Error Handling",
        description: "Recoverable and unrecoverable errors.",
        passScore: 16,
        questions: [
          {
            id: "rs-4-1",
            question: "Which macro is used for unrecoverable errors?",
            options: ["error!()", "panic!()", "exit!()", "stop!()"],
            answerIndex: 1,
            explanation: "This causes the program to print a failure message, unwind the stack, and quit."
          },
          {
            id: "rs-4-2",
            question: "What is the return type of a function that can fail?",
            options: ["Option<T>", "Result<T, E>", "Error<T>", "Try<T>"],
            answerIndex: 1,
            explanation: "It encodes the possibility of either a successful value or a specific error."
          },
          {
            id: "rs-4-3",
            question: "What is the shortcut operator for propagating errors?",
            options: ["!", "?", "&", "*"],
            answerIndex: 1,
            explanation: "It returns the error to the calling function immediately if it exists."
          },
          {
            id: "rs-4-4",
            question: "What happens if you call .unwrap() on a 'None' value?",
            options: ["Returns null", "Returns 0", "The program panics", "It skips the line"],
            answerIndex: 2,
            explanation: "This method is risky because it assumes the operation succeeded without checking."
          },
          {
            id: "rs-4-5",
            question: "Which method is safer than .unwrap() by providing a default?",
            options: ["unwrap_or()", "unwrap_safe()", "expect()", "get_value()"],
            answerIndex: 0,
            explanation: "It allows you to define a fallback value if the result is an error or none."
          },
          {
            id: "rs-4-6",
            question: "What is the purpose of the .expect() method?",
            options: ["To ignore errors", "To unwrap with a custom error message", "To wait for a value", "To retry a function"],
            answerIndex: 1,
            explanation: "It works like unwrap but provides better context for debugging during a panic."
          },
          {
            id: "rs-4-7",
            question: "What does 'unwinding' mean during a panic?",
            options: ["Restarting the PC", "Cleaning up memory from each function on the stack", "Looping forever", "Compiling again"],
            answerIndex: 1,
            explanation: "Rust walks back through the stack to ensure resources are properly dropped."
          },
          {
            id: "rs-4-8",
            question: "How do you define a function that never returns?",
            options: ["-> !", "-> null", "-> void", "-> exit"],
            answerIndex: 0,
            explanation: "This 'empty type' signifies that the function will always panic or exit."
          },
          {
            id: "rs-4-9",
            question: "What is 'Backtrace'?",
            options: ["A git command", "A list of all functions called leading to a panic", "A type of loop", "A memory leak"],
            answerIndex: 1,
            explanation: "It helps developers trace exactly where an error occurred in the execution flow."
          },
          {
            id: "rs-4-10",
            question: "Which trait is commonly implemented for custom error types?",
            options: ["Fail", "Error", "Panic", "Stop"],
            answerIndex: 1,
            explanation: "Standard library types expect this trait to facilitate error reporting."
          },
          {
            id: "rs-4-11",
            question: "What is the benefit of the '?' operator over a match block?",
            options: ["It is faster", "It reduces boilerplate code", "It is more secure", "It handles panics"],
            answerIndex: 1,
            explanation: "It provides a concise way to handle errors while keeping the logic readable."
          },
          {
            id: "rs-4-12",
            question: "Can 'main' return a Result?",
            options: ["No, only void", "Yes, to handle errors at the top level", "Only if it is a library", "Only in async"],
            answerIndex: 1,
            explanation: "This allows you to use the question mark operator in your primary entry point."
          },
          {
            id: "rs-4-13",
            question: "What does 'Result::is_err()' return?",
            options: ["The error message", "A boolean", "A pointer", "None"],
            answerIndex: 1,
            explanation: "It is a simple check to see if the operation failed without consuming the value."
          },
          {
            id: "rs-4-14",
            question: "What is 'Recoverable' error?",
            options: ["A hardware failure", "An error that the program can report and continue", "A syntax error", "A crash"],
            answerIndex: 1,
            explanation: "Examples include 'file not found' where the user can be prompted again."
          },
          {
            id: "rs-4-15",
            question: "How do you transform a Result<T, E> into an Option<T>?",
            options: ["result.to_option()", "result.ok()", "result.some()", "result.unwrap()"],
            answerIndex: 1,
            explanation: "This discards the error information and keeps only the success value if it exists."
          },
          {
            id: "rs-4-16",
            question: "What is the 'match' requirement for Results?",
            options: ["It must be fast", "It must be exhaustive", "It must use strings", "It must return 0"],
            answerIndex: 1,
            explanation: "The compiler forces you to handle both success and error cases."
          },
          {
            id: "rs-4-17",
            question: "What is 'Abort' as an alternative to Unwinding?",
            options: ["A slow exit", "Immediately ending the program without cleanup", "Restarting the loop", "A type of variable"],
            answerIndex: 1,
            explanation: "This produces a smaller binary size by removing cleanup code."
          },
          {
            id: "rs-4-18",
            question: "Which macro asserts that a condition is true or panics?",
            options: ["check!()", "verify!()", "assert!()", "must!()"],
            answerIndex: 2,
            explanation: "It is commonly used in testing to ensure code behaves as expected."
          },
          {
            id: "rs-4-19",
            question: "What does '.map_err()' do?",
            options: ["Deletes the error", "Changes the type or value of an error", "Prints the error", "Stops the program"],
            answerIndex: 1,
            explanation: "Useful for converting a low-level error into a high-level one."
          },
          {
            id: "rs-4-20",
            question: "Is 'null' a valid value in Rust?",
            options: ["Yes", "No", "Only for strings", "Only for integers"],
            answerIndex: 1,
            explanation: "Rust eliminates the 'null pointer' category of bugs by using the Option type instead."
          }
        ]
      },
      {
        level: 5,
        title: "Level 5: Collections & Iterators",
        description: "Managing groups of data efficiently.",
        passScore: 16,
        questions: [
          {
            id: "rs-5-1",
            question: "Which collection is a growable array stored on the heap?",
            options: ["Array", "Vector (Vec<T>)", "Map", "Set"],
            answerIndex: 1,
            explanation: "It allows you to store more than one value of the same type next to each other."
          },
          {
            id: "rs-5-2",
            question: "How do you create a new empty Vector?",
            options: ["Vec::new()", "new Vec()", "Vec[]", "vector!()"],
            answerIndex: 0,
            explanation: "Like most Rust types, it uses an associated function for construction."
          },
          {
            id: "rs-5-3",
            question: "What macro quickly initializes a Vector with values?",
            options: ["v!()", "vec!()", "list!()", "array!()"],
            answerIndex: 1,
            explanation: "Example: let v = vec![1, 2, 3];"
          },
          {
            id: "rs-5-4",
            question: "Which method adds an element to the end of a Vector?",
            options: ["add()", "append()", "push()", "insert()"],
            answerIndex: 2,
            explanation: "This is the standard name for growing a stack-like collection."
          },
          {
            id: "rs-5-5",
            question: "How do you access a Vector element safely without panicking?",
            options: ["v[i]", "v.get(i)", "v.at(i)", "v.fetch(i)"],
            answerIndex: 1,
            explanation: "This returns an Option, allowing you to handle out-of-bounds cases gracefully."
          },
          {
            id: "rs-5-6",
            question: "What is a 'HashMap'?",
            options: ["A sorted list", "A collection of key-value pairs", "A set of unique numbers", "A type of string"],
            answerIndex: 1,
            explanation: "It uses a hashing function to store data for fast lookups by key."
          },
          {
            id: "rs-5-7",
            question: "Which method is used to insert a key-value pair into a HashMap?",
            options: ["add()", "put()", "insert()", "push()"],
            answerIndex: 2,
            explanation: "If the key already exists, this will overwrite the old value."
          },
          {
            id: "rs-5-8",
            question: "What does the '.iter()' method do?",
            options: ["Deletes a collection", "Creates an immutable iterator", "Sorts a collection", "Copies a collection"],
            answerIndex: 1,
            explanation: "It allows you to process each element in a sequence without taking ownership."
          },
          {
            id: "rs-5-9",
            question: "What is 'Lazy Evaluation' in iterators?",
            options: ["Slow code", "Processing elements only when requested", "A bug", "A type of memory"],
            answerIndex: 1,
            explanation: "Iterators do nothing until you call a method that consumes them."
          },
          {
            id: "rs-5-10",
            question: "Which iterator method transforms each item into something else?",
            options: ["filter", "map", "fold", "find"],
            answerIndex: 1,
            explanation: "It takes a closure and applies it to every element in the sequence."
          },
          {
            id: "rs-5-11",
            question: "Which method turns an iterator back into a collection like a Vec?",
            options: ["to_vec()", "collect()", "build()", "finish()"],
            answerIndex: 1,
            explanation: "This is a very powerful 'consumer' method that can build many types."
          },
          {
            id: "rs-5-12",
            question: "What is the purpose of '.entry()' in a HashMap?",
            options: ["To delete a key", "To check and modify a key's value in one step", "To sort keys", "To get the size"],
            answerIndex: 1,
            explanation: "It is often paired with .or_insert() to handle missing keys efficiently."
          },
          {
            id: "rs-5-13",
            question: "Which collection stores unique values only?",
            options: ["Vec", "HashSet", "BTreeMap", "LinkedList"],
            answerIndex: 1,
            explanation: "It uses hashing to ensure no duplicates are added to the group."
          },
          {
            id: "rs-5-14",
            question: "What is '.into_iter()'?",
            options: ["An iterator that borrows", "An iterator that takes ownership of the collection", "A reverse iterator", "A fast iterator"],
            answerIndex: 1,
            explanation: "The original collection is moved and can no longer be used after this call."
          },
          {
            id: "rs-5-15",
            question: "Which method finds the first item matching a condition?",
            options: ["find", "search", "locate", "match"],
            answerIndex: 0,
            explanation: "It returns an Option containing the first element that satisfies the predicate."
          },
          {
            id: "rs-5-16",
            question: "What does '.filter()' do?",
            options: ["Changes values", "Keeps only items that satisfy a condition", "Sorts items", "Clears the list"],
            answerIndex: 1,
            explanation: "It creates a new iterator containing only the relevant elements."
          },
          {
            id: "rs-5-17",
            question: "What is the default hashing algorithm for HashMaps in Rust?",
            options: ["MD5", "SHA-256", "SipHash", "CRC32"],
            answerIndex: 2,
            explanation: "This was chosen because it provides good resistance against DoS attacks."
          },
          {
            id: "rs-5-18",
            question: "How do you remove the last element of a Vector?",
            options: ["v.remove_last()", "v.pop()", "v.delete()", "v.drop()"],
            answerIndex: 1,
            explanation: "It returns the removed item as an Option."
          },
          {
            id: "rs-5-19",
            question: "Which collection keeps keys in sorted order?",
            options: ["HashMap", "BTreeMap", "Vec", "HashSet"],
            answerIndex: 1,
            explanation: "Unlike the hash version, this maintains order based on the key's value."
          },
          {
            id: "rs-5-20",
            question: "What is 'Deref Coercion'?",
            options: ["Forcing types", "Automatically converting a type to its reference equivalent", "A memory error", "A security bypass"],
            answerIndex: 1,
            explanation: "This allows you to pass a &Vec<T> to a function expecting a &[T]."
          }
        ]
      },
      {
        level: 6,
        title: "Level 6: Generics & Traits",
        description: "Writing flexible, reusable code.",
        passScore: 16,
        questions: [
          {
            id: "rs-6-1",
            question: "What symbol defines a Generic type parameter?",
            options: ["(T)", "[T]", "<T>", "{T}"],
            answerIndex: 2,
            explanation: "This acts as a placeholder for any type provided later."
          },
          {
            id: "rs-6-2",
            question: "What is a 'Trait'?",
            options: ["A type of struct", "A definition of shared behavior", "A variable type", "A database record"],
            answerIndex: 1,
            explanation: "It tells the compiler about functionality a particular type must have."
          },
          {
            id: "rs-6-3",
            question: "How do you implement a trait 'Speak' for struct 'Dog'?",
            options: ["impl Dog for Speak", "impl Speak for Dog", "trait Dog: Speak", "struct Dog implements Speak"],
            answerIndex: 1,
            explanation: "This block contains the specific code for that type's behavior."
          },
          {
            id: "rs-6-4",
            question: "What are 'Trait Bounds'?",
            options: ["Memory limits", "Restrictions on generic types to ensure they have certain behavior", "Privacy rules", "Loop boundaries"],
            answerIndex: 1,
            explanation: "Example: <T: Display> ensures the type can be printed."
          },
          {
            id: "rs-6-5",
            question: "Which keyword is used for 'sugar' in trait bounds?",
            options: ["for", "where", "with", "as"],
            answerIndex: 1,
            explanation: "It allows you to list bounds clearly at the end of a function signature."
          },
          {
            id: "rs-6-6",
            question: "What is 'Monomorphization'?",
            options: ["A type of virus", "The process of turning generic code into specific code at compile time", "A memory leak", "A design pattern"],
            answerIndex: 1,
            explanation: "Rust creates a copy of the function for each concrete type used, making it zero-cost."
          },
          {
            id: "rs-6-7",
            question: "Which trait allows an object to be printed with '{:?}'?",
            options: ["Display", "Print", "Debug", "Show"],
            answerIndex: 2,
            explanation: "This is usually implemented automatically using the derive attribute."
          },
          {
            id: "rs-6-8",
            question: "What is the difference between 'Display' and 'Debug'?",
            options: ["Display is for users; Debug is for developers", "No difference", "Debug is faster", "Display is for numbers only"],
            answerIndex: 0,
            explanation: "One is meant to be user-friendly, the other shows technical structure."
          },
          {
            id: "rs-6-9",
            question: "What is a 'Trait Object'?",
            options: ["A static variable", "A way to use multiple types that implement a trait at runtime", "A file reader", "A type of enum"],
            answerIndex: 1,
            explanation: "It uses dynamic dispatch (dyn) to handle different types through a pointer."
          },
          {
            id: "rs-6-10",
            question: "Which keyword signifies a Trait Object?",
            options: ["static", "box", "dyn", "ref"],
            answerIndex: 2,
            explanation: "Short for 'dynamic', it indicates that method calls will be resolved at runtime."
          },
          {
            id: "rs-6-11",
            question: "What is a 'Blanket Implementation'?",
            options: ["Implementing a trait for all types that satisfy another trait", "Hiding code", "A default struct", "A global variable"],
            answerIndex: 0,
            explanation: "Example: implementing 'ToString' for any type that implements 'Display'."
          },
          {
            id: "rs-6-12",
            question: "Can traits have default method implementations?",
            options: ["No", "Yes", "Only for integers", "Only in main"],
            answerIndex: 1,
            explanation: "This allows types to inherit behavior without writing code unless they want to override it."
          },
          {
            id: "rs-6-13",
            question: "What is 'Supertrain' (Trait Inheritance)?",
            options: ["A fast train", "A trait that requires another trait to be implemented", "A global trait", "A type of macro"],
            answerIndex: 1,
            explanation: "Example: trait Circle: Shape means anything that is a Circle must also be a Shape."
          },
          {
            id: "rs-6-14",
            question: "What are 'Associated Types' in traits?",
            options: ["Static variables", "Placeholders for types used within the trait definition", "Helper functions", "Type aliases"],
            answerIndex: 1,
            explanation: "Used in the Iterator trait to define what 'Item' is being iterated over."
          },
          {
            id: "rs-6-15",
            question: "What does the 'Copy' trait signify?",
            options: ["The type can be cloned manually", "The type can be duplicated by copying bits in memory", "The type is a string", "The type is on the heap"],
            answerIndex: 1,
            explanation: "Values of these types don't 'move' when assigned to a new variable."
          },
          {
            id: "rs-6-16",
            question: "What is the 'Orphan Rule'?",
            options: ["A security rule", "A rule preventing you from implementing external traits for external types", "A memory rule", "A loop rule"],
            answerIndex: 1,
            explanation: "You can only implement a trait if either the trait or the type is local to your crate."
          },
          {
            id: "rs-6-17",
            question: "Which trait is used for operator overloading of '+'?",
            options: ["Plus", "Add", "Sum", "Combine"],
            answerIndex: 1,
            explanation: "Rust allows you to define how your custom types behave with standard math operators."
          },
          {
            id: "rs-6-18",
            question: "What is 'Static Dispatch'?",
            options: ["Resolved at runtime", "Resolved at compile time with generics", "A global variable", "A type of loop"],
            answerIndex: 1,
            explanation: "It results in faster code because the specific function call is known before the program runs."
          },
          {
            id: "rs-6-19",
            question: "What is 'Dynamic Dispatch'?",
            options: ["Resolved at compile time", "Resolved at runtime via a vtable", "A fast function", "A memory error"],
            answerIndex: 1,
            explanation: "It allows for more flexibility but has a small performance cost due to pointer hopping."
          },
          {
            id: "rs-6-20",
            question: "Which trait is used to convert a value to another type?",
            options: ["Convert", "Into", "Change", "To"],
            answerIndex: 1,
            explanation: "Paired with 'From', it provides a standard way to handle type conversions."
          }
        ]
      },
      {
        level: 7,
        title: "Level 7: Lifetimes",
        description: "Ensuring references remain valid.",
        passScore: 16,
        questions: [
          {
            id: "rs-7-1",
            question: "What is a 'Lifetime' in Rust?",
            options: ["Program duration", "Scope for which a reference is valid", "Variable size", "CPU cycle count"],
            answerIndex: 1,
            explanation: "It is a compile-time check to ensure that no reference outlives the data it points to."
          },
          {
            id: "rs-7-2",
            question: "What symbol denotes a lifetime annotation?",
            options: ["&", "'", "*", "@"],
            answerIndex: 1,
            explanation: "This tick mark precedes the name of the lifetime, like 'a."
          },
          {
            id: "rs-7-3",
            question: "What is the purpose of lifetime elision?",
            options: ["Deleting code", "Allowing the compiler to infer lifetimes in common patterns", "Speeding up execution", "Hiding variables"],
            answerIndex: 1,
            explanation: "It reduces the need for manual annotations in simple function signatures."
          },
          {
            id: "rs-7-4",
            question: "What does '&'static' represent?",
            options: ["A local reference", "A reference that lives for the entire program duration", "A private reference", "A mutable reference"],
            answerIndex: 1,
            explanation: "This is the longest possible lifetime, often used for string literals."
          },
          {
            id: "rs-7-5",
            question: "Where are lifetime parameters defined in a function?",
            options: ["In the body", "After the function name in angle brackets", "Inside the parameters", "In the return type"],
            answerIndex: 1,
            explanation: "They must be declared before they are used in the function signature."
          },
          {
            id: "rs-7-6",
            question: "What is the 'Borrow Checker'?",
            options: ["A runtime tool", "A compiler component that validates references", "A database engine", "A code formatter"],
            answerIndex: 1,
            explanation: "It is responsible for comparing scopes to prevent dangling pointers."
          },
          {
            id: "rs-7-7",
            question: "Do lifetimes change how long a value lives?",
            options: ["Yes", "No", "Only for strings", "Only in async"],
            answerIndex: 1,
            explanation: "Lifetimes only describe the relationships between references; they don't alter the actual cleanup time."
          },
          {
            id: "rs-7-8",
            question: "What are 'Generic Lifetime Bounds'?",
            options: ["Memory limits", "Ensuring one lifetime outlives another", "Privacy settings", "Loop counts"],
            answerIndex: 1,
            explanation: "Written as 'a: 'b, it means lifetime 'a must last at least as long as 'b."
          },
          {
            id: "rs-7-9",
            question: "Why does a struct need lifetime annotations?",
            options: ["To save space", "If it holds a reference as a field", "To make it public", "To implement traits"],
            answerIndex: 1,
            explanation: "The struct cannot outlive the data it is referencing."
          },
          {
            id: "rs-7-10",
            question: "What is the 'Input Lifetime'?",
            options: ["The start of main", "A lifetime assigned to function parameters", "User input", "File reading time"],
            answerIndex: 1,
            explanation: "These are lifetimes on arguments passed into a function."
          },
          {
            id: "rs-7-11",
            question: "What is the 'Output Lifetime'?",
            options: ["The end of main", "A lifetime assigned to the return value", "Console output", "Program exit"],
            answerIndex: 1,
            explanation: "It is usually tied to one of the input lifetimes."
          },
          {
            id: "rs-7-12",
            question: "Does every reference have a lifetime?",
            options: ["No", "Yes", "Only if it is mut", "Only in structs"],
            answerIndex: 1,
            explanation: "Even if not explicitly written, the compiler assigns a scope to every single reference."
          },
          {
            id: "rs-7-13",
            question: "What is 'Dangling' in the context of lifetimes?",
            options: ["A slow reference", "A reference pointing to invalid memory", "A named reference", "A global reference"],
            answerIndex: 1,
            explanation: "Lifetimes are specifically designed to prevent this class of memory error."
          },
          {
            id: "rs-7-14",
            question: "Which of these is a valid lifetime name?",
            options: ["'a", "'1", "'var", "'lifetime"],
            answerIndex: 0,
            explanation: "Conventionally, short lowercase letters are used starting with 'a."
          },
          {
            id: "rs-7-15",
            question: "What happens if lifetimes don't match in a function call?",
            options: ["The program crashes", "The code fails to compile", "It runs slowly", "It ignores the error"],
            answerIndex: 1,
            explanation: "The borrow checker will flag an error explaining that the data doesn't live long enough."
          },
          {
            id: "rs-7-16",
            question: "What is 'Re-borrowing'?",
            options: ["Taking a second loan", "Creating a new reference from an existing one", "Deleting a reference", "Moving data"],
            answerIndex: 1,
            explanation: "This allows working with a sub-scope of a currently borrowed value."
          },
          {
            id: "rs-7-17",
            question: "Can you return a reference to a literal with '&'static'?",
            options: ["No", "Yes", "Only if it is i32", "Only in main"],
            answerIndex: 1,
            explanation: "Literals are stored in the binary and are always valid."
          },
          {
            id: "rs-7-18",
            question: "What is the 'Subtyping' relationship in lifetimes?",
            options: ["Type conversion", "Longer lifetimes being valid where shorter ones are expected", "Inheritance", "Trait implementation"],
            answerIndex: 1,
            explanation: "A reference that lives 10 minutes can safely be used where a 5-minute reference is needed."
          },
          {
            id: "rs-7-19",
            question: "Are lifetimes required for owned types like String?",
            options: ["Yes", "No", "Only in loops", "Only in async"],
            answerIndex: 1,
            explanation: "Owned data manages its own memory; lifetimes only apply to pointers and references."
          },
          {
            id: "rs-7-20",
            question: "What does 'non-lexical lifetimes' (NLL) refer to?",
            options: ["Global variables", "The ability for a lifetime to end before the end of a block", "File names", "Macro expansion"],
            answerIndex: 1,
            explanation: "It made the borrow checker smarter by tracking where a variable is actually used."
          }
        ]
      },
      {
        level: 8,
        title: "Level 8: Smart Pointers",
        description: "Advanced memory management types.",
        passScore: 16,
        questions: [
          {
            id: "rs-8-1",
            question: "What is 'Box<T>' used for?",
            options: ["Stack allocation", "Heap allocation with a fixed size pointer", "Global storage", "Thread safety"],
            answerIndex: 1,
            explanation: "It is the simplest smart pointer for putting data on the heap."
          },
          {
            id: "rs-8-2",
            question: "Which smart pointer allows multiple ownership?",
            options: ["Box", "Rc", "RefCell", "Arc"],
            answerIndex: 1,
            explanation: "Short for 'Reference Counted', it tracks how many owners a piece of data has."
          },
          {
            id: "rs-8-3",
            question: "What is 'Deref' trait used for?",
            options: ["Deleting data", "Treating a smart pointer like a regular reference", "Copying data", "Printing data"],
            answerIndex: 1,
            explanation: "It allows you to use the * operator to access the inner value."
          },
          {
            id: "rs-8-4",
            question: "What is 'Drop' trait used for?",
            options: ["Adding data", "Customizing cleanup logic when a value goes out of scope", "Moving data", "Error handling"],
            answerIndex: 1,
            explanation: "You can use this to close files or release network sockets automatically."
          },
          {
            id: "rs-8-5",
            question: "Which smart pointer provides 'Interior Mutability'?",
            options: ["Rc", "Box", "RefCell", "String"],
            answerIndex: 2,
            explanation: "It allows you to mutate data even when the pointer itself is immutable."
          },
          {
            id: "rs-8-6",
            question: "What is the thread-safe version of Rc?",
            options: ["Arc", "Mutex", "Box", "Cell"],
            answerIndex: 0,
            explanation: "Short for 'Atomic Reference Counted', it can safely be shared across threads."
          },
          {
            id: "rs-8-7",
            question: "What happens to an Rc when the count reaches zero?",
            options: ["Nothing", "The data is dropped", "The program panics", "It resets to one"],
            answerIndex: 1,
            explanation: "Memory is automatically freed when no more references exist."
          },
          {
            id: "rs-8-8",
            question: "What is a 'Reference Cycle'?",
            options: ["A fast loop", "When two Rc pointers point to each other, preventing cleanup", "A memory leak", "A recursive function"],
            answerIndex: 1,
            explanation: "This can lead to memory leaks in Rust if not handled with Weak pointers."
          },
          {
            id: "rs-8-9",
            question: "Which pointer type breaks reference cycles?",
            options: ["Strong", "Weak", "Mut", "Static"],
            answerIndex: 1,
            explanation: "It provides a non-owning reference that doesn't increase the reference count."
          },
          {
            id: "rs-8-10",
            question: "What is the difference between Cell and RefCell?",
            options: ["No difference", "Cell is for Copy types; RefCell is for any type", "RefCell is faster", "Cell is thread-safe"],
            answerIndex: 1,
            explanation: "One moves values in and out, while the other uses borrow rules at runtime."
          },
          {
            id: "rs-8-11",
            question: "What does '.borrow_mut()' do in RefCell?",
            options: ["Creates an immutable reference", "Creates a mutable reference at runtime", "Deletes the value", "Locks the thread"],
            answerIndex: 1,
            explanation: "It will panic if an immutable reference is already active."
          },
          {
            id: "rs-8-12",
            question: "Which pointer is used for recursive data types like Linked Lists?",
            options: ["i32", "Box", "bool", "Vec"],
            answerIndex: 1,
            explanation: "Because the size must be known at compile time, the indirection of a pointer is required."
          },
          {
            id: "rs-8-13",
            question: "What is a 'Fat Pointer'?",
            options: ["A slow pointer", "A pointer that includes extra metadata like slice length", "A pointer to a struct", "A global pointer"],
            answerIndex: 1,
            explanation: "Rust slices and trait objects use these to track both the address and the size/vtable."
          },
          {
            id: "rs-8-14",
            question: "Can Arc be used with RefCell?",
            options: ["Yes", "No, it's not thread-safe", "Only for integers", "Only in main"],
            answerIndex: 1,
            explanation: "To mutate data inside an Arc, you must use a Mutex or RwLock."
          },
          {
            id: "rs-8-15",
            question: "What is 'Cow' (Copy-On-Write)?",
            options: ["An animal", "A smart pointer that clones only when mutation is needed", "A type of loop", "A memory error"],
            answerIndex: 1,
            explanation: "It optimizes performance by avoiding copies until the data is actually changed."
          },
          {
            id: "rs-8-16",
            question: "What is the result of 'Rc::clone(&ptr)'?",
            options: ["A deep copy of the data", "An incremented reference count", "A new heap allocation", "A move"],
            answerIndex: 1,
            explanation: "It is very cheap because it only updates a counter rather than copying the heap contents."
          },
          {
            id: "rs-8-17",
            question: "What is the 'Mutex' smart pointer?",
            options: ["A way to hide code", "A mutual exclusion lock for thread safety", "A faster box", "A type of enum"],
            answerIndex: 1,
            explanation: "It ensures that only one thread can access the data at a time."
          },
          {
            id: "rs-8-18",
            question: "What is 'Poisoning' in a Mutex?",
            options: ["Deleting data", "When a thread panics while holding the lock", "A security breach", "A memory leak"],
            answerIndex: 1,
            explanation: "Rust marks the mutex as unreliable if the owner fails unexpectedly."
          },
          {
            id: "rs-8-19",
            question: "What does '.upgrade()' do on a Weak pointer?",
            options: ["Makes it faster", "Attempts to return an Rc if the data still exists", "Deletes the data", "Changes the type"],
            answerIndex: 1,
            explanation: "It returns an Option because the data might have been dropped already."
          },
          {
            id: "rs-8-20",
            question: "Why are smart pointers called 'Smart'?",
            options: ["They can think", "They have metadata and automated behavior like cleanup", "They are faster", "They use AI"],
            answerIndex: 1,
            explanation: "Unlike raw pointers, they manage memory and resources safely via traits."
          }
        ]
      },
      {
        level: 9,
        title: "Level 9: Fearless Concurrency",
        description: "Threads, Send, and Sync.",
        passScore: 16,
        questions: [
          {
            id: "rs-9-1",
            question: "Which function spawns a new thread?",
            options: ["thread::new()", "thread::spawn()", "thread::start()", "thread::run()"],
            answerIndex: 1,
            explanation: "It takes a closure containing the code to run in parallel."
          },
          {
            id: "rs-9-2",
            question: "What does '.join()' do on a thread handle?",
            options: ["Deletes the thread", "Waits for the thread to finish", "Kills the thread", "Restarts the thread"],
            answerIndex: 1,
            explanation: "It blocks the current thread until the spawned thread completes its execution."
          },
          {
            id: "rs-9-3",
            question: "What is a 'Message Passing' tool in Rust?",
            options: ["Mutex", "Channel", "Arc", "Box"],
            answerIndex: 1,
            explanation: "It uses a sender and a receiver to move data between threads safely."
          },
          {
            id: "rs-9-4",
            question: "What does 'mpsc' stand for?",
            options: ["Multiple Producer, Single Consumer", "Main Program, Sub Code", "Memory Point, Stack Code", "Multi-Pass Simple Compiler"],
            answerIndex: 0,
            explanation: "It describes the structure of Rust's standard library channels."
          },
          {
            id: "rs-9-5",
            question: "Which trait allows a type to be transferred between threads?",
            options: ["Sync", "Send", "Move", "Share"],
            answerIndex: 1,
            explanation: "Most types are 'Send', meaning ownership can be passed to another thread."
          },
          {
            id: "rs-9-6",
            question: "Which trait allows a type to be accessed by multiple threads simultaneously?",
            options: ["Send", "Sync", "Share", "Arc"],
            answerIndex: 1,
            explanation: "A type is 'Sync' if its reference (&T) is 'Send'."
          },
          {
            id: "rs-9-7",
            question: "Is 'Rc' thread-safe?",
            options: ["Yes", "No", "Only for strings", "Only in main"],
            answerIndex: 1,
            explanation: "It lacks atomic operations for its counter, so it cannot be used across threads."
          },
          {
            id: "rs-9-8",
            question: "What keyword is often required when passing variables to a thread closure?",
            options: ["mut", "move", "ref", "static"],
            answerIndex: 1,
            explanation: "This forces the closure to take ownership of the variables it uses."
          },
          {
            id: "rs-9-9",
            question: "What is a 'Data Race'?",
            options: ["A fast algorithm", "Multiple threads accessing the same data where one is writing", "A sorting method", "A networking error"],
            answerIndex: 1,
            explanation: "Rust's borrow checker prevents this at compile time, unlike most other languages."
          },
          {
            id: "rs-9-10",
            question: "What is a 'Deadlock'?",
            options: ["A finished program", "When two threads are waiting for each other to release locks", "A crash", "A memory leak"],
            answerIndex: 1,
            explanation: "While Rust prevents data races, it cannot entirely prevent logic errors like deadlocks."
          },
          {
            id: "rs-9-11",
            question: "What is a 'RwLock'?",
            options: ["A read-write lock", "A recursive lock", "A file lock", "A memory lock"],
            answerIndex: 0,
            explanation: "It allows many readers OR one writer, offering better performance than a Mutex in some cases."
          },
          {
            id: "rs-9-12",
            question: "What does '.lock().unwrap()' do?",
            options: ["Deletes a lock", "Acquires a mutex and handles potential poisoning", "Creates a new lock", "Releases a lock"],
            answerIndex: 1,
            explanation: "It is the standard pattern for accessing protected data in a thread-safe way."
          },
          {
            id: "rs-9-13",
            question: "Are integers 'Send' and 'Sync'?",
            options: ["No", "Yes", "Only if mut", "Only in loops"],
            answerIndex: 1,
            explanation: "Primitive types are inherently safe to move and share because they don't involve complex pointers."
          },
          {
            id: "rs-9-14",
            question: "What is an 'Atomic' type?",
            options: ["A small type", "A type that can be modified safely without a mutex", "A radioactive type", "A fast type"],
            answerIndex: 1,
            explanation: "They use special CPU instructions to perform thread-safe operations."
          },
          {
            id: "rs-9-15",
            question: "What is the 'Main Thread'?",
            options: ["The only thread", "The thread that runs the main function", "A background thread", "The UI thread"],
            answerIndex: 1,
            explanation: "When the main thread finishes, the entire program exits, even if background threads are still running."
          },
          {
            id: "rs-9-16",
            question: "Can you send a 'RefCell' to another thread?",
            options: ["Yes", "No", "Only if it is empty", "Only for numbers"],
            answerIndex: 1,
            explanation: "It does not implement Sync and is intended for single-threaded interior mutability."
          },
          {
            id: "rs-9-17",
            question: "What is 'Shared-State' concurrency?",
            options: ["Using messages", "Multiple threads accessing the same memory via locks", "A global variable", "A type of array"],
            answerIndex: 1,
            explanation: "This usually involves Arc and Mutex to coordinate access."
          },
          {
            id: "rs-9-18",
            question: "What is the 'Rayon' crate commonly used for?",
            options: ["Graphics", "Data-parallelism and easy multi-threading", "Networking", "Database access"],
            answerIndex: 1,
            explanation: "It provides 'parallel iterators' that make it trivial to use all CPU cores."
          },
          {
            id: "rs-9-19",
            question: "What is a 'Thread Pool'?",
            options: ["A group of pre-spawned threads", "A memory segment", "A type of vector", "A debugging tool"],
            answerIndex: 0,
            explanation: "It avoids the overhead of creating and destroying threads for every small task."
          },
          {
            id: "rs-9-20",
            question: "Why is Rust's concurrency called 'Fearless'?",
            options: ["It is brave", "The compiler catches most threading bugs before the program runs", "It is very fast", "It uses simple syntax"],
            answerIndex: 1,
            explanation: "By combining ownership rules with Send/Sync traits, the compiler guarantees memory safety."
          }
        ]
      },
      {
        level: 10,
        title: "Level 10: Unsafe & Meta-Programming",
        description: "Bypassing the compiler's safety and writing macros.",
        passScore: 16,
        questions: [
          {
            id: "rs-10-1",
            question: "Which keyword allows you to bypass the borrow checker?",
            options: ["unsafe", "bypass", "raw", "force"],
            answerIndex: 0,
            explanation: "This creates a block where you can perform actions the compiler cannot guarantee are safe."
          },
          {
            id: "rs-10-2",
            question: "What is a 'Raw Pointer'?",
            options: ["A smart pointer", "A pointer that doesn't follow ownership rules", "A string index", "A faster reference"],
            answerIndex: 1,
            explanation: "Represented as *const T or *mut T, these can be null or dangling."
          },
          {
            id: "rs-10-3",
            question: "What is 'Dereferencing' a raw pointer require?",
            options: ["A match block", "An unsafe block", "A loop", "A trait"],
            answerIndex: 1,
            explanation: "Reading the value at the address of a raw pointer is a potentially dangerous operation."
          },
          {
            id: "rs-10-4",
            question: "What is a 'Declarative Macro'?",
            options: ["A function", "A macro defined with macro_rules!", "A compiler plugin", "An attribute"],
            answerIndex: 1,
            explanation: "These allow for pattern-matching code generation, similar to a 'match' for syntax."
          },
          {
            id: "rs-10-5",
            question: "What does the '#' symbol signify in a macro?",
            options: ["A comment", "An attribute or procedural macro entry", "A variable", "A loop"],
            answerIndex: 1,
            explanation: "It is used for things like #[derive] or custom procedural macros."
          },
          {
            id: "rs-10-6",
            question: "What is an 'FFI'?",
            options: ["Fast File Interface", "Foreign Function Interface", "Final Function Item", "Fixed Frame Index"],
            answerIndex: 1,
            explanation: "This allows Rust to call functions written in other languages, like C."
          },
          {
            id: "rs-10-7",
            question: "Which keyword declares an external block for FFI?",
            options: ["extern", "foreign", "import", "link"],
            answerIndex: 0,
            explanation: "It specifies the ABI (Application Binary Interface) used by the external code."
          },
          {
            id: "rs-10-8",
            question: "What is a 'Procedural Macro'?",
            options: ["A simple text swap", "A macro that acts like a function on code streams", "A regex tool", "A documentation generator"],
            answerIndex: 1,
            explanation: "These are more powerful than declarative macros and can manipulate the Abstract Syntax Tree (AST)."
          },
          {
            id: "rs-10-9",
            question: "What is 'Static Mut'?",
            options: ["A normal variable", "A global mutable variable", "A constant", "A thread-local"],
            answerIndex: 1,
            explanation: "Accessing or modifying these is always unsafe because they are accessible by all threads."
          },
          {
            id: "rs-10-10",
            question: "What is a 'Union' in Rust?",
            options: ["A type of join", "A type where all fields share the same memory", "A trait group", "A collection"],
            answerIndex: 1,
            explanation: "Commonly used for C compatibility; reading union fields is unsafe."
          },
          {
            id: "rs-10-11",
            question: "What does 'TokenStream' represent?",
            options: ["A list of strings", "The input/output of a procedural macro", "A network buffer", "A security token"],
            answerIndex: 1,
            explanation: "It is a sequence of tokens that the compiler parses into code."
          },
          {
            id: "rs-10-12",
            question: "What is 'Internal Mutability' in Unsafe?",
            options: ["Changing private fields", "Modifying data through an immutable pointer", "Deleting data", "Using loops"],
            answerIndex: 1,
            explanation: "This is the core concept behind types like RefCell and Mutex."
          },
          {
            id: "rs-10-13",
            question: "What does the 'inline' attribute do?",
            options: ["Makes code pretty", "Suggests the compiler replace function calls with the actual code", "Hides code", "Saves memory"],
            answerIndex: 1,
            explanation: "This can improve performance for small, frequently-called functions."
          },
          {
            id: "rs-10-14",
            question: "What is a 'Discriminant' in Enums?",
            options: ["A filter", "The integer value that identifies an enum variant", "A privacy setting", "A type of trait"],
            answerIndex: 1,
            explanation: "In unsafe code, you might manually read this to determine which variant is active."
          },
          {
            id: "rs-10-15",
            question: "What is the 'no_std' attribute used for?",
            options: ["Speed", "Embedded or OS development without the standard library", "Security", "Formatting"],
            answerIndex: 1,
            explanation: "It removes the dependency on an operating system, using only the 'core' library."
          },
          {
            id: "rs-10-16",
            question: "What is 'Undefined Behavior' (UB)?",
            options: ["A syntax error", "Actions that violate the language's safety rules", "A slow loop", "A missing file"],
            answerIndex: 1,
            explanation: "In unsafe blocks, the developer is responsible for preventing UB."
          },
          {
            id: "rs-10-17",
            question: "Which macro is used to check for overflows in math?",
            options: ["overflow!()", "checked_add()", "safe_math!()", "math_verify!()"],
            answerIndex: 1,
            explanation: "These methods return an Option to handle numeric limits safely."
          },
          {
            id: "rs-10-18",
            question: "What is 'PhantomData'?",
            options: ["Unused memory", "A zero-sized marker to tell the compiler about relationships", "A ghost variable", "A type of pointer"],
            answerIndex: 1,
            explanation: "Used to simulate a field that 'owns' a type without actually storing it."
          },
          {
            id: "rs-10-19",
            question: "What does '#[must_use]' do?",
            options: ["Requires a variable", "Issues a warning if the return value is ignored", "Forces a compile", "Enables a feature"],
            answerIndex: 1,
            explanation: "Commonly used on Results so developers don't forget to handle errors."
          },
          {
            id: "rs-10-20",
            question: "What is the 'Safe Wrapper' pattern?",
            options: ["Wrapping code in a folder", "Encapsulating unsafe code within a safe public API", "A security tool", "A type of struct"],
            answerIndex: 1,
            explanation: "This is how the Rust standard library provides safe tools like Vectors and Strings."
          }
        ]
      }
    ]
  };