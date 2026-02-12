import React from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
}

export const Calendar: React.FC<CalendarProps> = ({ selected, onSelect }) => {
  return (
    <div className="calendar-custom flex justify-center items-center w-full">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        numberOfMonths={1}
        className="p-4"
        classNames={{
          months: 'flex',
          month: 'space-y-4',
          caption: 'flex justify-between items-center mb-4 px-2',
          caption_label: 'text-base font-semibold text-zinc-50',
          nav: 'flex items-center gap-2',
          nav_button:
            'h-8 w-8 bg-zinc-800 hover:bg-orange-500/20 border border-zinc-700 hover:border-orange-500/50 p-0 rounded transition-all inline-flex items-center justify-center text-zinc-50 hover:text-orange-500',
          nav_button_previous: '',
          nav_button_next: '',
          table: 'w-full border-collapse',
          head_row: 'flex mb-2',
          head_cell: 'text-zinc-300 rounded-md w-9 font-medium text-[0.8rem] text-center',
          row: 'flex w-full mt-1',
          cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-orange-500/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-orange-500/10 hover:text-orange-500 rounded-md transition-colors text-zinc-200',
          day_selected:
            'bg-orange-500 text-black hover:bg-orange-600 hover:text-black focus:bg-orange-500 focus:text-black font-bold',
          day_today: 'bg-orange-500/20 text-orange-500 border border-orange-500/50 font-semibold',
          day_outside: 'text-zinc-500 opacity-40',
          day_disabled: 'text-zinc-600 opacity-30',
          day_range_middle: 'aria-selected:bg-orange-500/10 aria-selected:text-orange-500',
          day_hidden: 'invisible',
        }}
      />

      <style>{`
        .calendar-custom .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: rgb(39 39 42);
        }
        .calendar-custom .rdp-button:focus-visible {
          outline: 2px solid rgb(249 115 22);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
