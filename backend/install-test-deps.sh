#!/bin/bash
# Install all testing dependencies

echo "Installing Jest and testing dependencies..."

npm install --save-dev \
  jest \
  supertest \
  mongodb-memory-server \
  @types/jest \
  jest-environment-node \
  cross-env \
  faker \
  bcryptjs

echo "Testing dependencies installed successfully!"
echo "Run 'npm test' to execute tests"
