// Simple test setup without MongoDB Memory Server
// Tests will use the existing database connection

// Increase timeout for API operations
jest.setTimeout(30000);

// Mock console.log to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error, // Keep error logs for debugging
};
