# Test Case Generator

[![CI Pipeline](https://github.com/Djones-qa/test-case-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/Djones-qa/test-case-generator/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![Jest](https://img.shields.io/badge/Jest-29-red.svg)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Automated test case generation engine - analyzes source code to produce boundary value tests, equivalence partitions, edge cases, and BDD Gherkin scenarios. Systematically generates the tests you didn't think to write.

## Features

- **Function Signature Parsing** - Extract functions, params, types from TypeScript source
- **Boundary Value Analysis** - Generate min, max, zero, empty, overflow test inputs
- **Equivalence Partitioning** - Group inputs into valid/invalid classes with representatives
- **Edge Case Generation** - Null, undefined, type coercion, special chars, concurrent scenarios
- **BDD Gherkin Output** - Generate Given/When/Then scenarios for each function
- **Test Suite Orchestration** - Combine all generators into comprehensive test suites
- **Coverage Gap Detection** - Identify untested paths and missing scenarios

## How It Works

```
Source Code -> Function Parser -> [Boundary Analysis      ]
                                  [Equivalence Partitioning]  -> Test Suite
                                  [Edge Case Generator     ]
                                  [BDD Scenario Builder    ]
```

## Example

Input (source code):

```typescript
function calculateDiscount(price: number, memberLevel: string): number {
  // ...
}
```

Output (generated test cases):

- **Boundary:** price=0, price=-1, price=MAX_SAFE_INTEGER, price=NaN
- **Equivalence:** price negative (invalid), price zero (boundary), price positive (valid)
- **Edge Cases:** price=null, price=undefined, memberLevel=""
- **BDD:** Given a price of 100 and memberLevel "gold", When calculateDiscount is called, Then returns discounted price
## Project Structure

```
test-case-generator/
├── src/
│   ├── analysis/
│   │   ├── parser.ts          # Function signature extraction
│   │   └── index.ts
│   ├── generators/
│   │   ├── boundary.ts        # Boundary value analysis
│   │   ├── edge-cases.ts      # Edge case generation
│   │   ├── equivalence.ts     # Equivalence partitioning
│   │   ├── bdd.ts             # BDD Gherkin scenarios
│   │   └── index.ts
│   ├── engine/
│   │   ├── orchestrator.ts    # Test suite orchestration
│   │   └── index.ts
│   ├── api/
│   │   └── server.ts          # Express API server
│   ├── config/
│   │   ├── loader.ts          # Configuration loading
│   │   ├── logger.ts          # Winston logger
│   │   ├── defaults.ts        # Default values
│   │   └── index.ts
│   └── index.ts               # CLI entry point
├── tests/
│   └── unit/
│       ├── analysis/
│       │   └── parser.test.ts
│       └── generators/
│           ├── boundary.test.ts
│           ├── edge-cases.test.ts
│           └── equivalence.test.ts
├── .github/
│   └── workflows/
│       └── ci.yml
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
├── jest.config.ts
├── .eslintrc.json
├── .prettierrc
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0

### Installation

```bash
git clone https://github.com/Djones-qa/test-case-generator.git
cd test-case-generator
npm install
```

### Build

```bash
npm run build
```

### Run (CLI Mode)

```bash
npm start
```

### Run (API Server)

```bash
npm start -- serve
```

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run with coverage
npm run test:coverage

# Run linter
npm run lint
```

## CLI Usage

```bash
# Show sample output with demonstration code
npm start

# Start the API server on port 3009
npm start -- serve

# Development mode with hot reload
npm run dev
```
## Boundary Value Analysis

| Type | Generated Values |
|------|-----------------|
| `number` | 0, -1, 1, MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, NaN |
| `string` | empty (""), single char, 1000-char string, special chars |
| `array` | empty [], single element, 1000-element array |
| `boolean` | true, false |

## Equivalence Partitioning

| Type | Valid Classes | Invalid Classes |
|------|-------------|-----------------|
| `number` | negative, zero, positive | NaN, undefined |
| `string` | empty, short, medium, long, special-chars | non-string value |
| `boolean` | true, false | non-boolean value |
| `array` | empty, single, multiple | non-array value |

## Edge Case Categories

| Category | Description | Example |
|----------|-------------|---------|
| `null-input` | Null/undefined parameters | `fn(null)`, `fn(undefined)` |
| `empty-input` | Empty values | `fn("")`, `fn([])` |
| `overflow` | Numeric overflow | `fn(Infinity)`, `fn(-Infinity)` |
| `special-chars` | Injection and encoding | SQL injection, XSS payloads |
| `type-coercion` | Wrong type passed | `fn("42")` for number param |
| `concurrent` | Race conditions | Multiple async calls |

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3009` | Server port |
| `NODE_ENV` | `development` | Environment |
| `LOG_LEVEL` | `info` | Logging level |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service health check |
| POST | `/api/generate` | Generate test cases from source code |

### POST /api/generate

**Request:**

```json
{
  "code": "function add(a: number, b: number): number { return a + b; }"
}
```

**Response:**

```json
{
  "suites": [...],
  "total": 1
}
```

## CI/CD Pipeline

1. **Lint & Type Check** - ESLint + TypeScript compiler validation
2. **Unit Tests** - Jest with coverage reporting
3. **Docker Build** - Multi-stage build with container health verification

## Docker

```bash
# Build and run with Docker Compose
docker compose up -d

# Build manually
docker build -t test-case-generator .
docker run -p 3009:3009 test-case-generator
```

## Author

**Darrius Jones**

- GitHub: [@Djones-qa](https://github.com/Djones-qa)
- LinkedIn: [darrius-jones-28226b350](https://www.linkedin.com/in/darrius-jones-28226b350)

## License

MIT - 2026 Darrius Jones

See [LICENSE](./LICENSE) for details.