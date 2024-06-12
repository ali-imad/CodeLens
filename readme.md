# CodeLens

## Team members

- Ali Hasan
- Benny Li
- Malkeet Singh
- Polina Sorokvashina
- Tony Chen

## Project Description

CodeLens is a web application designed to enhance novice programmers' learning and understanding of code. The application presents users with code samples and requires them to provide plain English descriptions of the code's functionality. It leverages the LLM Ollama to generate new code based on the provided descriptions and compares it against the original code using pre-written test cases. Students receive feedback on their descriptions and can iteratively refine their explanations to improve their comprehension skills.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Features

- **Hint System:** Provides hints to students struggling with code samples.
- **Code Comparison Tool:** Allows students to compare their descriptions with corrected versions side-by-side.
- **Interactive Tutorials:** Includes short tutorials on common programming concepts.
- **Progress Analytics:** Instructors can view student progress and identify areas needing improvement.
- **Custom Questions:** Instructors can implement their own code snippets and test cases.

## Installation

### Prerequisites

- Node.js (version v21.5.0)
- Vite

### Clone the Repository

```bash
git clone https://github.students.cs.ubc.ca/CPSC310-2024S/Project-Groups-07-Lab-B.git
```

## Setup

### Installation

Have two separate terminals, one for front end and one for back end.

```bash
cd backend
npm install
npm start
```

```bash
cd frontend
npm install
npm run dev
```

Create a .env file in the backend directory and configure environment variables (e.g., database connection string, port).

# Backend .env.example

DB_CONNECTION_STRING=mongodb://localhost:27017/codelens
PORT=3000

# Frontend .env.example

REACT_APP_BACKEND_URL=http://localhost:3000
