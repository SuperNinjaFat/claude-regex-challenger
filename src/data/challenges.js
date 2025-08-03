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