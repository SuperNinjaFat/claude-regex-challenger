export const postgresqlChallenges = {
  easy: [
    {
      id: 1,
      question: "Select all columns from a table",
      description: "Write a SQL query to select all columns from a table named 'users'",
      testString: "users table: id, name, email, age",
      correctAnswer: "SELECT * FROM users",
      hints: ["Use SELECT *", "FROM specifies the table", "Don't forget the semicolon is optional"]
    },
    {
      id: 2,
      question: "Select specific columns",
      description: "Write a SQL query to select only 'name' and 'email' columns from 'users' table",
      testString: "users table: id, name, email, age",
      correctAnswer: "SELECT name, email FROM users",
      hints: ["List columns separated by commas", "Use FROM to specify table", "Order doesn't matter for correctness"]
    },
    {
      id: 3,
      question: "Filter with WHERE clause",
      description: "Write a SQL query to select all users where age is greater than 18",
      testString: "users table: id, name, email, age",
      correctAnswer: "SELECT * FROM users WHERE age > 18",
      hints: ["Use WHERE clause for filtering", "Use > for greater than", "Place WHERE after FROM"]
    },
    {
      id: 4,
      question: "Count rows",
      description: "Write a SQL query to count the total number of users",
      testString: "users table: id, name, email, age",
      correctAnswer: "SELECT COUNT(*) FROM users",
      hints: ["Use COUNT() function", "COUNT(*) counts all rows", "No WHERE clause needed"]
    },
    {
      id: 5,
      question: "Order results",
      description: "Write a SQL query to select all users ordered by name in ascending order",
      testString: "users table: id, name, email, age",
      correctAnswer: "SELECT * FROM users ORDER BY name ASC",
      hints: ["Use ORDER BY clause", "ASC means ascending", "Place ORDER BY at the end"]
    }
  ],
  medium: [
    {
      id: 6,
      question: "Join two tables",
      description: "Write a SQL query to join 'users' and 'orders' tables on user_id",
      testString: "users(id, name) orders(id, user_id, total)",
      correctAnswer: "SELECT * FROM users JOIN orders ON users.id = orders.user_id",
      hints: ["Use JOIN keyword", "ON specifies join condition", "Match primary and foreign keys"]
    },
    {
      id: 7,
      question: "Group by and aggregate",
      description: "Write a SQL query to count orders per user, showing user_id and count",
      testString: "orders table: id, user_id, total, created_at",
      correctAnswer: "SELECT user_id, COUNT(*) FROM orders GROUP BY user_id",
      hints: ["Use GROUP BY for aggregation", "COUNT(*) for counting", "Non-aggregated columns must be in GROUP BY"]
    },
    {
      id: 8,
      question: "Filter with IN operator",
      description: "Write a SQL query to select users where status is 'active' or 'pending'",
      testString: "users table: id, name, status",
      correctAnswer: "SELECT * FROM users WHERE status IN ('active', 'pending')",
      hints: ["Use IN operator", "List values in parentheses", "Strings need quotes"]
    },
    {
      id: 9,
      question: "Use LIKE for pattern matching",
      description: "Write a SQL query to find users whose email ends with '@gmail.com'",
      testString: "users table: id, name, email",
      correctAnswer: "SELECT * FROM users WHERE email LIKE '%@gmail.com'",
      hints: ["Use LIKE operator", "% is a wildcard", "Place % at the start to match ending"]
    },
    {
      id: 10,
      question: "Limit results",
      description: "Write a SQL query to select the first 10 users ordered by created_at",
      testString: "users table: id, name, email, created_at",
      correctAnswer: "SELECT * FROM users ORDER BY created_at LIMIT 10",
      hints: ["Use LIMIT clause", "ORDER BY comes before LIMIT", "LIMIT goes at the end"]
    }
  ],
  hard: [
    {
      id: 11,
      question: "Subquery in WHERE",
      description: "Write a SQL query to find users who have placed more than 5 orders",
      testString: "users(id, name) orders(id, user_id, total)",
      correctAnswer: "SELECT * FROM users WHERE id IN (SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > 5)",
      hints: ["Use subquery with IN", "GROUP BY user_id in subquery", "Use HAVING for aggregate conditions"]
    },
    {
      id: 12,
      question: "Left join with condition",
      description: "Write a SQL query to show all users and their orders (if any), including users with no orders",
      testString: "users(id, name) orders(id, user_id, total)",
      correctAnswer: "SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id",
      hints: ["Use LEFT JOIN", "LEFT JOIN includes all rows from left table", "ON specifies join condition"]
    },
    {
      id: 13,
      question: "Window function",
      description: "Write a SQL query to show each order with a running total of amounts using ROW_NUMBER",
      testString: "orders table: id, user_id, amount, created_at",
      correctAnswer: "SELECT *, ROW_NUMBER() OVER (ORDER BY created_at) FROM orders",
      hints: ["Use ROW_NUMBER() window function", "OVER clause defines the window", "ORDER BY inside OVER"]
    },
    {
      id: 14,
      question: "Common Table Expression (CTE)",
      description: "Write a SQL query using WITH to create a CTE named 'recent_orders' for orders from last 30 days, then select from it",
      testString: "orders table: id, user_id, total, created_at",
      correctAnswer: "WITH recent_orders AS (SELECT * FROM orders WHERE created_at > CURRENT_DATE - INTERVAL '30 days') SELECT * FROM recent_orders",
      hints: ["Start with WITH", "Name the CTE before AS", "Select from CTE name at the end"]
    },
    {
      id: 15,
      question: "Complex aggregation",
      description: "Write a SQL query to find the average order total per user, only for users with more than 3 orders",
      testString: "orders table: id, user_id, total",
      correctAnswer: "SELECT user_id, AVG(total) FROM orders GROUP BY user_id HAVING COUNT(*) > 3",
      hints: ["Use AVG() for average", "GROUP BY user_id", "HAVING filters groups after aggregation"]
    }
  ]
};

export const regexChallenges = {
  easy: [
    {
      id: 1,
      question: "Match any single digit",
      description: "Write a regex that matches any single digit (0-9)",
      testString: "The year 2023 has 4 digits",
      correctAnswer: "\\d",
      hints: ["Think about digit character classes", "Use \\d shorthand"]
    },
    {
      id: 2,
      question: "Match the word 'cat'",
      description: "Write a regex that matches the exact word 'cat'",
      testString: "The cat sat on the mat",
      correctAnswer: "cat",
      hints: ["Match literal characters", "Case sensitive"]
    },
    {
      id: 3,
      question: "Match any vowel",
      description: "Write a regex that matches any vowel (a, e, i, o, u)",
      testString: "hello world",
      correctAnswer: "[aeiou]",
      hints: ["Use character sets", "Put vowels in square brackets"]
    },
    {
      id: 4,
      question: "Match any whitespace",
      description: "Write a regex that matches any whitespace character",
      testString: "hello world test",
      correctAnswer: "\\s",
      hints: ["Use whitespace shorthand", "\\s matches spaces, tabs, newlines"]
    },
    {
      id: 5,
      question: "Match 'a' or 'b'",
      description: "Write a regex that matches either 'a' or 'b'",
      testString: "apple banana cherry",
      correctAnswer: "[ab]",
      hints: ["Use character sets", "Square brackets for alternatives"]
    }
  ],
  medium: [
    {
      id: 6,
      question: "Match 2-4 digits",
      description: "Write a regex that matches between 2 and 4 consecutive digits",
      testString: "The years 23, 456, and 1789 are different",
      correctAnswer: "\\d{2,4}",
      hints: ["Use quantifiers", "Curly braces for specific ranges"]
    },
    {
      id: 7,
      question: "Match words starting with 'th'",
      description: "Write a regex that matches words starting with 'th' (case insensitive)",
      testString: "The theory is that this works",
      correctAnswer: "\\bth\\w*",
      hints: ["Use word boundaries", "\\b for word start", "\\w* for word characters"]
    },
    {
      id: 8,
      question: "Match email format",
      description: "Write a regex that matches basic email format (letters@letters.com)",
      testString: "Contact us at test@example.com for help",
      correctAnswer: "\\w+@\\w+\\.\\w+",
      hints: ["Use \\w+ for word characters", "Escape the dot", "@ is literal"]
    },
    {
      id: 9,
      question: "Match phone numbers",
      description: "Write a regex that matches phone numbers in format XXX-XXX-XXXX",
      testString: "Call me at 123-456-7890 tomorrow",
      correctAnswer: "\\d{3}-\\d{3}-\\d{4}",
      hints: ["Use \\d for digits", "Specify exact counts", "Hyphens are literal"]
    },
    {
      id: 10,
      question: "Match hexadecimal colors",
      description: "Write a regex that matches hex color codes like #FF0000",
      testString: "The color #FF0000 is red and #00FF00 is green",
      correctAnswer: "#[0-9A-Fa-f]{6}",
      hints: ["Start with #", "Use character ranges", "Exactly 6 characters"]
    }
  ],
  hard: [
    {
      id: 11,
      question: "Match balanced parentheses",
      description: "Write a regex that matches text within properly balanced parentheses",
      testString: "Calculate (2 * (3 + 4)) and (5 + 6)",
      correctAnswer: "\\([^()]*\\)",
      hints: ["Match opening paren", "Exclude nested parens", "Match closing paren"]
    },
    {
      id: 12,
      question: "Match IP addresses",
      description: "Write a regex that matches valid IPv4 addresses (0-255.0-255.0-255.0-255)",
      testString: "Server IPs: 192.168.1.1 and 10.0.0.1",
      correctAnswer: "\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b",
      hints: ["Use word boundaries", "Group with (?:...)", "Repeat 3 times with {3}"]
    },
    {
      id: 13,
      question: "Match valid URLs",
      description: "Write a regex that matches HTTP/HTTPS URLs",
      testString: "Visit https://example.com or http://test.org",
      correctAnswer: "https?://[\\w.-]+\\.[a-z]{2,}",
      hints: ["Optional s with ?", "Word chars and dots", "Domain extension 2+ chars"]
    },
    {
      id: 14,
      question: "Match repeated words",
      description: "Write a regex that matches repeated words (like 'the the')",
      testString: "This is is a test test sentence",
      correctAnswer: "\\b(\\w+)\\s+\\1\\b",
      hints: ["Capture a word", "Match whitespace", "Use backreference \\1"]
    },
    {
      id: 15,
      question: "Match time format",
      description: "Write a regex that matches time in HH:MM format (24-hour)",
      testString: "Meeting at 14:30 and lunch at 12:00",
      correctAnswer: "(?:[01]\\d|2[0-3]):[0-5]\\d",
      hints: ["Hours: 00-23", "Minutes: 00-59", "Use alternation for hour ranges"]
    }
  ]
};