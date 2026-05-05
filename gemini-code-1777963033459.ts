import { TopicData } from "./types";

export const databaseMasteryData: TopicData = {
  slug: "database-mastery",
  title: "The Data Architect: Mastery Track",
  intro: "A comprehensive 12-level journey from basic SQL to distributed systems, high availability, and NewSQL architectures.",  levels: [
    {
      level: 1,
      title: "Level 1: Core Fundamentals",
      description: "Basic terminology, CRUD, and the role of a DBMS.",
      passScore: 16,
      questions: [
        {
          id: "db-1-1",
          question: "What does the 'C' in CRUD stand for?",
          options: ["Commit", "Change", "Create", "Calculate"],
          answerIndex: 2,
          explanation: "This is the initial phase of the data lifecycle where a new record is introduced into the system."
        },
        {
          id: "db-1-2",
          question: "Which component is responsible for interacting with the file system?",
          options: ["Query Processor", "Storage Manager", "Buffer Manager", "Transaction Manager"],
          answerIndex: 1,
          explanation: "The Storage Manager translates high-level commands into physical data storage actions on the disk."
        },
        {
          id: "db-1-3",
          question: "What is 'Metadata' often described as?",
          options: ["Big data", "Encrypted data", "Data about data", "Deleted data"],
          answerIndex: 2,
          explanation: "Metadata is the structural information that defines tables, columns, and constraints."
        },
        {
          id: "db-1-4",
          question: "What is a 'Primary Key'?",
          options: ["A password", "A unique identifier", "A hidden column", "A backup key"],
          answerIndex: 1,
          explanation: "A Primary Key ensures that each specific row in a table can be uniquely identified."
        },
        {
          id: "db-1-5",
          question: "Which of these is a 'Data Definition Language' (DDL) command?",
          options: ["SELECT", "INSERT", "CREATE", "UPDATE"],
          answerIndex: 2,
          explanation: "DDL commands like CREATE, ALTER, and DROP modify the structure of the database."
        },
        {
          id: "db-1-6",
          question: "What is a 'Database Schema'?",
          options: ["The actual data", "The logical design", "A backup file", "A user list"],
          answerIndex: 1,
          explanation: "The schema is the 'blueprint' or skeleton that represents the logical view of the entire database."
        },
        {
          id: "db-1-7",
          question: "Which of these is a 'Data Manipulation Language' (DML) command?",
          options: ["DROP", "GRANT", "INSERT", "TRUNCATE"],
          answerIndex: 2,
          explanation: "DML commands are used for managing data within the schema objects, like adding or deleting rows."
        },
        {
          id: "db-1-8",
          question: "What does 'Instance' refer to in DBMS?",
          options: ["A copy of the code", "Data at a specific moment", "The server hardware", "A database error"],
          answerIndex: 1,
          explanation: "While the schema is the design, the instance is the actual data stored at a specific point in time."
        },
        {
          id: "db-1-9",
          question: "Which level of data abstraction describes 'how' the data is actually stored?",
          options: ["Physical Level", "Logical Level", "View Level", "User Level"],
          answerIndex: 0,
          explanation: "The physical level is the lowest level of abstraction that describes complex low-level data structures."
        },
        {
          id: "db-1-10",
          question: "What is a 'Tuple' in the relational model?",
          options: ["A table", "A column", "A row", "A relationship"],
          answerIndex: 2,
          explanation: "In relational database theory, a row is formally referred to as a tuple."
        },
        {
          id: "db-1-11",
          question: "What is the 'Domain' of an attribute?",
          options: ["The table name", "Permitted values", "The primary key", "The owner"],
          answerIndex: 1,
          explanation: "A domain is a set of atomic values that an attribute can legitimately take (e.g., integers, strings)."
        },
        {
          id: "db-1-12",
          question: "What is 'Data Independence'?",
          options: ["Data without users", "Changing schema without apps", "Offline database", "Deleting data"],
          answerIndex: 1,
          explanation: "It allows you to modify the database schema at one level without affecting the schema at a higher level."
        },
        {
          id: "db-1-13",
          question: "Which of these is NOT a type of DBMS?",
          options: ["Relational", "Hierarchical", "Network", "Sequential"],
          answerIndex: 3,
          explanation: "Relational, Hierarchical, and Network are classic models; Sequential is not a standard DBMS model."
        },
        {
          id: "db-1-14",
          question: "What does 'SQL' stand for?",
          options: ["Simple Query Language", "Structured Query Language", "Server Query List", "Standard Query Logic"],
          answerIndex: 1,
          explanation: "SQL is the standard language used to communicate with relational database management systems."
        },
        {
          id: "db-1-15",
          question: "What is the purpose of the 'Buffer Manager'?",
          options: ["Encryption", "Cache management", "Sorting", "Networking"],
          answerIndex: 1,
          explanation: "It manages the transfer of data between disk storage and main memory (RAM)."
        },
        {
          id: "db-1-16",
          question: "What is an 'Attribute' in a database?",
          options: ["A row", "A column", "A table", "A constraint"],
          answerIndex: 1,
          explanation: "An attribute represents a property or characteristic of an entity, visualized as a column."
        },
        {
          id: "db-1-17",
          question: "What is a 'Composite Key'?",
          options: ["A hidden key", "Multiple columns as a key", "A key for two tables", "An encrypted key"],
          answerIndex: 1,
          explanation: "A composite key is a primary key that consists of more than one column to ensure uniqueness."
        },
        {
          id: "db-1-18",
          question: "What is 'Redundancy'?",
          options: ["Safe backups", "Unnecessary duplication", "Data compression", "Faster queries"],
          answerIndex: 1,
          explanation: "Redundancy occurs when the same piece of data is stored in two or more separate places unnecessarily."
        },
        {
          id: "db-1-19",
          question: "Which part of DBMS ensures the database remains in a consistent state?",
          options: ["Transaction Manager", "DML Compiler", "File Manager", "Admin Tool"],
          answerIndex: 0,
          explanation: "The Transaction Manager ensures that the database remains consistent despite system failures."
        },
        {
          id: "db-1-20",
          question: "What is a 'Database Administrator' (DBA)?",
          options: ["A software tool", "The person managing the DB", "A type of table", "The database server"],
          answerIndex: 1,
          explanation: "The DBA is the person responsible for the design, implementation, maintenance, and repair of a database."
        }
      ]
    },
    {
      level: 2,
      title: "Level 2: The Relational Model (SQL)",
      description: "Joins, Aggregations, and Advanced Querying.",
      passScore: 16,
      questions: [
        {
          id: "db-2-1",
          question: "Which JOIN returns all rows from the left table and matched rows from the right?",
          options: ["INNER JOIN", "FULL JOIN", "LEFT JOIN", "CROSS JOIN"],
          answerIndex: 2,
          explanation: "A LEFT JOIN ensures all records from the 'left' table are kept, filling 'null' for missing right-side matches."
        },
        {
          id: "db-2-2",
          question: "What does the 'GROUP BY' clause do?",
          options: ["Sorts data", "Aggregates rows", "Filters columns", "Deletes duplicates"],
          answerIndex: 1,
          explanation: "GROUP BY collapses multiple rows into summary rows, usually to work with functions like COUNT or SUM."
        },
        {
          id: "db-2-3",
          question: "What is the purpose of a 'Foreign Key'?",
          options: ["User authentication", "Table relationships", "Faster searching", "Encryption"],
          answerIndex: 1,
          explanation: "A foreign key in one table points to a primary key in another, creating a relational link."
        },
        {
          id: "db-2-4",
          question: "Which SQL keyword is used to sort the result-set?",
          options: ["SORT BY", "ORDER BY", "GROUP BY", "ARRANGE"],
          answerIndex: 1,
          explanation: "ORDER BY is used to sort results in ascending (ASC) or descending (DESC) order."
        },
        {
          id: "db-2-5",
          question: "What is the difference between WHERE and HAVING?",
          options: ["No difference", "HAVING is for groups", "WHERE is faster", "HAVING is for columns"],
          answerIndex: 1,
          explanation: "WHERE filters rows before aggregation; HAVING filters groups after the GROUP BY clause."
        },
        {
          id: "db-2-6",
          question: "What does a 'CROSS JOIN' produce?",
          options: ["Only matches", "A Cartesian Product", "No results", "Merged columns"],
          answerIndex: 1,
          explanation: "A CROSS JOIN returns every possible combination of rows from the two joined tables."
        },
        {
          id: "db-2-7",
          question: "Which aggregate function ignores NULL values?",
          options: ["SUM", "COUNT(*)", "COUNT(column)", "Both SUM and COUNT(column)"],
          answerIndex: 3,
          explanation: "Most aggregate functions (SUM, AVG, COUNT(col)) ignore NULLs; however, COUNT(*) counts everything."
        },
        {
          id: "db-2-8",
          question: "What is a 'Subquery'?",
          options: ["A small table", "A query inside a query", "A deleted query", "A fast query"],
          answerIndex: 1,
          explanation: "A subquery is a SQL query nested inside a larger query, such as in a SELECT or WHERE clause."
        },
        {
          id: "db-2-9",
          question: "Which operator is used to search for a specified pattern in a column?",
          options: ["GET", "LIKE", "MATCH", "SEARCH"],
          answerIndex: 1,
          explanation: "The LIKE operator is used with wildcards (% and _) to perform pattern matching."
        },
        {
          id: "db-2-10",
          question: "What does 'UNION' do in SQL?",
          options: ["Joins tables horizontally", "Combines result sets vertically", "Multiplies data", "Filters duplicates only"],
          answerIndex: 1,
          explanation: "UNION combines the result of two SELECT statements into one, removing duplicates by default."
        },
        {
          id: "db-2-11",
          question: "What is the 'Self Join' used for?",
          options: ["Joining two databases", "Joining a table to itself", "Checking for errors", "Joining odd/even rows"],
          answerIndex: 1,
          explanation: "A self join is useful for querying hierarchical data within a single table, like employees and their managers."
        },
        {
          id: "db-2-12",
          question: "Which command removes all records from a table without deleting the table structure?",
          options: ["DELETE", "REMOVE", "TRUNCATE", "DROP"],
          answerIndex: 2,
          explanation: "TRUNCATE is a DDL command that quickly removes all rows and is usually faster than DELETE."
        },
        {
          id: "db-2-13",
          question: "What is a 'View' in a database?",
          options: ["A screenshot", "A virtual table", "A physical file", "A backup"],
          answerIndex: 1,
          explanation: "A view is a stored query that behaves like a table but doesn't store data physically."
        },
        {
          id: "db-2-14",
          question: "What is the purpose of the 'DISTINCT' keyword?",
          options: ["To find errors", "To return unique values", "To sort data", "To hide columns"],
          answerIndex: 1,
          explanation: "DISTINCT is used to eliminate duplicate rows from the results of a SELECT query."
        },
        {
          id: "db-2-15",
          question: "What is 'Referential Integrity'?",
          options: ["Fast data access", "Valid foreign key links", "Encryption standards", "User permissions"],
          answerIndex: 1,
          explanation: "It ensures that relationships between tables remain consistent and that foreign keys always point to valid primary keys."
        },
        {
          id: "db-2-16",
          question: "Which join returns all rows when there is a match in one of the tables?",
          options: ["LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "INNER JOIN"],
          answerIndex: 2,
          explanation: "FULL OUTER JOIN returns all records when there is a match in either left or right table records."
        },
        {
          id: "db-2-17",
          question: "What does the 'IN' operator allow you to do?",
          options: ["Input data", "Specify multiple values in WHERE", "Create a table", "Check for nulls"],
          answerIndex: 1,
          explanation: "The IN operator is shorthand for multiple OR conditions in a WHERE clause."
        },
        {
          id: "db-2-18",
          question: "What is a 'Correlated Subquery'?",
          options: ["A faster subquery", "Subquery using outer query values", "A double subquery", "A static subquery"],
          answerIndex: 1,
          explanation: "A correlated subquery is evaluated once for each row processed by the outer query."
        },
        {
          id: "db-2-19",
          question: "Which SQL command is used to change data inside a table?",
          options: ["CHANGE", "MODIFY", "UPDATE", "ALTER"],
          answerIndex: 2,
          explanation: "The UPDATE statement is used to modify the existing records in a table."
        },
        {
          id: "db-2-20",
          question: "What is an 'Alias' in SQL?",
          options: ["A secret password", "A temporary name for a table/col", "A backup database", "A type of join"],
          answerIndex: 1,
          explanation: "Aliases (AS keyword) are used to give a table or a column a temporary, more readable name."
        }
      ]
    },{
      level: 3,
      title: "Level 3: Normalization & Schema Design",
      description: "Eliminating redundancy through 1NF, 2NF, 3NF, and BCNF.",
      passScore: 16,
      questions: [
        {
          id: "db-3-1",
          question: "What is the primary goal of Database Normalization?",
          options: ["Increasing storage size", "Eliminating data redundancy", "Reducing the number of tables", "Automating backups"],
          answerIndex: 1,
          explanation: "Normalization organizes data to ensure each piece of information is stored only once, preventing update anomalies."
        },
        {
          id: "db-3-2",
          question: "What requirement must be met for a table to be in First Normal Form (1NF)?",
          options: ["No partial dependencies", "No transitive dependencies", "Atomic values in columns", "A foreign key must exist"],
          answerIndex: 2,
          explanation: "1NF requires that each column contains only atomic (indivisible) values and there are no repeating groups."
        },
        {
          id: "db-3-3",
          question: "A table is in 2NF if it is in 1NF and has no ______?",
          options: ["Partial functional dependencies", "Transitive dependencies", "Composite keys", "Duplicate rows"],
          answerIndex: 0,
          explanation: "Second Normal Form requires that all non-key attributes are fully functional dependent on the entire primary key."
        },
        {
          id: "db-3-4",
          question: "What defines Third Normal Form (3NF)?",
          options: ["No multi-valued attributes", "No transitive dependencies", "Presence of a unique index", "Use of B-Trees"],
          answerIndex: 1,
          explanation: "3NF ensures that non-key attributes do not depend on other non-key attributes; they must depend only on the primary key."
        },
        {
          id: "db-3-5",
          question: "What is Boyce-Codd Normal Form (BCNF)?",
          options: ["A weaker version of 3NF", "A stronger version of 3NF", "The same as 2NF", "A NoSQL standard"],
          answerIndex: 1,
          explanation: "BCNF is a stricter version of 3NF that handles cases where a table has multiple overlapping candidate keys."
        },
        {
          id: "db-3-6",
          question: "What is an 'Update Anomaly'?",
          options: ["A bug in the SQL editor", "Inconsistent data after a partial update", "Slow query performance", "A lost connection"],
          answerIndex: 1,
          explanation: "This happens when data is redundant, and updating one instance leaves others with old, incorrect information."
        },
        {
          id: "db-3-7",
          question: "What is a 'Transitive Dependency'?",
          options: ["A depends on B, B depends on C", "A depends on A", "A depends on a Foreign Key", "A is null"],
          answerIndex: 0,
          explanation: "It occurs when a non-key attribute depends on another non-key attribute rather than the primary key directly."
        },
        {
          id: "db-3-8",
          question: "What does 'Denormalization' involve?",
          options: ["Adding more constraints", "Intentionally introducing redundancy", "Deleting all indexes", "Converting SQL to NoSQL"],
          answerIndex: 1,
          explanation: "Sometimes used in read-heavy systems to improve performance by reducing the number of complex joins."
        },
        {
          id: "db-3-9",
          question: "Which Normal Form deals specifically with Multi-valued Dependencies?",
          options: ["2NF", "3NF", "4NF", "5NF"],
          answerIndex: 2,
          explanation: "Fourth Normal Form (4NF) addresses issues where a single table contains two or more independent multi-valued facts."
        },
        {
          id: "db-3-10",
          question: "In 1NF, what is a 'Repeating Group'?",
          options: ["Multiple rows with same ID", "Columns storing lists of values", "Multiple primary keys", "A recursive relationship"],
          answerIndex: 1,
          explanation: "Storing comma-separated values or multiple similar columns (e.g., Phone1, Phone2) violates 1NF."
        },
        {
          id: "db-3-11",
          question: "What is a 'Candidate Key'?",
          options: ["A key waiting for approval", "A minimal set of attributes for uniqueness", "The last column in a table", "A key used for encryption"],
          answerIndex: 1,
          explanation: "A candidate key is any column or set of columns that could qualify as a primary key."
        },
        {
          id: "db-3-12",
          question: "What is 'Lossless Join Decomposition'?",
          options: ["Merging two tables", "Splitting tables without losing data", "Deleting old rows", "Adding null values"],
          answerIndex: 1,
          explanation: "A property of normalization that ensures a table can be reconstructed perfectly by joining the sub-tables."
        },
        {
          id: "db-3-13",
          question: "What is a 'Functional Dependency' denoted as A -> B?",
          options: ["A equals B", "A determines B", "B determines A", "A is a subset of B"],
          answerIndex: 1,
          explanation: "It means for a given value of A, there is exactly one value of B associated with it."
        },
        {
          id: "db-3-14",
          question: "Which of these is a result of poor database design?",
          options: ["Data Integrity", "Insertion Anomaly", "Fast Queries", "Small storage footprint"],
          answerIndex: 1,
          explanation: "An insertion anomaly occurs when you cannot insert data because some other data is missing (e.g., can't add a course without a student)."
        },
        {
          id: "db-3-15",
          question: "What does 'Dependency Preservation' mean?",
          options: ["Keeping old backups", "Maintaining constraints after decomposition", "Never deleting keys", "Using only strings"],
          answerIndex: 1,
          explanation: "It is the ability to check all functional dependencies by looking at individual tables without joining them."
        },
        {
          id: "db-3-16",
          question: "What is 5NF also known as?",
          options: ["BCNF", "Project-Join Normal Form", "Multi-valued Form", "Simple Form"],
          answerIndex: 1,
          explanation: "Fifth Normal Form deals with cases where a table can be decomposed but not into two; it requires three or more tables."
        },
        {
          id: "db-3-17",
          question: "What is a 'Surrogate Key'?",
          options: ["A key from a different DB", "An artificial, system-generated key", "A key that changes daily", "A key used for guests"],
          answerIndex: 1,
          explanation: "A surrogate key (like an Auto-Increment ID) has no business meaning and is used solely for row identification."
        },
        {
          id: "db-3-18",
          question: "Which Normal Form is usually considered sufficient for most business applications?",
          options: ["1NF", "2NF", "3NF", "5NF"],
          answerIndex: 2,
          explanation: "3NF strikes the best balance between performance and data integrity for most transactional systems."
        },
        {
          id: "db-3-19",
          question: "What happens in a 'Deletion Anomaly'?",
          options: ["The whole DB is deleted", "Unintended loss of data", "An error message appears", "The disk becomes full"],
          answerIndex: 1,
          explanation: "Deleting one piece of info results in the loss of unrelated information (e.g., deleting a student also deletes the only record of a teacher)."
        },
        {
          id: "db-3-20",
          question: "What is an 'Atomic Value'?",
          options: ["A very small number", "A value that cannot be further divided", "A value used in encryption", "A binary 0 or 1"],
          answerIndex: 1,
          explanation: "Atomicity in 1NF means a single cell in a table should contain only one piece of information."
        }
      ]
    },
    {
      level: 4,
      title: "Level 4: Transaction Management (ACID)",
      description: "Deep dive into Atomicity, Consistency, Isolation, and Durability.",
      passScore: 16,
      questions: [
        {
          id: "db-4-1",
          question: "What does 'Atomicity' guarantee in a transaction?",
          options: ["Smallest data units", "All-or-nothing execution", "Fast data transfer", "One user at a time"],
          answerIndex: 1,
          explanation: "Atomicity ensures that if any part of a transaction fails, the entire transaction is rolled back."
        },
        {
          id: "db-4-2",
          question: "Which property ensures a transaction takes the DB from one valid state to another?",
          options: ["Atomicity", "Consistency", "Isolation", "Durability"],
          answerIndex: 1,
          explanation: "Consistency ensures that all data follows defined rules, such as constraints and triggers, during the process."
        },
        {
          id: "db-4-3",
          question: "What does 'Isolation' prevent?",
          options: ["Data loss on crash", "Concurrent transactions interfering", "System slowness", "Unauthorized access"],
          answerIndex: 1,
          explanation: "Isolation ensures that the intermediate state of a transaction is invisible to other concurrent transactions."
        },
        {
          id: "db-4-4",
          question: "What is 'Durability' in ACID?",
          options: ["Hardware strength", "Persistence after a crash", "Long table names", "Frequent backups"],
          answerIndex: 1,
          explanation: "Durability guarantees that once a transaction is committed, it survives even in the event of a system failure."
        },
        {
          id: "db-4-5",
          question: "What is a 'Dirty Read'?",
          options: ["Reading deleted data", "Reading uncommitted changes", "Reading old backups", "Reading encrypted text"],
          answerIndex: 1,
          explanation: "A dirty read occurs when a transaction reads data that has been modified by another transaction but not yet committed."
        },
        {
          id: "db-4-6",
          question: "Which Isolation Level is the strictest?",
          options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
          answerIndex: 3,
          explanation: "Serializable isolation level treats transactions as if they were running one after the other, preventing all anomalies."
        },
        {
          id: "db-4-7",
          question: "What is a 'Phantom Read'?",
          options: ["Missing a row", "New rows appearing in a range", "Data disappearing", "Reading the wrong table"],
          answerIndex: 1,
          explanation: "This happens when a transaction re-runs a query and finds new rows that were added by another transaction in the meantime."
        },
        {
          id: "db-4-8",
          question: "What is a 'Deadlock'?",
          options: ["A deleted database", "Two transactions waiting for each other", "A very fast query", "An expired password"],
          answerIndex: 1,
          explanation: "A deadlock occurs when two or more transactions are stuck waiting for locks held by the other, preventing progress."
        },
        {
          id: "db-4-9",
          question: "What is 'WAL' (Write-Ahead Logging)?",
          options: ["Logging before writing data", "A speed test", "A network protocol", "An encryption key"],
          answerIndex: 0,
          explanation: "WAL ensures durability by writing changes to a log file before applying them to the actual data pages."
        },
        {
          id: "db-4-10",
          question: "What does 'COMMIT' do?",
          options: ["Saves changes permanently", "Deletes a transaction", "Starts a new session", "Backs up the DB"],
          answerIndex: 0,
          explanation: "COMMIT makes all changes made in the current transaction permanent and visible to others."
        },
        {
          id: "db-4-11",
          question: "What is 'Two-Phase Locking' (2PL)?",
          options: ["Using two passwords", "A growing and shrinking phase", "Locking two tables", "A backup strategy"],
          answerIndex: 1,
          explanation: "2PL is a concurrency control method that ensures serializability by having a phase where locks are acquired and one where they are released."
        },
        {
          id: "db-4-12",
          question: "What is the purpose of a 'Checkpoint'?",
          options: ["Measuring speed", "Syncing memory to disk", "User login", "Table creation"],
          answerIndex: 1,
          explanation: "Checkpoints reduce recovery time by ensuring that all changes up to a certain point are flushed to the physical disk."
        },
        {
          id: "db-4-13",
          question: "What is a 'Non-Repeatable Read'?",
          options: ["Data changes between two reads", "A row is deleted", "The query fails", "Reading from a view"],
          answerIndex: 0,
          explanation: "This happens when a transaction reads the same row twice but gets different data because another transaction updated it."
        },
        {
          id: "db-4-14",
          question: "What does 'ROLLBACK' do?",
          options: ["Updates all rows", "Undoes uncommitted changes", "Deletes the schema", "Reboots the server"],
          answerIndex: 1,
          explanation: "ROLLBACK reverts the database to its previous state before the start of the current transaction."
        },
        {
          id: "db-4-15",
          question: "What is 'Strict 2PL'?",
          options: ["Locks are never released", "Write locks held until commit", "No read locks", "Only one user allowed"],
          answerIndex: 1,
          explanation: "Strict 2PL prevents cascading rollbacks by holding all exclusive (write) locks until the transaction ends."
        },
        {
          id: "db-4-16",
          question: "What is 'Cascading Rollback'?",
          options: ["A fast error", "Rolling back multiple transactions", "Deleting multiple tables", "A backup loop"],
          answerIndex: 1,
          explanation: "It occurs when the failure of one transaction leads to the rollback of several dependent transactions."
        },
        {
          id: "db-4-17",
          question: "In transaction states, what is 'Partially Committed'?",
          options: ["Half data saved", "After last statement execution", "Only reads are done", "Failed transaction"],
          answerIndex: 1,
          explanation: "A transaction enters this state after the final statement has been executed, but before the actual commit to disk."
        },
        {
          id: "db-4-18",
          question: "What is 'Optimistic Concurrency Control'?",
          options: ["Always assuming success", "Checking for conflicts at end", "Using fewer indexes", "Faster hardware"],
          answerIndex: 1,
          explanation: "It allows multiple transactions to proceed without locking, only checking for conflicts before committing."
        },
        {
          id: "db-4-19",
          question: "What is a 'Savepoint'?",
          options: ["A backup file", "A point to roll back to", "An export of data", "A primary key"],
          answerIndex: 1,
          explanation: "Savepoints allow a transaction to be partially rolled back to a specific internal state without undoing the whole thing."
        },
        {
          id: "db-4-20",
          question: "What is 'Log-Based Recovery'?",
          options: ["Using logs to undo/redo work", "Reading error messages", "Manual data entry", "Network logging"],
          answerIndex: 0,
          explanation: "DBMS uses transaction logs to Redo committed transactions and Undo uncommitted ones during a system recovery."
        }
      ]
    },
    {
      level: 5,
      title: "Level 5: Indexing & Performance",
      description: "How B-Trees, Hash Indexes, and Query Plans speed up data access.",
      passScore: 16,
      questions: [
        {
          id: "db-5-1",
          question: "What is the primary purpose of an Index?",
          options: ["Data security", "Faster data retrieval", "Reducing file size", "Organizing users"],
          answerIndex: 1,
          explanation: "An index is a data structure that improves the speed of data retrieval operations at the cost of additional storage and slower writes."
        },
        {
          id: "db-5-2",
          question: "What is a 'Clustered Index'?",
          options: ["An index on multiple columns", "Physical ordering of data", "A temporary index", "An index for group by"],
          answerIndex: 1,
          explanation: "A clustered index defines the physical order in which data is stored in the table. Only one per table is possible."
        },
        {
          id: "db-5-3",
          question: "Which data structure is most commonly used for SQL indexes?",
          options: ["Array", "Linked List", "B+ Tree", "Hash Map"],
          answerIndex: 2,
          explanation: "B+ Trees are ideal for disk storage because they minimize disk I/O and support range queries efficiently."
        },
        {
          id: "db-5-4",
          question: "What is a 'Non-Clustered Index'?",
          options: ["An index without keys", "A separate structure from data", "A primary key", "A slow index"],
          answerIndex: 1,
          explanation: "It contains pointers to the physical location of the data, allowing multiple indexes per table."
        },
        {
          id: "db-5-5",
          question: "What is a 'Composite Index'?",
          options: ["An index on multiple columns", "A mix of B-Trees", "An index for images", "A primary and foreign key"],
          answerIndex: 0,
          explanation: "Also known as a multi-column index, it is useful for queries that filter on multiple attributes together."
        },
        {
          id: "db-5-6",
          question: "What is a 'Full Table Scan'?",
          options: ["Scanning only keys", "Reading every row in a table", "Counting all tables", "A backup process"],
          answerIndex: 1,
          explanation: "This occurs when the database has to read the entire table because no suitable index was found for the query."
        },
        {
          id: "db-5-7",
          question: "What is 'Index Cardinality'?",
          options: ["The number of indexes", "Uniqueness of data in a column", "The index file size", "Speed of the index"],
          answerIndex: 1,
          explanation: "High cardinality means a column has many unique values (like ID), making it a great candidate for an index."
        },
        {
          id: "db-5-8",
          question: "When should you NOT use an index?",
          options: ["On large tables", "On frequently updated columns", "On Primary Keys", "On foreign keys"],
          answerIndex: 1,
          explanation: "Indexes slow down INSERT, UPDATE, and DELETE operations because the index must be updated along with the data."
        },
        {
          id: "db-5-9",
          question: "What is a 'Covering Index'?",
          options: ["An index that covers all tables", "Index containing all queried columns", "A hidden index", "An encrypted index"],
          answerIndex: 1,
          explanation: "A covering index allows the DB to answer the query entirely from the index without looking at the actual table data."
        },
        {
          id: "db-5-10",
          question: "What is a 'Hash Index' best for?",
          options: ["Range queries", "Exact match lookups", "Sorting results", "Pattern matching"],
          answerIndex: 1,
          explanation: "Hash indexes provide $O(1)$ lookup time for equality checks (=) but do not support range searches (>, <)."
        },
        {
          id: "db-5-11",
          question: "What does 'EXPLAIN' or 'EXPLAIN ANALYZE' do?",
          options: ["Deletes a query", "Shows the query execution plan", "Fixes SQL errors", "Backs up a table"],
          answerIndex: 1,
          explanation: "It tells you how the database will execute a query, including whether it will use indexes or perform a table scan."
        },
        {
          id: "db-5-12",
          question: "What is 'Index Fragmentation'?",
          options: ["Small index size", "Gaps in the index structure", "Broken primary keys", "Multiple index files"],
          answerIndex: 1,
          explanation: "Over time, as data is modified, indexes can become fragmented, leading to slower performance and wasted space."
        },
        {
          id: "db-5-13",
          question: "What is a 'Sparse Index'?",
          options: ["Index for every row", "Index for only some blocks", "An empty index", "Index on null values"],
          answerIndex: 1,
          explanation: "Sparse indexes take up less space by only pointing to some of the records, usually at the block level."
        },
        {
          id: "db-5-14",
          question: "What is 'Query Optimization'?",
          options: ["Writing shorter SQL", "Choosing the most efficient plan", "Using more RAM", "Deleting old data"],
          answerIndex: 1,
          explanation: "The process where the DBMS decides the best way (e.g., which index to use) to execute a specific SQL query."
        },
        {
          id: "db-5-15",
          question: "What is a 'Dense Index'?",
          options: ["Heavy index file", "Entry for every search key value", "Index for large images", "Index with no gaps"],
          answerIndex: 1,
          explanation: "In a dense index, an entry is created for every single record in the data file."
        },
        {
          id: "db-5-16",
          question: "Which of these improves 'Write' performance?",
          options: ["Adding more indexes", "Removing unused indexes", "Using Clustered indexes", "Increasing cardinality"],
          answerIndex: 1,
          explanation: "Fewer indexes mean less overhead during data modification operations like INSERT or UPDATE."
        },
        {
          id: "db-5-17",
          question: "What is 'SARGability' (Search ARGumentable)?",
          options: ["Queries that can use indexes", "Queries that return strings", "Sorting ability", "Database safety"],
          answerIndex: 0,
          explanation: "A query is SARGable if the DBMS can use an index to speed it up (e.g., avoiding functions on indexed columns)."
        },
        {
          id: "db-5-18",
          question: "What is a 'Bitmap Index' best used for?",
          options: ["High cardinality columns", "Low cardinality columns", "Primary keys", "Text searching"],
          answerIndex: 1,
          explanation: "Bitmap indexes are highly efficient for columns with few unique values, like 'Gender' or 'Boolean' flags."
        },
        {
          id: "db-5-19",
          question: "What is 'Fill Factor'?",
          options: ["Amount of data in a row", "Space left open in index pages", "Total tables in a DB", "RAM usage percentage"],
          answerIndex: 1,
          explanation: "It is a setting that determines how much empty space to leave on each index page to accommodate future growth."
        },
        {
          id: "db-5-20",
          question: "What is 'Index Seek' vs 'Index Scan'?",
          options: ["Seek is for whole table", "Seek is targeted; Scan is broader", "Scan is faster", "Seek only works on PK"],
          answerIndex: 1,
          explanation: "An Index Seek navigates the tree to find specific rows, while an Index Scan reads the entire leaf level of the index."
        }
      ]
    },{
      level: 6,
      title: "Level 6: NoSQL Paradigms",
      description: "Document stores, Key-Value, Column-family, and Graph databases.",
      passScore: 16,
      questions: [
        {
          id: "db-6-1",
          question: "What is the primary characteristic of a 'Schema-less' database?",
          options: ["No data storage", "No predefined structure", "No primary keys", "No user access"],
          answerIndex: 1,
          explanation: "NoSQL databases allow inserting data without first defining a rigid table structure, making them highly flexible."
        },
        {
          id: "db-6-2",
          question: "Which NoSQL type is MongoDB categorized under?",
          options: ["Key-Value", "Document Store", "Wide-Column", "Graph"],
          answerIndex: 1,
          explanation: "MongoDB stores data in BSON (Binary JSON) format, treating each record as a self-contained document."
        },
        {
          id: "db-6-3",
          question: "What is a 'Key-Value' store primarily used for?",
          options: ["Complex Joins", "Caching and Session management", "Relational mapping", "Deep analytics"],
          answerIndex: 1,
          explanation: "Key-value stores like Redis are optimized for high-speed access to simple data paired with a unique key."
        },
        {
          id: "db-6-4",
          question: "In a Graph database, what do 'Edges' represent?",
          options: ["Data entities", "Relationships between entities", "Primary keys", "Disk sectors"],
          answerIndex: 1,
          explanation: "Nodes represent entities, while Edges represent the connections or relationships between them (e.g., 'Follows')."
        },
        {
          id: "db-6-5",
          question: "Which database is an example of a 'Wide-Column' store?",
          options: ["MySQL", "Apache Cassandra", "Redis", "Neo4j"],
          answerIndex: 1,
          explanation: "Cassandra organizes data into column families, allowing for massive scalability across multiple servers."
        },
        {
          id: "db-6-6",
          question: "What does 'BASE' stand for in NoSQL?",
          options: ["Basic, ACID, Solid, Easy", "Basically Available, Soft state, Eventual consistency", "Backup, Access, Security, Encryption", "Binary, Atomic, Stable, Efficient"],
          answerIndex: 1,
          explanation: "BASE is the NoSQL alternative to ACID, prioritizing availability over immediate consistency."
        },
        {
          id: "db-6-7",
          question: "What is 'Eventual Consistency'?",
          options: ["Data is never consistent", "Data will eventually be the same across all nodes", "Data is only consistent on one node", "Manual consistency"],
          answerIndex: 1,
          explanation: "It guarantees that if no new updates are made, all replicas will eventually converge to the same value."
        },
        {
          id: "db-6-8",
          question: "Which NoSQL type is best for finding 'friend-of-a-friend' connections?",
          options: ["Document", "Key-Value", "Graph", "Relational"],
          answerIndex: 2,
          explanation: "Graph databases excel at traversing complex relationships that would require expensive joins in SQL."
        },
        {
          id: "db-6-9",
          question: "What is 'Polyglot Persistence'?",
          options: ["Using only one database", "Using different databases for different needs", "Translating SQL to NoSQL", "A type of encryption"],
          answerIndex: 1,
          explanation: "It involves using a mix of database technologies (e.g., Redis for cache, PostgreSQL for transactions) in one app."
        },
        {
          id: "db-6-10",
          question: "What is the 'Impedance Mismatch'?",
          options: ["Network lag", "Difference between objects in code and rows in DB", "Power failure", "Encryption mismatch"],
          answerIndex: 1,
          explanation: "This refers to the difficulty of mapping object-oriented programming structures to relational tables."
        },
        {
          id: "db-6-11",
          question: "In MongoDB, what is a 'Collection' equivalent to in SQL?",
          options: ["A Row", "A Column", "A Table", "A Database"],
          answerIndex: 2,
          explanation: "A collection is a grouping of MongoDB documents, similar to how a table groups rows."
        },
        {
          id: "db-6-12",
          question: "What is a 'Time-Series' database optimized for?",
          options: ["Social media profiles", "Timestamped data logs", "Banking transactions", "Image storage"],
          answerIndex: 1,
          explanation: "Databases like InfluxDB are built to handle high volumes of data indexed by time (e.g., IoT sensor readings)."
        },
        {
          id: "db-6-13",
          question: "What is 'Sharding' in the context of NoSQL?",
          options: ["Encrypting data", "Horizontal partitioning across servers", "Deleting old data", "Vertical scaling"],
          answerIndex: 1,
          explanation: "Sharding breaks a large dataset into smaller chunks distributed across many machines."
        },
        {
          id: "db-6-14",
          question: "Which format is most common for Document stores?",
          options: ["CSV", "JSON/BSON", "XML", "Plain Text"],
          answerIndex: 1,
          explanation: "JSON provides a flexible, nested structure that maps naturally to modern programming languages."
        },
        {
          id: "db-6-15",
          question: "What is 'In-Memory' storage?",
          options: ["Storing data on SSD", "Storing data primarily in RAM", "A backup technique", "Data stored in the CPU"],
          answerIndex: 1,
          explanation: "In-memory databases (like Redis) offer sub-millisecond latency by avoiding disk I/O."
        },
        {
          id: "db-6-16",
          question: "What is the primary drawback of Wide-Column stores?",
          options: ["Small storage", "Complex query patterns", "No scalability", "Fast writes"],
          answerIndex: 1,
          explanation: "Querying data in Wide-Column stores often requires knowing the access patterns beforehand (Query-driven design)."
        },
        {
          id: "db-6-17",
          question: "What is 'Aggregates' in NoSQL terminology?",
          options: ["A collection of related data treated as a unit", "Summing numbers", "Sorting data", "Grouping users"],
          answerIndex: 0,
          explanation: "Aggregates (like a complete Order with items) are stored together in document databases to avoid joins."
        },
        {
          id: "db-6-18",
          question: "Which database uses the 'Cypher' query language?",
          options: ["MongoDB", "Neo4j", "Cassandra", "PostgreSQL"],
          answerIndex: 1,
          explanation: "Cypher is a declarative graph query language specifically designed for the Neo4j database."
        },
        {
          id: "db-6-19",
          question: "What does 'Availability' mean in a NoSQL context?",
          options: ["Data is always correct", "Every request receives a response", "Data is never lost", "Database is free"],
          answerIndex: 1,
          explanation: "Availability means the system remains operational even if some nodes are down, even if the data is slightly stale."
        },
        {
          id: "db-6-20",
          question: "What is a 'Vector Database' primarily used for?",
          options: ["Storing spreadsheets", "AI and LLM embeddings", "Processing SQL", "Graphics rendering"],
          answerIndex: 1,
          explanation: "Vector DBs (like Pinecone) are designed to store and query high-dimensional data for machine learning."
        }
      ]
    },
    {
      level: 7,
      title: "Level 7: Distributed Databases & CAP",
      description: "Consistency, Availability, Partition Tolerance, and Distributed Consensus.",
      passScore: 16,
      questions: [
        {
          id: "db-7-1",
          question: "What does the CAP Theorem state?",
          options: ["You can have all three", "You must pick two", "Consensus is impossible", "Always use SQL"],
          answerIndex: 1,
          explanation: "In a distributed system, you can only guarantee two out of Consistency, Availability, and Partition Tolerance."
        },
        {
          id: "db-7-2",
          question: "What is 'Partition Tolerance' in CAP?",
          options: ["No partitions allowed", "System continues despite network failure", "Data is always correct", "Fast networking"],
          answerIndex: 1,
          explanation: "The system must continue to operate even if communication between nodes is lost or delayed."
        },
        {
          id: "db-7-3",
          question: "What is 'Replication Factor'?",
          options: ["Speed of data", "Number of data copies across nodes", "Size of the database", "Number of users"],
          answerIndex: 1,
          explanation: "A replication factor of 3 means the same data is stored on three different physical servers for safety."
        },
        {
          id: "db-7-4",
          question: "What is 'Quorum' in distributed systems?",
          options: ["A type of error", "Minimum nodes required for an operation", "A backup tool", "Encryption key"],
          answerIndex: 1,
          explanation: "Quorum ensures that a majority of nodes agree on a write or read to maintain data integrity."
        },
        {
          id: "db-7-5",
          question: "What is a 'Brain Split' (Split-Brain) scenario?",
          options: ["Database crash", "Two parts of a cluster acting independently", "Slow CPU", "Wrong password"],
          answerIndex: 1,
          explanation: "Occurs when a network partition causes two groups of nodes to each think they are the 'leader' of the cluster."
        },
        {
          id: "db-7-6",
          question: "What is 'Consistent Hashing'?",
          options: ["Hashing passwords", "Distributing data to minimize remapping", "Sorting data", "Encrypted storage"],
          answerIndex: 1,
          explanation: "A technique used to map data to nodes such that adding/removing a node only affects a small portion of the data."
        },
        {
          id: "db-7-7",
          question: "What is 'Multi-Master' replication?",
          options: ["Only one writer", "Multiple nodes can accept writes", "No writers allowed", "Read-only database"],
          answerIndex: 1,
          explanation: "All nodes in the cluster are capable of processing write requests, which is complex due to conflict resolution."
        },
        {
          id: "db-7-8",
          question: "What is 'PACELC' an extension of?",
          options: ["ACID", "CAP Theorem", "SQL", "BASE"],
          answerIndex: 1,
          explanation: "PACELC clarifies what happens when there is NO partition (Latency vs. Consistency tradeoff)."
        },
        {
          id: "db-7-9",
          question: "What is 'Conflict Resolution' in distributed DBs?",
          options: ["Stopping the database", "Handling concurrent writes to same key", "Deleting data", "Updating the OS"],
          answerIndex: 1,
          explanation: "Techniques like 'Last Write Wins' (LWW) or Vector Clocks are used to decide which version of data is correct."
        },
        {
          id: "db-7-10",
          question: "What is 'Read-Your-Writes' consistency?",
          options: ["Immediate global consistency", "User always sees their own latest update", "Reading old data", "Read-only access"],
          answerIndex: 1,
          explanation: "A guarantee that a user will never see an older version of data they have just updated."
        },
        {
          id: "db-7-11",
          question: "What is a 'Distributed Transaction'?",
          options: ["Transaction on one PC", "Transaction spanning multiple nodes", "Fast transaction", "Transaction with no logs"],
          answerIndex: 1,
          explanation: "A transaction that requires updates on multiple independent databases, usually managed via Two-Phase Commit (2PC)."
        },
        {
          id: "db-7-12",
          question: "What is the 'Two-Phase Commit' (2PC) protocol?",
          options: ["Double password", "Prepare and Commit phases", "Backup strategy", "Fast write"],
          answerIndex: 1,
          explanation: "A blocking protocol used to ensure all nodes in a distributed transaction either commit or abort together."
        },
        {
          id: "db-7-13",
          question: "What is the main disadvantage of 2PC?",
          options: ["Too fast", "It is a blocking protocol (Low Availability)", "No security", "Small data only"],
          answerIndex: 1,
          explanation: "If the coordinator fails during the process, participants may remain locked, waiting for instructions."
        },
        {
          id: "db-7-14",
          question: "What is 'Gossip Protocol' used for?",
          options: ["Encrypting data", "Spreading state info across a cluster", "Talking to users", "Sorting rows"],
          answerIndex: 1,
          explanation: "A peer-to-peer communication mechanism where nodes share info about who is alive and who is dead."
        },
        {
          id: "db-7-15",
          question: "What is 'Linearizability'?",
          options: ["Sequential data", "Strongest consistency (appears instantaneous)", "Circular data", "Slow writes"],
          answerIndex: 1,
          explanation: "It ensures that once a write is completed, all subsequent reads will see that value or a later one."
        },
        {
          id: "db-7-16",
          question: "What is 'Master-Slave' (Primary-Replica) replication?",
          options: ["Everyone writes", "One writer, many readers", "No readers", "Manual updates"],
          answerIndex: 1,
          explanation: "One node handles all writes and propagates changes to read-only replicas to scale read performance."
        },
        {
          id: "db-7-17",
          question: "What is 'Vector Clocks' used for?",
          options: ["Measuring time", "Detecting causality and conflicts", "Sorting strings", "GPU processing"],
          answerIndex: 1,
          explanation: "A mechanism for tracking events in a distributed system to determine if one update happened before another."
        },
        {
          id: "db-7-18",
          question: "What is 'Read Repair'?",
          options: ["Fixing the CPU", "Updating stale replicas during a read", "Deleting rows", "Database backup"],
          answerIndex: 1,
          explanation: "If a client reads data and finds a version mismatch, the system automatically updates the outdated nodes."
        },
        {
          id: "db-7-19",
          question: "What is 'Saga Pattern' used for?",
          options: ["Storytelling", "Managing long-running distributed transactions", "Fast queries", "Table design"],
          answerIndex: 1,
          explanation: "A sequence of local transactions where each one updates the DB and triggers the next; failure triggers 'compensating' actions."
        },
        {
          id: "db-7-20",
          question: "What is 'Geo-Replication'?",
          options: ["Storing maps", "Replicating data across different regions", "Using GPS", "Local backup"],
          answerIndex: 1,
          explanation: "Storing copies of data in different parts of the world to reduce latency for global users and improve disaster recovery."
        }
      ]
    },
    {
      level: 8,
      title: "Level 8: Advanced Storage & Engines",
      description: "LSM Trees, B-Trees vs. LSM, MVCC, and Storage Layouts.",
      passScore: 16,
      questions: [
        {
          id: "db-8-1",
          question: "What is an 'LSM Tree' (Log-Structured Merge-Tree)?",
          options: ["A type of B-Tree", "Write-optimized storage structure", "A file system", "An encryption tool"],
          answerIndex: 1,
          explanation: "LSM Trees buffer writes in memory and flush them to disk sequentially, making them extremely fast for write-heavy loads."
        },
        {
          id: "db-8-2",
          question: "What is a 'Memtable' in LSM storage?",
          options: ["A table on disk", "In-memory buffer for recent writes", "A deleted table", "A primary key index"],
          answerIndex: 1,
          explanation: "The memtable holds incoming writes in RAM until they reach a certain size and are flushed to an SSTable."
        },
        {
          id: "db-8-3",
          question: "What does 'SSTable' stand for?",
          options: ["Super Small Table", "Sorted String Table", "Static Storage Table", "System Secret Table"],
          answerIndex: 1,
          explanation: "SSTables are the immutable, sorted disk files used by LSM-based databases like Cassandra and BigTable."
        },
        {
          id: "db-8-4",
          question: "What is 'Compaction' in an LSM-based database?",
          options: ["Compressing files", "Merging SSTables to remove duplicates", "Deleting the database", "Sorting the index"],
          answerIndex: 1,
          explanation: "Compaction is a background process that merges sorted files to reclaim space and improve read speed."
        },
        {
          id: "db-8-5",
          question: "What is 'MVCC' (Multi-Version Concurrency Control)?",
          options: ["Using multiple versions of SQL", "Allowing readers to see snapshots", "Database backups", "Multiple primary keys"],
          answerIndex: 1,
          explanation: "MVCC allows multiple users to access the same data without locking by keeping multiple versions of a record."
        },
        {
          id: "db-8-6",
          question: "What is a 'Write-Ahead Log' (WAL) used for?",
          options: ["Fast reads", "Crash recovery and durability", "Sorting data", "User permissions"],
          answerIndex: 1,
          explanation: "Every operation is recorded in the WAL before being applied to the DB to ensure no data is lost if a crash occurs."
        },
        {
          id: "db-8-7",
          question: "What is 'Write Amplification'?",
          options: ["Fast writes", "Writing more data to disk than requested", "Copying the database", "Increasing disk size"],
          answerIndex: 1,
          explanation: "A phenomenon where a single write operation results in multiple physical disk writes due to background tasks like compaction."
        },
        {
          id: "db-8-8",
          question: "What is 'Row-Oriented' storage?",
          options: ["Storing data by column", "Storing all data for a record together", "No storage", "Memory storage"],
          answerIndex: 1,
          explanation: "Traditional RDBMS use row-storage, which is optimal for OLTP (Transactional) systems where you fetch whole records."
        },
        {
          id: "db-8-9",
          question: "What is 'Columnar' (Column-Oriented) storage?",
          options: ["Storing columns separately on disk", "Storing rows only", "Using many columns", "Deleting rows"],
          answerIndex: 0,
          explanation: "Optimized for OLAP (Analytics); it allows reading only the specific attributes needed, which is very efficient for sums/averages."
        },
        {
          id: "db-8-10",
          question: "What is a 'Bloom Filter' used for?",
          options: ["Sorting data", "Checking if a key *might* exist", "Encrypting data", "Measuring speed"],
          answerIndex: 1,
          explanation: "A space-efficient probabilistic structure that prevents the DB from doing expensive disk reads for keys that don't exist."
        },
        {
          id: "db-8-11",
          question: "What is 'Direct I/O'?",
          options: ["Bypassing the OS cache", "Using a faster cable", "Manual data entry", "Writing to RAM"],
          answerIndex: 0,
          explanation: "DBMS often use Direct I/O to manage their own memory buffering instead of relying on the Operating System's generic cache."
        },
        {
          id: "db-8-12",
          question: "What is 'Garbage Collection' in MVCC?",
          options: ["Deleting the DB", "Removing old versions of records", "Sorting the index", "Emptying the bin"],
          answerIndex: 1,
          explanation: "MVCC creates many versions of rows; garbage collection cleans up versions that are no longer visible to any transaction."
        },
        {
          id: "db-8-13",
          question: "What is 'Page' in database storage?",
          options: ["A web page", "The fixed-size unit of disk/memory transfer", "A row in a table", "A user profile"],
          answerIndex: 1,
          explanation: "Databases organize data into 'pages' (usually 4KB or 8KB) for efficient reading and writing from the disk."
        },
        {
          id: "db-8-14",
          question: "What is a 'Tombstone' in NoSQL?",
          options: ["A dead server", "A marker used to denote deleted data", "An encrypted key", "An old backup"],
          answerIndex: 1,
          explanation: "In append-only systems (like LSM), data isn't deleted immediately; a 'tombstone' record marks it for deletion during compaction."
        },
        {
          id: "db-8-15",
          question: "What is 'Sequential I/O'?",
          options: ["Reading data in order", "Random disk access", "Multiple users", "Slow network"],
          answerIndex: 0,
          explanation: "Reading or writing data in a continuous stream, which is significantly faster than jumping between random disk locations."
        },
        {
          id: "db-8-16",
          question: "What is 'Data Compression' in Columnar stores?",
          options: ["Deleting data", "Using patterns like RLE (Run-Length Encoding)", "Smaller monitors", "Encrypted rows"],
          answerIndex: 1,
          explanation: "Since columns store similar data types, they can be compressed much more effectively than rows."
        },
        {
          id: "db-8-17",
          question: "What is 'In-Place Update'?",
          options: ["Appending new data", "Overwriting old data on disk", "Moving the DB", "A UI update"],
          answerIndex: 1,
          explanation: "Typical of B-Trees, where the database finds the exact physical location of a record and modifies it."
        },
        {
          id: "db-8-18",
          question: "What is 'Append-Only' storage?",
          options: ["Updating existing rows", "Always adding new data to the end", "Read-only access", "No storage"],
          answerIndex: 1,
          explanation: "Modern databases often use append-only logs to maximize write speed and simplify crash recovery."
        },
        {
          id: "db-8-19",
          question: "What is 'Free Space Map'?",
          options: ["A world map", "A structure tracking empty pages", "Total RAM size", "A list of users"],
          answerIndex: 1,
          explanation: "A helper structure used by the DBMS to quickly find pages where new data can be inserted."
        },
        {
          id: "db-8-20",
          question: "What is a 'Buffer Pool'?",
          options: ["A swimming pool", "Memory cache for disk pages", "Network buffer", "A pool of developers"],
          answerIndex: 1,
          explanation: "A region of memory used to cache data blocks (pages) read from the disk to minimize slow disk I/O."
        }
      ]
    },{
      level: 9,
      title: "Level 9: Data Warehousing & OLAP",
      description: "Star schemas, ETL processes, and analytical processing.",
      passScore: 16,
      questions: [
        {
          id: "db-9-1",
          question: "What does 'OLAP' stand for?",
          options: ["Online Ledger and Processing", "Online Analytical Processing", "Offline Analysis Protocol", "Object Level Access Provider"],
          answerIndex: 1,
          explanation: "OLAP is designed for complex data analysis and multi-dimensional queries rather than daily transactions."
        },
        {
          id: "db-9-2",
          question: "What is a 'Data Warehouse'?",
          options: ["A backup server", "Central repository for integrated data", "A small cache", "A deleted database"],
          answerIndex: 1,
          explanation: "It aggregates data from multiple sources to provide a unified view for business intelligence and reporting."
        },
        {
          id: "db-9-3",
          question: "What does 'ETL' stand for in data engineering?",
          options: ["Edit, Transfer, Load", "Extract, Transform, Load", "Encryption, Timing, Logic", "Entry, Terminal, Level"],
          answerIndex: 1,
          explanation: "ETL is the process of pulling data from sources, cleaning/formatting it, and loading it into a warehouse."
        },
        {
          id: "db-9-4",
          question: "In a Star Schema, what is a 'Fact Table'?",
          options: ["A list of descriptions", "Table containing quantitative measures", "A help document", "A table of user passwords"],
          answerIndex: 1,
          explanation: "The fact table sits at the center and contains the numerical data (metrics) being analyzed."
        },
        {
          id: "db-9-5",
          question: "What are 'Dimension Tables' used for?",
          options: ["Storing large files", "Providing context to facts", "Calculating math", "Database security"],
          answerIndex: 1,
          explanation: "Dimensions contain descriptive attributes (like Product Name or Date) that filter and group the Fact data."
        },
        {
          id: "db-9-6",
          question: "What is a 'Snowflake Schema'?",
          options: ["A fragile database", "Normalized dimension tables", "A very cold server", "A backup technique"],
          answerIndex: 1,
          explanation: "Unlike a Star Schema, the Snowflake Schema normalizes dimension tables into multiple related tables."
        },
        {
          id: "db-9-7",
          question: "What is a 'Data Cube'?",
          options: ["A physical hard drive", "Multi-dimensional data representation", "A security box", "A compressed file"],
          answerIndex: 1,
          explanation: "Data cubes allow users to view data from different perspectives, such as Sales by Region, Time, and Product."
        },
        {
          id: "db-9-8",
          question: "What is 'Drill-Down' in OLAP?",
          options: ["Deleting data", "Moving from summary to detailed data", "Hard drive repair", "Sorting rows"],
          answerIndex: 1,
          explanation: "Drilling down allows a user to click on a high-level total to see the individual transactions that make it up."
        },
        {
          id: "db-9-9",
          question: "What is 'Roll-Up'?",
          options: ["Summing data to a higher level", "Deleting old logs", "Closing a database", "Encrypting a table"],
          answerIndex: 0,
          explanation: "The opposite of drill-down; it aggregates data up a hierarchy (e.g., from Cities to Countries)."
        },
        {
          id: "db-9-10",
          question: "What is a 'Data Mart'?",
          options: ["A place to buy data", "Subset of a warehouse for a specific department", "A database virus", "A primary key"],
          answerIndex: 1,
          explanation: "A Data Mart is a focused version of a data warehouse, usually tailored for a specific team like Finance or Marketing."
        },
        {
          id: "db-9-11",
          question: "What is 'Slowly Changing Dimension' (SCD)?",
          options: ["A bug in the DB", "Handling attribute changes over time", "A slow query", "Old data"],
          answerIndex: 1,
          explanation: "SCD techniques (Type 1, 2, 3) manage how the warehouse tracks history when a dimension attribute changes."
        },
        {
          id: "db-9-12",
          question: "What is 'MOLAP'?",
          options: ["Manual OLAP", "Multidimensional OLAP", "Managed OLAP", "Mini OLAP"],
          answerIndex: 1,
          explanation: "MOLAP stores data in optimized multi-dimensional arrays rather than relational tables for extreme speed."
        },
        {
          id: "db-9-13",
          question: "What is 'Metadata' in a Data Warehouse?",
          options: ["Encrypted text", "The 'Directory' of the warehouse", "Big data", "Deleted files"],
          answerIndex: 1,
          explanation: "Metadata defines the source, transformation rules, and structure of the data within the warehouse."
        },
        {
          id: "db-9-14",
          question: "What is 'Data Scrubbing'?",
          options: ["Deleting the database", "Cleaning and correcting data errors", "Scanning for viruses", "Sorting columns"],
          answerIndex: 1,
          explanation: "Also known as data cleansing; it ensures that the warehouse contains high-quality, consistent information."
        },
        {
          id: "db-9-15",
          question: "What is 'Granularity'?",
          options: ["Database speed", "The level of detail in data", "A type of encryption", "The number of users"],
          answerIndex: 1,
          explanation: "High granularity means data is stored at the lowest possible level (e.g., individual ticket sales vs. daily totals)."
        },
        {
          id: "db-9-16",
          question: "What is 'Slice and Dice'?",
          options: ["Deleting data", "Selecting and viewing specific data subsets", "A backup method", "Server maintenance"],
          answerIndex: 1,
          explanation: "Slicing picks one dimension; Dicing picks a sub-cube of multiple dimensions to analyze."
        },
        {
          id: "db-9-17",
          question: "What is a 'Surrogate Key' in a warehouse?",
          options: ["The original ID from source", "A warehouse-specific unique ID", "A temporary key", "A password"],
          answerIndex: 1,
          explanation: "Warehouses use their own keys to handle instances where different source systems use the same ID."
        },
        {
          id: "db-9-18",
          question: "What is 'Massively Parallel Processing' (MPP)?",
          options: ["Using one CPU", "Using many CPUs to process a query", "Slow networking", "Manual entry"],
          answerIndex: 1,
          explanation: "MPP databases like Snowflake or BigQuery split a single query across hundreds of nodes to process terabytes in seconds."
        },
        {
          id: "db-9-19",
          question: "What is a 'Staging Area'?",
          options: ["The final warehouse", "Temporary storage for ETL", "A backup drive", "A user dashboard"],
          answerIndex: 1,
          explanation: "Data is landed here first to be cleaned and transformed before moving into the production warehouse."
        },
        {
          id: "db-9-20",
          question: "What is 'Big Data' typically characterized by?",
          options: ["Small files", "Volume, Velocity, and Variety", "Only SQL", "Manual processing"],
          answerIndex: 1,
          explanation: "The '3 Vs' describe the scale and complexity that traditional databases often struggle to manage."
        }
      ]
    },
    {
      level: 10,
      title: "Level 10: Database Security & Administration",
      description: "Roles, Permissions, SQL Injection, and Backup strategies.",
      passScore: 16,
      questions: [
        {
          id: "db-10-1",
          question: "What is 'SQL Injection'?",
          options: ["A database optimization", "Inserting malicious SQL into a query", "A backup technique", "A type of join"],
          answerIndex: 1,
          explanation: "A vulnerability where an attacker can execute arbitrary SQL by manipulating input fields."
        },
        {
          id: "db-10-2",
          question: "What is the best way to prevent SQL Injection?",
          options: ["Using longer passwords", "Using Prepared Statements", "Deleting the database", "Using more RAM"],
          answerIndex: 1,
          explanation: "Prepared statements (parameterized queries) ensure that user input is never executed as code."
        },
        {
          id: "db-10-3",
          question: "What is 'RBAC'?",
          options: ["Row-Based Access Control", "Role-Based Access Control", "Random Backup and Copy", "Real-time Basic Access"],
          answerIndex: 1,
          explanation: "Permissions are assigned to 'roles' rather than individual users to simplify security management."
        },
        {
          id: "db-10-4",
          question: "What does the 'GRANT' command do?",
          options: ["Gives permissions to a user", "Deletes a user", "Creates a table", "Backs up data"],
          answerIndex: 0,
          explanation: "GRANT is used to provide specific access (like SELECT or UPDATE) to users or roles."
        },
        {
          id: "db-10-5",
          question: "What does the 'REVOKE' command do?",
          options: ["Gives permissions", "Removes permissions", "Resets the server", "Changes a password"],
          answerIndex: 1,
          explanation: "REVOKE is used to withdraw previously granted privileges from a user."
        },
        {
          id: "db-10-6",
          question: "What is 'Least Privilege'?",
          options: ["Giving users no access", "Giving users only what they need", "Admin access for everyone", "Using old software"],
          answerIndex: 1,
          explanation: "A security principle where accounts are granted the minimum level of access required to do their job."
        },
        {
          id: "db-10-7",
          question: "What is 'Encryption at Rest'?",
          options: ["Encrypting data on the network", "Encrypting data stored on disk", "Encryption only for admins", "Turning off the server"],
          answerIndex: 1,
          explanation: "It ensures that if the physical hard drive is stolen, the data cannot be read without the key."
        },
        {
          id: "db-10-8",
          question: "What is 'Encryption in Transit'?",
          options: ["Disk encryption", "Protecting data as it moves over a network", "Backup encryption", "User password security"],
          answerIndex: 1,
          explanation: "Usually achieved through SSL/TLS, it prevents 'man-in-the-middle' attacks during data transfer."
        },
        {
          id: "db-10-9",
          question: "What is a 'Full Backup'?",
          options: ["A backup of one table", "A complete copy of the entire database", "A backup of logs", "Deleting data"],
          answerIndex: 1,
          explanation: "It captures every single object and piece of data in the database at a specific point in time."
        },
        {
          id: "db-10-10",
          question: "What is an 'Incremental Backup'?",
          options: ["Backup of everything", "Backup of only changes since last backup", "Deleting the last backup", "A faster server"],
          answerIndex: 1,
          explanation: "Incremental backups are faster and smaller because they only save data that has changed since the last backup (of any type)."
        },
        {
          id: "db-10-11",
          question: "What is 'Database Auditing'?",
          options: ["Calculating taxes", "Tracking who did what and when", "Fixing SQL errors", "Counting tables"],
          answerIndex: 1,
          explanation: "Auditing maintains a trail of database activities, essential for compliance and security forensics."
        },
        {
          id: "db-10-12",
          question: "What is 'Data Masking'?",
          options: ["Hiding sensitive data from non-privileged users", "Deleting data", "Encrypting everything", "A type of join"],
          answerIndex: 0,
          explanation: "Masking replaces real data (like Credit Card numbers) with functional but fake data for testing or support."
        },
        {
          id: "db-10-13",
          question: "What is a 'Point-in-Time Recovery' (PITR)?",
          options: ["Restoring to the latest backup", "Restoring to a specific second", "A fast backup", "Deleting logs"],
          answerIndex: 1,
          explanation: "PITR uses full backups and transaction logs to restore a database to a precise moment before a failure."
        },
        {
          id: "db-10-14",
          question: "What is 'Two-Factor Authentication' (2FA) for databases?",
          options: ["Two passwords", "Password + another factor (like OTP)", "Two users", "Encryption + hashing"],
          answerIndex: 1,
          explanation: "Adding a second layer of verification significantly reduces the risk of unauthorized access."
        },
        {
          id: "db-10-15",
          question: "What is a 'Database Proxy'?",
          options: ["A fake database", "A layer between app and DB for security/pooling", "A slow connection", "A type of index"],
          answerIndex: 1,
          explanation: "Proxies like pgBouncer or AWS Proxy manage connections and can block suspicious queries."
        },
        {
          id: "db-10-16",
          question: "What is 'Row-Level Security' (RLS)?",
          options: ["Encrypting rows", "Restricting which rows a user can see", "Sorting rows", "Deleting rows"],
          answerIndex: 1,
          explanation: "RLS allows different users to query the same table but only see the records they are authorized to see."
        },
        {
          id: "db-10-17",
          question: "What is a 'Database Vulnerability Scan'?",
          options: ["Searching for data", "Checking for known security holes", "Counting users", "Measuring speed"],
          answerIndex: 1,
          explanation: "Automated tools check the DB configuration against a list of known weaknesses and misconfigurations."
        },
        {
          id: "db-10-18",
          question: "What is 'Data Sovereignty'?",
          options: ["Fast data", "Legal requirement that data stays in a country", "Total admin control", "Encryption"],
          answerIndex: 1,
          explanation: "Many laws (like GDPR) require that sensitive personal data of citizens remains within specific borders."
        },
        {
          id: "db-10-19",
          question: "What is 'TDE' (Transparent Data Encryption)?",
          options: ["Manual encryption", "Automatic encryption of the database files", "Hidden data", "User password hashing"],
          answerIndex: 1,
          explanation: "TDE encrypts the entire database storage at the file level without requiring changes to the application code."
        },
        {
          id: "db-10-20",
          question: "What is 'Hardening' a database?",
          options: ["Buying more RAM", "Closing unnecessary ports and services", "Using solid state drives", "Deleting old data"],
          answerIndex: 1,
          explanation: "Hardening is the process of securing a system by reducing its surface of vulnerability."
        }
      ]
    },
    {
      level: 11,
      title: "Level 11: Modern Trends & NewSQL",
      description: "Serverless DBs, NewSQL, and Cloud-native architectures.",
      passScore: 16,
      questions: [
        {
          id: "db-11-1",
          question: "What is 'NewSQL'?",
          options: ["A brand of SQL", "Modern DBs combining NoSQL scale with ACID", "A new query language", "A NoSQL database"],
          answerIndex: 1,
          explanation: "NewSQL databases (like CockroachDB) aim to provide the horizontal scalability of NoSQL while keeping ACID guarantees."
        },
        {
          id: "db-11-2",
          question: "What is a 'Serverless' Database?",
          options: ["A DB with no hardware", "Database that scales resources automatically", "An offline DB", "A manual DB"],
          answerIndex: 1,
          explanation: "Serverless DBs (like Aurora Serverless) handle the scaling and management, and you only pay for what you use."
        },
        {
          id: "db-11-3",
          question: "What is 'HTAP' (Hybrid Transactional/Analytical Processing)?",
          options: ["Fast SQL", "Running OLTP and OLAP on the same data", "A mix of Java and SQL", "A type of backup"],
          answerIndex: 1,
          explanation: "HTAP allows businesses to perform real-time analytics on live transactional data without moving it to a warehouse."
        },
        {
          id: "db-11-4",
          question: "What is a 'Multi-Model' Database?",
          options: ["Database for fashion", "Supports Document, Graph, and Relational in one", "A DB with many users", "Multiple DB servers"],
          answerIndex: 1,
          explanation: "Databases like ArangoDB or Azure Cosmos DB support multiple data models (key-value, doc, graph) in a single engine."
        },
        {
          id: "db-11-5",
          question: "What is 'Database Sharding'?",
          options: ["Deleting data", "Horizontal partitioning of data across nodes", "Vertical scaling", "A type of index"],
          answerIndex: 1,
          explanation: "Sharding distributes rows of a table across multiple database instances to handle massive loads."
        },
        {
          id: "db-11-6",
          question: "What is 'Cloud-Native' database design?",
          options: ["DB in a private data center", "Architected specifically for cloud features", "Using only local drives", "A physical server"],
          answerIndex: 1,
          explanation: "Cloud-native DBs use distributed storage and microservices architecture to provide high resilience and elasticity."
        },
        {
          id: "db-11-7",
          question: "What is 'Change Data Capture' (CDC)?",
          options: ["A backup", "Identifying and tracking changed data", "A virus", "A type of query"],
          answerIndex: 1,
          explanation: "CDC listens to the database log to stream changes to other systems (like search indexes) in real-time."
        },
        {
          id: "db-11-8",
          question: "What is an 'Edge Database'?",
          options: ["A very sharp DB", "Database located close to the user/device", "A backup DB", "An old database"],
          answerIndex: 1,
          explanation: "Edge DBs reduce latency by processing data at the 'edge' of the network, near the source of data generation."
        },
        {
          id: "db-11-9",
          question: "What is 'DBaaS'?",
          options: ["Database as a Software", "Database as a Service", "Data Backup and Security", "Database and App Service"],
          answerIndex: 1,
          explanation: "A managed cloud service where the provider handles installation, maintenance, and backups (e.g., MongoDB Atlas)."
        },
        {
          id: "db-11-10",
          question: "What is 'Database-as-Code'?",
          options: ["Coding a DB from scratch", "Managing schema using version control/scripts", "A new language", "A script for backups"],
          answerIndex: 1,
          explanation: "Treating database migrations and configuration like application code, integrated into CI/CD pipelines."
        },
        {
          id: "db-11-11",
          question: "What is 'Raft' or 'Paxos'?",
          options: ["A type of join", "Distributed consensus algorithms", "A backup tool", "An encryption algorithm"],
          answerIndex: 1,
          explanation: "These protocols help multiple nodes in a cluster agree on a single value, crucial for distributed consistency."
        },
        {
          id: "db-11-12",
          question: "What is 'GraphQL' in the context of databases?",
          options: ["A graph database", "A query language for APIs", "A SQL replacement", "A backup protocol"],
          answerIndex: 1,
          explanation: "While not a database itself, GraphQL provides a powerful way to fetch exactly the data needed from various backend sources."
        },
        {
          id: "db-11-13",
          question: "What is 'Data Mesh'?",
          options: ["A messy database", "Decentralized data management architecture", "A type of network", "A primary key"],
          answerIndex: 1,
          explanation: "Data Mesh treats 'data as a product' owned by specific domain teams rather than a central monolithic team."
        },
        {
          id: "db-11-14",
          question: "What is 'In-Memory Grid'?",
          options: ["A spreadsheet", "Distributed RAM storage for fast access", "A type of index", "A graphics card"],
          answerIndex: 1,
          explanation: "Platforms like Apache Ignite provide a distributed layer of RAM for high-performance computing across a cluster."
        },
        {
          id: "db-11-15",
          question: "What is 'Active-Active' setup?",
          options: ["One server working", "Two or more servers simultaneously handling traffic", "A fast server", "A backup server"],
          answerIndex: 1,
          explanation: "A high-availability configuration where multiple nodes are live and synchronized to handle requests."
        },
        {
          id: "db-11-16",
          question: "What is 'Query Federation'?",
          options: ["Joining two tables", "Querying data across different DB systems", "A global database", "A backup strategy"],
          answerIndex: 1,
          explanation: "Allows a single SQL query to pull data from PostgreSQL, MongoDB, and S3 simultaneously."
        },
        {
          id: "db-11-17",
          question: "What is 'Vector Search'?",
          options: ["Searching for lines", "Searching for similarity using embeddings", "A fast index", "A SQL query"],
          answerIndex: 1,
          explanation: "Used in AI to find 'similar' items (like images or text) rather than exact keyword matches."
        },
        {
          id: "db-11-18",
          question: "What is 'Self-Healing' in databases?",
          options: ["Manual repair", "Automatic detection and fix of failures", "A software update", "A backup"],
          answerIndex: 1,
          explanation: "Cloud databases often automatically detect node failure and spin up replacements without human intervention."
        },
        {
          id: "db-11-19",
          question: "What is 'Cold vs Hot' storage?",
          options: ["Temperature of servers", "Archival vs frequently accessed data", "New vs old DBs", "Fast vs slow RAM"],
          answerIndex: 1,
          explanation: "Tiered storage moves old data to cheaper, slower 'cold' storage to save costs while keeping 'hot' data on fast SSDs."
        },
        {
          id: "db-11-20",
          question: "What is 'Database Observability'?",
          options: ["Watching the screen", "Deep monitoring of performance and health", "A type of view", "Counting tables"],
          answerIndex: 1,
          explanation: "Modern observability goes beyond simple metrics to provide insights into query execution and resource bottlenecks."
        }
      ]
    },
    {
      level: 12,
      title: "Level 12: Expert - System Design & Architecture",
      description: "Final Boss: Scaling, High Availability, and Trade-off Analysis.",
      passScore: 18,
      questions: [
        {
          id: "db-12-1",
          question: "When designing for 'High Availability', what is the 'Rule of Three'?",
          options: ["Three tables", "Three copies of data in different zones", "Three users", "Three backups"],
          answerIndex: 1,
          explanation: "Distributing data across three Availability Zones ensures that even if an entire data center fails, the system remains operational."
        },
        {
          id: "db-12-2",
          question: "What is 'Vertical Scaling' (Scaling Up)?",
          options: ["Adding more servers", "Adding more CPU/RAM to a single server", "Deleting data", "Using a faster network"],
          answerIndex: 1,
          explanation: "Vertical scaling increases the power of an existing machine. It has a physical ceiling and involves a single point of failure."
        },
        {
          id: "db-12-3",
          question: "What is 'Horizontal Scaling' (Scaling Out)?",
          options: ["Adding more machines to a cluster", "Buying a bigger CPU", "Updating the OS", "Manual data entry"],
          answerIndex: 0,
          explanation: "Horizontal scaling adds more nodes to the system. It is the foundation of modern distributed databases."
        },
        {
          id: "db-12-4",
          question: "What is the 'Thundering Herd' problem?",
          options: ["Too many users", "Many processes waking up to handle an event simultaneously", "A server crash", "Slow database logs"],
          answerIndex: 1,
          explanation: "This occurs when many clients attempt to access a resource (like a cache) at the same time after a failure, potentially crashing the system."
        },
        {
          id: "db-12-5",
          question: "What is 'Cache Aside' pattern?",
          options: ["The DB updates the cache", "The application manages both cache and DB", "The cache is the primary DB", "No cache used"],
          answerIndex: 1,
          explanation: "The application first checks the cache; if it's a miss, it fetches from the DB and updates the cache manually."
        },
        {
          id: "db-12-6",
          question: "What is 'Read-Through' caching?",
          options: ["Manual cache update", "The cache library updates itself from the DB", "Directly reading from disk", "Reading only from RAM"],
          answerIndex: 1,
          explanation: "The application asks the cache for data; if missing, the cache itself fetches from the DB and returns it to the app."
        },
        {
          id: "db-12-7",
          question: "What is 'Write-Back' (Write-Behind) caching?",
          options: ["Writing to DB first", "Writing to cache first, then DB later", "No writes allowed", "Writing to disk directly"],
          answerIndex: 1,
          explanation: "This improves write performance but risks data loss if the cache fails before the data is persisted to the database."
        },
        {
          id: "db-12-8",
          question: "What is a 'Hot Partition' in a sharded database?",
          options: ["A server on fire", "One shard receiving significantly more traffic than others", "A fast database", "A deleted shard"],
          answerIndex: 1,
          explanation: "Poor choice of a shard key can lead to one machine being overwhelmed while others stay idle."
        },
        {
          id: "db-12-9",
          question: "What is 'Connection Pooling'?",
          options: ["Sharing one cable", "Maintaining a set of open DB connections for reuse", "A list of passwords", "Deleting connections"],
          answerIndex: 1,
          explanation: "Opening connections is expensive; pooling keeps them open to reduce latency for high-traffic apps."
        },
        {
          id: "db-12-10",
          question: "What is 'Query Optimization' based on 'Cost'?",
          options: ["Price of the database", "Estimating CPU/IO needed for an execution plan", "Length of the query", "Number of columns"],
          answerIndex: 1,
          explanation: "Modern optimizers use statistics to choose the 'cheapest' path to retrieve data."
        },
        {
          id: "db-12-11",
          question: "What is 'Denormalization' used for in system design?",
          options: ["Fixing bugs", "Optimizing read performance by reducing joins", "Saving disk space", "Encrypting data"],
          answerIndex: 1,
          explanation: "Redundancy is intentionally added to avoid expensive joins in high-scale systems."
        },
        {
          id: "db-12-12",
          question: "What is 'Database Replication Lag'?",
          options: ["Slow internet", "Delay between writing to master and appearing on replica", "A frozen screen", "Deleting a replica"],
          answerIndex: 1,
          explanation: "In asynchronous replication, there is a small window where the replica has stale data."
        },
        {
          id: "db-12-13",
          question: "What is 'Failover'?",
          options: ["A database error", "Automatically switching to a standby server", "Restarting the PC", "Manual backup"],
          answerIndex: 1,
          explanation: "Ensures business continuity by promoting a secondary node to 'Master' when the primary fails."
        },
        {
          id: "db-12-14",
          question: "What is 'Multi-Region Deployment'?",
          options: ["Two tables", "Deploying DB instances in different geographic areas", "Using two clouds", "Manual data sync"],
          answerIndex: 1,
          explanation: "Provides disaster recovery and lower latency for global users."
        },
        {
          id: "db-12-15",
          question: "What is 'Database Migration'?",
          options: ["Moving a server", "Systematically changing the DB schema over time", "Copying a file", "Deleting old rows"],
          answerIndex: 1,
          explanation: "Controlled scripts that evolve the database structure alongside the application code."
        },
        {
          id: "db-12-16",
          question: "What is 'Write-Through' caching?",
          options: ["Async writes", "Synchronously writing to both cache and DB", "Writing only to RAM", "Deleting the cache"],
          answerIndex: 1,
          explanation: "Ensures data consistency between cache and DB but adds latency to write operations."
        },
        {
          id: "db-12-17",
          question: "What is 'Snapshot Isolation'?",
          options: ["One backup", "Transaction sees a consistent version of the whole DB", "Frozen database", "A screenshot"],
          answerIndex: 1,
          explanation: "Used in MVCC to ensure that a long-running read query doesn't see partial updates from other transactions."
        },
        {
          id: "db-12-18",
          question: "What is 'Cascading Failure'?",
          options: ["A waterfall", "One failure triggering failures in other components", "A slow join", "Deleting a row"],
          answerIndex: 1,
          explanation: "If a database shard fails, the remaining shards may get overloaded and fail in a chain reaction."
        },
        {
          id: "db-12-19",
          question: "What is 'Data Locality'?",
          options: ["Local files", "Keeping data close to where it is processed", "Small databases", "Encrypted data"],
          answerIndex: 1,
          explanation: "Reduces network overhead by ensuring compute nodes are physically near the storage nodes."
        },
        {
          id: "db-12-20",
          question: "Which trade-off is central to the 'Shared-Nothing' architecture?",
          options: ["Speed vs Cost", "Scalability vs Complexity", "SQL vs NoSQL", "Security vs Access"],
          answerIndex: 1,
          explanation: "Each node is independent, allowing for infinite scale, but managing state and consistency across them becomes very complex."
        }
      ]
    }
  ]
};