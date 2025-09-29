import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Demo from '../../components/Demo'
import { LOCALSTORAGE_ARTICLES_KEY } from '../../constants'

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
}))

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    dismiss: vi.fn()
  },
  ToastContainer: vi.fn(() => null)
}))

// Mock next/head
vi.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => <>{children}</>
  }
})

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
      dispatchEvent: vi.fn()
    }))
  })

  // Mock window.scrollTo
  window.scrollTo = vi.fn()

  // Mock localStorage
  const localStorageMock = (() => {
    let store = {}
    return {
      getItem: vi.fn(key => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = value.toString()
      }),
      removeItem: vi.fn(key => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        store = {}
      })
    }
  })()

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  })
})

afterEach(() => {
  vi.clearAllMocks()
  cleanup()

  if (window.localStorage) {
    window.localStorage.clear()
  }

  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

/**
 * Helper function to render Demo and return user + DOM elements
 */
const setup = () => {
  render(<Demo />)
  const user = userEvent.setup()
  const input = screen.getByPlaceholderText(/Paste the Article Link/i)
  const button = screen.getByRole('button', { name: /summarize article/i })
  return { user, input, button }
}

describe('Demo Component', () => {
  describe('Submitting an invalid URL', () => {
    test('shows error message and does not make API call when invalid URL is submitted', async () => {
      const mockToastError = vi.fn()
      const { toast } = await import('react-toastify')
      toast.error = mockToastError

      const mockGetSummary = vi.fn()
      const { useLazyGetSummaryQuery } = await import('../../services/article')
      useLazyGetSummaryQuery.mockReturnValue([mockGetSummary, { isFetching: false }])

      const { user, input, button } = setup()

      // Enter invalid URL and submit
      await user.type(input, 'not-a-valid-url')
      await user.click(button)

      // Verify error toast was shown with the correct message
      expect(mockToastError).toHaveBeenCalledWith('Invalid URL')

      // Verify no API call was made
      expect(mockGetSummary).not.toHaveBeenCalled()
    })
  })
  describe('Viewing the initial page', () => {
    test('renders the input field with correct placeholder', () => {
      const { input } = setup()
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'url')
    })

    test('renders the submit button with correct title', () => {
      const { button } = setup()
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('title', 'Summarize Article')
    })
  })
  describe('Submitting a valid URL', () => {
    test('calls API, shows loading, and renders summary on success', async () => {
      const { toast } = await import('react-toastify')
      const mockToastSuccess = vi.fn()
      toast.success = mockToastSuccess

      const { useLazyGetSummaryQuery } = await import('../../services/article')

      // Mock returning data object
      const mockGetSummary = vi.fn(() => ({ data: { summary: 'This is a test summary.' } }))
      useLazyGetSummaryQuery.mockReturnValue([
        mockGetSummary,
        { isFetching: false, data: null, error: null }
      ])

      render(<Demo />)
      const input = screen.getByPlaceholderText(/Paste the Article Link/i)
      const button = screen.getByRole('button', { name: /summarize article/i })
      const user = userEvent.setup()

      await user.type(input, 'https://example.com/article')
      await user.click(button)

      // Verify API call
      expect(mockGetSummary).toHaveBeenCalledWith({ articleUrl: 'https://example.com/article' })

      // Verify summary appears
      expect(await screen.findByText(/This is a test summary./i)).toBeInTheDocument()

      // Verify toast
      expect(mockToastSuccess).toHaveBeenCalledWith('Article Summarized')

      // Verify localStorage
      const history = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_ARTICLES_KEY) || '[]')
      expect(history.some(item => item.url === 'https://example.com/article')).toBe(true)
    })
  })
})
