# CodeLens

## Team members

- Ali Hasan
- Benny Li
- Malkeet Singh
- Polina Sorokvashina
- Tony Chen

## Project Description

CodeLens is a web application designed to enhance novice programmers' learning
and understanding of code. The application presents users with code samples and
requires them to provide plain English descriptions of the code's functionality.
It leverages the LLM Ollama to generate new code based on the provided
descriptions and compares it against the original code using pre-written test
cases. Students receive feedback on their descriptions and can iteratively
refine their explanations to improve their comprehension skills.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technical Details](#technical-details)
- [Key Functionalities](#key-functionalities)
- [Development Practices](#development-practices)
- [Testing](#testing)

## Features

- **Hint System:** Provides hints to students struggling with code samples.
- **Code Comparison Tool:** Allows students to compare their descriptions with
  corrected versions side-by-side.
- **Progress Analytics:** Instructors can view student progress and identify
  areas needing improvement.
- **Custom Questions:** Instructors can implement their own code snippets and
  test cases.

## Installation

### Prerequisites

- Node.js (version v20.15.1)
- Vite
- Docker Desktop

### Clone the Repository

```bash
git clone https://github.students.cs.ubc.ca/CPSC310-2024S/Project-Groups-07-Lab-B.git
```

### Docker Compose

Ensure Docker Desktop is installed and running on your system. Provide Docker
with at least 10 GB of system memory to adequately run the large language model.

To build and run the application using Docker, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your system.

2. Clone this repository to your local machine.

3. From the root directory of the project, run the following command:

```bash
docker compose up --build
```

This command will build the Docker images and start the containers as defined in
the `compose.yaml` file.

4. Once the build process is complete and the containers are running, you can
   access the application at:
   
   http://localhost:5173/

5. To stop the application and remove the containers, use:

```bash
docker compose down
```

## Prettier Configuration

Ensure code consistency and quality by running Prettier. Turn format on autosave
ON.

```bash
npx prettier --write .
```

## Usage

Once the setup is complete and both servers are running, you can access the
application through your web browser. The backend should be running on
`http://localhost:3000`, and the frontend on `http://localhost:5173`

## Technical Details

### Technology Stack

#### Language

- **TypeScript:** A super set of JavaScript with type checking. TypeScript will
  be used on both the front and back end of the application.

#### Frontend

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool and development server.
- **Tailwind CSS:** A utility-first CSS framework for styling.

#### Backend

- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express:** A web application framework for Node.js.
- **MongoDB:** A NoSQL database for storing application data.
- **Mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js.

### Containerization

- **Docker:** Used for containerizing the application to ensure consistency
  across different environments.

## Key Functionalities

### Code Evaluation

- **LLM Ollama Integration:** Leverages LLM Ollama to generate code based on
  user descriptions.
- **Test Case Execution:** Compares generated code against original code using
  pre-written test cases to provide feedback.

### User Interaction

- **Real-Time Feedback:** Provides instant feedback on user descriptions to
  facilitate learning.

### Instructor Tools

- **Customizable Content:** Allows instructors to upload custom code snippets
  and test cases.
- **Analytics Dashboard:** Displays student performance metrics to help
  instructors tailor their teaching strategies.

## Development Practices

### Version Control

- The project utilizes Git for version control with a repository hosted on
  GitHub. Branching and pull requests are used for feature development and bug
  fixes.

### Code Quality

- **Linting and Formatting:** Uses Prettier and ESLint to ensure consistent code
  quality and style.
- **Unit Testing:** This project uses Mocha and Chai for unit testing.
- **Integration Testing:** Integration tests are written to ensure that the
  frontend and backend components work together as expected.

### Deployment

- The application is designed to be deployed using Docker so that it can be run
  on any local environment.

## Testing

### Frontend Testing
- Refer to the [Frontend Testing Guide](./frontEndTesting.md) for instructions
  on testing the front-end

### Backend Testing
1. This project uses Mocha and Chai for back-end testing, run at the command line.
2. To run the tests, first ensure the backend server is running. The simplest way to do this is to deploy the application via Docker Compose
```bash
# Cleans, builds and runs the application using Docker Compose
docker compose down && docker compose build && docker compose up
````

3. Next, navigate to the `backend` directory.
```bash
cd backend
```
3. Run the following command to download any dependencies
```bash
npm install
```

4. Finally, run the tests using the following command
```bash
npm test
```

Note that, due to LLM processing time, tests regarding the "attempts" route may fail due to timeout. The LLM service was not tested extensively for this reason, as well. If the LLM service is not running, all tests can be expected to pass.
