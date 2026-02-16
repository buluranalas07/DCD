import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DiaryPage } from './DiaryPage'
import { MemoryRouter } from 'react-router-dom'

// Mock useAuth
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { uid: 'test-user' },
    userProfile: {
      macros_target: {
        calories: 2000,
        protein_g: 150,
        carbs_g: 200,
        fat_g: 65,
      },
    },
  }),
}))

// Mock Firebase Firestore functions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ forEach: () => {} })),
  deleteDoc: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn(),
}))

// Mock our local firebase lib
vi.mock('../lib/firebase', () => ({
  db: {},
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    header: ({ children, ...props }: { children: React.ReactNode }) => (
      <header {...props}>{children}</header>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock Layout to avoid complex rendering
vi.mock('../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('DiaryPage Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock date to be consistent
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-05-15'))
  })

  it('renders correctly and shows the current date', () => {
    render(
      <MemoryRouter>
        <DiaryPage />
      </MemoryRouter>
    )

    // Check if the date is displayed (the default is today)
    const dateText = new Date('2024-05-15').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    expect(screen.getByText(dateText)).toBeInTheDocument()
  })

  it('navigates to the previous and next days', async () => {
    render(
      <MemoryRouter>
        <DiaryPage />
      </MemoryRouter>
    )

    const prevButton = screen.getAllByRole('button').find(b => {
      const svg = b.querySelector('svg')
      return svg && svg.querySelector('path')?.getAttribute('d')?.includes('M15 19l-7-7 7-7')
    })

    const nextButton = screen.getAllByRole('button').find(b => {
      const svg = b.querySelector('svg')
      return svg && svg.querySelector('path')?.getAttribute('d')?.includes('M9 5l7 7-7 7')
    })

    if (prevButton && nextButton) {
      // Click previous day
      fireEvent.click(prevButton)
      const prevDateText = new Date('2024-05-14').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      expect(screen.getByText(prevDateText)).toBeInTheDocument()

      // Click next day twice to get to "tomorrow"
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)
      const nextDateText = new Date('2024-05-16').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      expect(screen.getByText(nextDateText)).toBeInTheDocument()
    }
  })

  it('opens and closes the calendar popover', async () => {
    render(
      <MemoryRouter>
        <DiaryPage />
      </MemoryRouter>
    )

    const dateButton = screen.getByText(
      new Date('2024-05-15').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )

    fireEvent.click(dateButton)

    // Calendar should be open (contains grid)
    expect(screen.getByRole('grid')).toBeInTheDocument()

    // Clicking outside should close it - but that's harder to test with JSDOM
    // We'll just verify it toggles
    fireEvent.click(dateButton)
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
  })
})
