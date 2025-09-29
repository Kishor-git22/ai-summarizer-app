import { describe, test, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Demo from '../../components/Demo'
import { LOCALSTORAGE_ARTICLES_KEY } from '../../constants'

// Mock the clipboard API globally
beforeAll(() => {
  // Mock clipboard API with proper permission
  const mockClipboard = {
    writeText: vi.fn().mockImplementation((text) => {
      console.log('Clipboard writeText called with:', text);
      return Promise.resolve();
    }),
    readText: vi.fn().mockResolvedValue('')
  };
  
  Object.defineProperty(navigator, 'clipboard', {
    value: mockClipboard,
    writable: true,
    configurable: true
  });
  
  // Make sure the clipboard is available in the global scope
  global.navigator.clipboard = mockClipboard;
})

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

  describe('Viewing article history', () => {
    const mockArticles = [
      { url: 'https://example.com/1', summary: 'First article summary' },
      { url: 'https://example.com/2', summary: 'Second article summary' }
    ]

    beforeEach(() => {
      // Mock localStorage with some articles
      window.localStorage.setItem(LOCALSTORAGE_ARTICLES_KEY, JSON.stringify(mockArticles))
    })

    test('displays previously summarized articles with their URLs', async () => {
      // Mock the API to not be fetching
      const { useLazyGetSummaryQuery } = await import('../../services/article')
      useLazyGetSummaryQuery.mockReturnValue([
        vi.fn(),
        { isFetching: false, data: null, error: null }
      ])

      render(<Demo />)

      // Wait for the component to load and render
      await screen.findByText(mockArticles[0].url)

      // Check that all articles are displayed
      mockArticles.forEach(article => {
        const articleElement = screen.getByText(article.url)
        expect(articleElement).toBeInTheDocument()
        expect(articleElement).toHaveClass('text-blue-500')
        expect(articleElement).toHaveAttribute('title', article.url)
        expect(articleElement.closest('.link_card')).toBeInTheDocument()
      })

      // Check that the copy button exists for each article
      const copyButtons = screen.getAllByRole('button', { name: /copy to clipboard/i })
      expect(copyButtons).toHaveLength(mockArticles.length)
    })

    test('clicking on an article loads its summary', async () => {
      const { useLazyGetSummaryQuery } = await import('../../services/article')
      useLazyGetSummaryQuery.mockReturnValue([
        vi.fn(),
        { isFetching: false, data: null, error: null }
      ])

      render(<Demo />)
      const user = userEvent.setup()

      // Find and click the first article
      const firstArticle = await screen.findByText(mockArticles[0].url)
      await user.click(firstArticle)

      // Verify the article's summary is displayed
      expect(screen.getByText(mockArticles[0].summary)).toBeInTheDocument()
    })
  })

  describe('Copying an article URL to clipboard', () => {
    const mockArticles = [
      { url: 'https://example.com/1', summary: 'First article summary' }
    ]
  
    beforeEach(() => {
      // Mock localStorage
      window.localStorage.setItem(LOCALSTORAGE_ARTICLES_KEY, JSON.stringify(mockArticles))
      
      // Mock clipboard
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    })
  
    afterEach(() => {
      vi.restoreAllMocks()
    })
  
    test('copies article URL to clipboard and shows confirmation', async () => {
      // Setup test
      const { useLazyGetSummaryQuery } = await import('../../services/article')
      useLazyGetSummaryQuery.mockReturnValue([
        vi.fn(),
        { isFetching: false, data: null, error: null }
      ])

      render(<Demo />)
      const user = userEvent.setup()

      // Wait for and find the article
      const articleElement = await screen.findByText(mockArticles[0].url)
      const articleCard = articleElement.closest('.link_card')
      const copyButton = articleCard.querySelector('.copy_btn')
      expect(copyButton).toBeInTheDocument()

      // Click the copy button
      await user.click(copyButton)

      // Verify clipboard was called with the correct URL
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockArticles[0].url)

      // Wait for the UI to update after the state change
      const tickIcon = await screen.findByRole('img', { name: 'Copied' })
      
      // Verify UI shows copied state
      expect(tickIcon).toBeInTheDocument()
      
      // Get the image element inside the button
      const imgElement = copyButton.querySelector('img')
      
      // Verify the image has the correct attributes
      expect(imgElement).toHaveAttribute('src', expect.stringContaining('tick'))
      expect(imgElement).toHaveAttribute('alt', 'Copied')
      expect(imgElement).toHaveAttribute('title', 'Copied')
    })
  })
});
