# CISC 593 Unit Test Report

A Node.js Express.js application for tracking and reporting unit tests.

## Initial Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager (v10.32.1 or higher)

### Installation

1. Clone or navigate to the project directory:
```bash
cd cisc-593-unit-test-report
```

2. Install dependencies:
```bash
pnpm install
```

## Running the Project

### Development Mode
To run the project in development mode with automatic reload on file changes:
```bash
pnpm dev
```

The server will start on `http://localhost:3000`


## Running Tests

### Run All Tests
To run all unit tests:
```bash
pnpm test
```

### Run Tests With Coverage
To run all tests and generate a coverage report:
```bash
pnpm coverage
```

The coverage report will be generated and displayed in the console.

## Project Structure

- `index.js` - Main application entry point with Express server setup
- `features/` - Feature modules (e.g., `record-expense.js`)
- `package.json` - Project dependencies and scripts

## Available Endpoints


## Technologies Used

- **Express.js** - Web framework for Node.js
- **Vitest** - Unit testing framework
- **Nodemon** - Development tool for auto-reloading
- **Zod** - TypeScript-first schema validation
- **TypeScript** - Type safety support
