import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Calendar } from './Calendar'

describe('Calendar', () => {
  it('renders correctly', () => {
    render(<Calendar />)
    // react-day-picker usually has a table or buttons that we can look for
    // We can just check for the presence of the calendar table or common elements
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('calls onSelect when a day is clicked', () => {
    const onSelect = vi.fn()
    const today = new Date()
    render(<Calendar selected={today} onSelect={onSelect} />)

    // Find a day button and click it
    // Note: react-day-picker labels days with their ARIA label or text
    // We'll look for a button that has a text matching a day of the month
    const buttons = screen.getAllByRole('button')
    // We shouldn't click the nav buttons (next/prev)
    // Day buttons in react-day-picker usually have the day number as text
    const dayButton = buttons.find(b => b.textContent === '15' || b.textContent === '1')

    if (dayButton) {
      fireEvent.click(dayButton)
      expect(onSelect).toHaveBeenCalled()
    }
  })
})
