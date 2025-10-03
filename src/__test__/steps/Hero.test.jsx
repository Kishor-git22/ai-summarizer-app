import React from 'react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Hero from '../../components/Hero'
// Mock constants
const PROJECT_NAME = 'Summarizer'
const PROJECT_GITHUB_LINK = 'https://github.com/Kishor-git22/ai-summarizer-app'
const HERO_TITLE_LEFT = 'Summarize your Article with our'
const HERO_TITLE_RIGHT = 'Summarizer'
const HERO_SUBTITLE_LEFT = 'Turn long articles into short, easy-to-read summaries with'
const HERO_SUBTITLE_RIGHT = 'clear, quick, and open-source.'

describe('Hero Component', () => {
  beforeEach(() => {
    // mock window.open
    vi.spyOn(window, 'open').mockImplementation(() => null)
  })

  // Scenario: Display brand logo
  test('renders the brand logo with correct attributes', () => {
    render(<Hero />)
    const logoImg = screen.getByAltText(PROJECT_NAME)

    expect(logoImg).toBeInTheDocument()
    expect(logoImg).toHaveAttribute('alt', PROJECT_NAME)
    expect(logoImg).toHaveAttribute('draggable', 'false')
  })

  // Scenario: Display GitHub button
  test('renders the GitHub button and opens link on click', () => {
    render(<Hero />)
    const githubButton = screen.getByRole('button', { name: /Github/i })

    expect(githubButton).toBeInTheDocument()
    expect(githubButton).toHaveAttribute('title', 'View Source Code')

    fireEvent.click(githubButton)
    expect(window.open).toHaveBeenCalledWith(PROJECT_GITHUB_LINK, '_blank')
  })

  // Scenario: Display Hero title
  test('renders the Hero title correctly', () => {
    render(<Hero />)

    // Check the complete title text
    const titleElement = screen.getByRole('heading', { level: 1 })
    expect(titleElement).toHaveTextContent(`${HERO_TITLE_LEFT} ${HERO_TITLE_RIGHT}`)

    // Check if the gradient span is present in the title
    const gradientSpan = titleElement.querySelector('span[class*="bg-clip-text"]')
    expect(gradientSpan).toBeInTheDocument()
  })

  // Scenario: Display Hero subtitle
  test('renders the Hero subtitle correctly', () => {
    render(<Hero />)

    // Get the subtitle element
    const subtitleElement = screen.getByRole('heading', { level: 2 })

    // Check that the subtitle contains all the required text
    expect(subtitleElement).toHaveTextContent(HERO_SUBTITLE_LEFT)
    expect(subtitleElement).toHaveTextContent(PROJECT_NAME)
    expect(subtitleElement).toHaveTextContent(HERO_SUBTITLE_RIGHT)

    // Check for the specific styled project name
    const projectNameElement = screen.getByText(PROJECT_NAME, { selector: 'span.font-semibold' })
    expect(projectNameElement).toBeInTheDocument()
    expect(projectNameElement).toHaveClass('bg-clip-text')
  })
})
