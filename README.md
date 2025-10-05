# AI Summarizer App

A powerful web application that leverAGES AI to generate concise and accurate summaries of text content. Perfect for students, researchers, and professionals who need to quickly understand long documents, articles, or research papers.

## Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [CI/CD Pipeline](#ci-cd-pipeline)

## Introduction

AI Summarizer is designed to help users quickly extract key information from large blocks of text using advanced natural language processing. Whether you're a student trying to summarize research papers or a professional looking to quickly understand lengthy documents, our AI-powered tool provides accurate and coherent summaries in seconds.

## Tech Stack

### Frontend

- **React 19** - For building interactive user interfaces
- **Redux Toolkit** - For state management
- **React Toastify** - For user notifications
- **Tailwind CSS** - For modern, responsive design
- **Vite** - Build tool and development server
- **MSW (Mock Service Worker)** - For API mocking in development and testing

### Development Tools

- **Vitest** - Fast testing framework
- **Cucumber** - For Behavior-Driven Development (BDD) testing
- **ESLint** - For code quality and best practices
- **Prettier** - For consistent code formatting
- **GitHub Actions** - For CI/CD pipeline
- **Vercel** - For deployment and hosting

### Testing Stack

- **Vitest** - Unit and integration testing
- **Testing Library** - For component testing
- **Cucumber** - For BDD-style acceptance tests
- **MSW** - For mocking API responses in tests

## Features

- **Text Summarization**: Generate concise summaries of any text input
- **Multiple Length Options**: Choose from different summary lengths
- **Save & Organize**: Save your summaries for future reference
- **Responsive Design**: Works on all devices
- **Export Options**: Download summaries as text or markdown
- **API Integration**: Seamless integration with OpenAI's API

## Quick Start

1. **Prerequisites**
   - Node.js (v16 or later)
   - npm or yarn
   - OpenAI API key

2. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ai-summarizer-app.git
   cd ai-summarizer-app
   ```

3. **Install dependencies**

   ```bash
   npm install
   # or
   yarn
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory and add:

   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

```
├── src/
│   ├── __mocks__/      # Mock data and modules for testing
│   ├── __test__/       # Test files (including features/ and steps/ directories)
│   ├── assets/         # Static assets (images, icons, etc.)
│   ├── components/     # Reusable UI components
│   ├── constants/      # Application constants
│   ├── services/       # API and service layer
│   ├── App.css         # Main styles
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point (using Vite + React)
├── public/             # Public assets
├── .babelrc            # Babel configuration
├── .env                # Environment variables
├── .prettierrc         # Code formatting rules
├── vitest.config.js    # Test configuration
└── package.json        # Project dependencies and scripts
```

## Development

- **Run development server**:

  ```bash
  npm run dev
  ```

- **Run tests**:

  ```bash
  npm test
  ```

- **Run tests with coverage**:

  ```bash
  npm run test:coverage
  ```

- **Build for production**:
  ```bash
  npm run build
  ```

## CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow that runs on every pull request to the `main` branch. The pipeline includes:

- **Dependency Installation**: Installs all project dependencies
- **Code Formatting**: Verifies code follows Prettier rules
- **Linting**: Runs ESLint to check for code quality issues
- **Gherkin Linting**: Validates BDD feature files syntax and style
- **Build**: Compiles and builds the project
- **Testing**: Runs the complete test suite
- **Test Coverage**: Generates and reports test coverage metrics

To run these checks locally:

```bash
# Run tests with coverage
npm run test:coverage

# Run the development server
npm run dev

# Build for production
npm run build
```

## Testing

The project uses Vitest for testing with the following structure:

- `__test__/features/` - Feature test files
- `__test__/steps/` - Step definitions for BDD-style tests
- `__mocks__/` - Mock data and modules for testing
