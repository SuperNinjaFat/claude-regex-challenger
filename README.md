# Programming Quiz App

A Next.js web application that quizzes users on **Regex** and **PostgreSQL** with challenges of varying difficulty. Features real-time query execution using PGlite (real PostgreSQL in WebAssembly).

## Features

### Quiz Types
- **Regex Challenges** - Pattern matching, character classes, lookaheads, and more
- **PostgreSQL Challenges** - SELECT queries, JOINs, GROUP BY, subqueries, window functions, CTEs

### Interactive Learning
- Three difficulty levels: Easy, Medium, Hard (5 challenges each per quiz type)
- Interactive quiz interface with real-time testing
- Scoring system with detailed results and grade calculation
- Hints system for each challenge
- Live pattern matching (Regex) and query execution (PostgreSQL)
- Responsive design that works on mobile and desktop

### Technical Highlights
- **Backend API Routes** - SQL queries executed server-side for security
- **PGlite Integration** - Real PostgreSQL database running in WebAssembly (no external database needed)
- **Client-Side Rendering** - Fast, interactive UI
- **Self-Contained** - Everything runs locally, no external services required

## Architecture

```
Next.js App
├── Frontend (Client-side rendered React)
│   └── Sends SQL queries to API
└── Backend (API Routes)
    └── PGlite (real PostgreSQL) executes queries server-side
```

## Key Components

### Pages
- `pages/index.js` - Home page with quiz type and difficulty selection
- `pages/quiz/[quizType]/[difficulty].js` - Main quiz interface with dynamic routing
- `pages/results.js` - Score display and detailed answer review

### API Routes
- `pages/api/execute-sql.js` - PostgreSQL query execution endpoint using PGlite

### Data
- `src/data/challenges.js` - Database of regex and PostgreSQL challenges

## Setup & Running

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 16** - React framework with API routes
- **React 18** - UI library
- **PGlite** - Real PostgreSQL running in WebAssembly
- **Turbopack** - Fast bundler for development

## Future Migration Path

This app is designed to easily migrate to Go services + real PostgreSQL:

```
Current:  React → Next.js API Routes → PGlite
Future:   React → Next.js API Routes → Go Service → PostgreSQL
```

SQL queries remain identical, only the execution layer changes.

## API Endpoints

### POST `/api/execute-sql`

Execute a PostgreSQL query using PGlite.

**Request Body:**
```json
{
  "setupSQL": "CREATE TABLE users (id INT, name TEXT); INSERT INTO users VALUES (1, 'Alice');",
  "userQuery": "SELECT * FROM users;"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Alice" }
  ]
}
```

Or on error:
```json
{
  "success": false,
  "error": "syntax error at or near ..."
}
```

## License

MIT
