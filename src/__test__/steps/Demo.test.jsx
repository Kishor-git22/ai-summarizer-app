import { describe, test, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import React from 'react'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { toast } from 'react-toastify'
import Demo from '../../components/Demo'
import { LOCALSTORAGE_ARTICLES_KEY } from '../../constants'

// Mock the clipboard API globally
beforeAll(() => {
  const mockClipboard = {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue('')
  }

  Object.defineProperty(navigator, 'clipboard', {
    value: mockClipboard,
    writable: true,
    configurable: true
  })
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
      dispatchEvent: vi.fn()
    }))
  })

  // Mock window.scrollTo
  window.scrollTo = vi.fn()

  // Clear localStorage before each test
  window.localStorage.clear()
})

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
  cleanup()
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

// Helper function
const setup = () => {
  render(<Demo />)
  const user = userEvent.setup()
  const input = screen.getByPlaceholderText(/Paste the Article Link/i)
  const button = screen.getByRole('button', { name: /summarize article/i })
  return { user, input, button }
}

describe('Demo Component', () => {
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

  describe('Submitting an invalid URL', () => {
    test('shows error message and does not make API call', async () => {
      const mockToastError = vi.fn()
      toast.error = mockToastError

      const mockGetSummary = vi.fn()
      const { useLazyGetSummaryQuery } = await import('../../services/article')
      useLazyGetSummaryQuery.mockReturnValue([mockGetSummary, { isFetching: false }])

      const { user, input, button } = setup()

      await user.type(input, 'not-a-valid-url')
      await user.click(button)

      expect(mockToastError).toHaveBeenCalledWith('Invalid URL')
      expect(mockGetSummary).not.toHaveBeenCalled()
    })
  })

  describe('Submitting a valid URL', () => {
    test('calls API, shows summary and toast', async () => {
      const mockToastSuccess = vi.fn()
      toast.success = mockToastSuccess

      const { useLazyGetSummaryQuery } = await import('../../services/article')
      const mockGetSummary = vi
        .fn()
        .mockResolvedValue({ data: { summary: 'This is a test summary.' } })
      useLazyGetSummaryQuery.mockReturnValue([
        mockGetSummary,
        { isFetching: false, data: { summary: 'This is a test summary.' }, error: null }
      ])

      const { user, input, button } = setup()

      await user.type(input, 'https://example.com/article')
      await user.click(button)

      expect(mockGetSummary).toHaveBeenCalledWith({ articleUrl: 'https://example.com/article' })
      expect(await screen.findByText(/This is a test summary./i)).toBeInTheDocument()
      expect(mockToastSuccess).toHaveBeenCalledWith('Article Summarized')

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
      window.localStorage.setItem(LOCALSTORAGE_ARTICLES_KEY, JSON.stringify(mockArticles))
    })

    test('displays history items with copy buttons', async () => {
      const { useLazyGetSummaryQuery } = await import('../../services/article')
      useLazyGetSummaryQuery.mockReturnValue([
        vi.fn(),
        { isFetching: false, data: null, error: null }
      ])

      render(<Demo />)
      await screen.findByText(mockArticles[0].url)

      mockArticles.forEach(article => {
        const articleElement = screen.getByText(article.url)
        expect(articleElement).toBeInTheDocument()
        expect(articleElement).toHaveClass('text-blue-500')
        expect(articleElement).toHaveAttribute('title', article.url)
      })

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

      const firstArticle = await screen.findByText(mockArticles[0].url)
      await user.click(firstArticle)
      expect(screen.getByText(mockArticles[0].summary)).toBeInTheDocument()
    })
  })

  describe('Copying an article URL', () => {
    const mockArticles = [{ url: 'https://example.com/1', summary: 'First article summary' }]

    beforeEach(() => {
      window.localStorage.setItem(LOCALSTORAGE_ARTICLES_KEY, JSON.stringify(mockArticles))
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    test('copies article URL and updates UI', async () => {
      const { useLazyGetSummaryQuery } = await import('../../services/article')
      useLazyGetSummaryQuery.mockReturnValue([
        vi.fn(),
        { isFetching: false, data: null, error: null }
      ])

      render(<Demo />)
      const user = userEvent.setup()

      const articleElement = await screen.findByText(mockArticles[0].url)
      const articleCard = articleElement.closest('.link_card')
      const copyButton = articleCard.querySelector('.copy_btn')
      expect(copyButton).toBeInTheDocument()

      await user.click(copyButton)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockArticles[0].url)
      const tickIcon = await screen.findByRole('img', { name: 'Copied' })
      expect(tickIcon).toBeInTheDocument()
    })
  })
})
