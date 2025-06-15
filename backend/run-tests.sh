#!/bin/bash

echo "🧪 Starting Backend Test Suite"
echo "================================"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Install test dependencies
echo "📦 Installing test dependencies..."
npm install --save-dev jest supertest mongodb-memory-server @types/jest cross-env @faker-js/faker

echo ""
echo "🏃‍♂️ Running all tests..."
echo "========================"

# Run all tests
npm test

echo ""
echo "📊 Generating coverage report..."
echo "==============================="

# Run tests with coverage
npm run test:coverage

echo ""
echo "✅ Test suite completed!"
echo "📁 Coverage report available in: coverage/lcov-report/index.html"
echo ""
echo "🔍 Test commands available:"
echo "  npm test              - Run all tests"
echo "  npm run test:watch    - Run tests in watch mode"
echo "  npm run test:coverage - Run tests with coverage"
echo "  npm run test:verbose  - Run tests with verbose output"
