import React from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  modifiers?: Record<string, Date[]>
  modifiersClassNames?: Record<string, string>
}

export const Calendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  modifiers,
  modifiersClassNames,
}) => {
  return (
    <div className="w-full overflow-hidden">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        numberOfMonths={1}
        fixedWeeks
        showOutsideDays
        className="!m-0 p-2 sm:p-3"
        classNames={{
          months: 'flex flex-col',
          month: 'space-y-3',
          caption: 'flex justify-between items-center mb-2 px-1',
          caption_label: 'text-sm sm:text-base font-semibold text-zinc-50',
          nav: 'flex items-center gap-1',
          nav_button:
            'h-7 w-7 sm:h-8 sm:w-8 bg-zinc-800 hover:bg-orange-500/20 border border-zinc-700 hover:border-orange-500/50 p-0 rounded transition-all inline-flex items-center justify-center text-zinc-50 hover:text-orange-500',
          nav_button_previous: '',
          nav_button_next: '',
          table: 'w-full border-collapse',
          head_row: '',
          head_cell: 'text-zinc-400 font-medium text-[0.7rem] sm:text-xs text-center w-8 sm:w-9',
          row: '',
          cell: 'text-center p-0 relative',
          day: 'h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal text-xs sm:text-sm hover:bg-orange-500/10 hover:text-orange-500 rounded-md transition-colors text-zinc-200',
          day_selected:
            'bg-orange-500 text-black hover:bg-orange-600 hover:text-black focus:bg-orange-500 focus:text-black font-bold',
          day_today: 'bg-orange-500/20 text-orange-500 border border-orange-500/50 font-semibold',
          day_outside: 'text-zinc-500 opacity-40',
          day_disabled: 'text-zinc-600 opacity-30 cursor-not-allowed',
          day_range_middle: 'aria-selected:bg-orange-500/10 aria-selected:text-orange-500',
          day_hidden: 'invisible',
        }}
      />

      <style>{`
        /* Override react-day-picker CSS variables for mobile-first sizing */
        .rdp {
          --rdp-cell-size: 2rem; /* 32px for mobile (h-8 w-8) */
        }
        
        @media (min-width: 640px) {
          .rdp {
            --rdp-cell-size: 2.25rem; /* 36px for desktop (h-9 w-9) */
          }
        }
        
        /* Ensure table cells don't exceed size */
        .rdp-cell {
          width: var(--rdp-cell-size);
          height: var(--rdp-cell-size);
        }
        
        /* Custom hover states */
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: rgb(39 39 42);
        }
        
        .rdp-button:focus-visible {
          outline: 2px solid rgb(249 115 22);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
