import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Demo from '../../components/Demo';

// Mock the API service
vi.mock('../../services/article', () => ({
  useLazyGetSummaryQuery: vi.fn().mockReturnValue([
    vi.fn(),
    { 
      data: null, 
      isFetching: false,
      error: null
    }
  ])
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    dismiss: vi.fn(),
  },
  ToastContainer: vi.fn(() => null),
}));

// Mock next/head
vi.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => <>{children}</>,
  };
});

// Set up mocks before each test
beforeEach(() => {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock window.scrollTo
  window.scrollTo = vi.fn();

  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: vi.fn((key) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  cleanup();
  
  if (window.localStorage) {
    window.localStorage.clear();
  }
  
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

describe('Demo Component', () => {
  describe('Viewing the initial page', () => {
    test('renders the input field with correct placeholder', () => {
      render(<Demo />);
      
      const inputElement = screen.getByPlaceholderText(/Paste the Article Link/i);
      expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'url');
  });

  test('renders the submit button with correct title', () => {
    render(<Demo />);
    
    const buttonElement = screen.getByRole('button', { name: /summarize article/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('title', 'Summarize Article');
  });
});
});
