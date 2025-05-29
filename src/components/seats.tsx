import {Booking} from "@/types";
import Seat from "@/components/seat";
import {cn} from "@/lib/utils";

type SeatsProps = {
  rows: number;
  seatsPerRow: number;
  bookedSeats: Booking[];
  disabled?: boolean;
  selected?: Booking[];
  setSelected?: (seats: Booking[]) => void;
  className?: string;
}

const convertBookings = (bookings: Booking[], rows: number, seatsPerRow: number): Booking[][] => {
  const convertedBookings: Booking[][] = Array.from({length: rows}, () => Array(seatsPerRow).fill(null));
  bookings.forEach(booking => {
    convertedBookings[booking.row - 1][booking.seat - 1] = booking;
  });
  return convertedBookings;
}

export default function Seats({rows, seatsPerRow, bookedSeats, selected, disabled, setSelected, className}: SeatsProps) {
  const bookings = convertBookings(bookedSeats, rows, seatsPerRow);

  const _onClick = (row: number, seat: number) => {
    if (setSelected) {
      const newSelected = selected ? [...selected] : [];
      const index = newSelected.findIndex((s) => s.row === row && s.seat === seat);
      if (index !== -1) {
        newSelected.splice(index, 1);
      } else {
        newSelected.push({row, seat});
      }
      setSelected(newSelected);
    }
  }


  return (
    <div className={cn("flex flex-col gap-2 items-center", className)}>
      <div className="flex flex-row gap-2">
        {Array.from({length: seatsPerRow + 1}).map((_, seat) => {
          if (seat === 0) {
            return <div key={seat} className="text-sm w-6 sm:w-8 text-center text-muted-foreground">Row</div>
          }
          return <div key={seat} className="text-sm w-6 sm:w-8 text-center text-muted-foreground">
            {seat}
          </div>
        })}
      </div>
      {Array.from({length: rows}).map((_, row) => (
        <div key={row} className="flex flex-row gap-2">
          {Array.from({length: seatsPerRow + 1}).map((_, seat) => {
            if (seat === 0) {
              return <div
                key={seat}
                className="text-sm w-6 sm:w-8 text-center text-muted-foreground flex items-center justify-center"
              >
                {String.fromCharCode(65 + row)}
              </div>
            }
            return <Seat
              key={seat}
              row={row}
              disabled={disabled}
              seat={seat}
              selected={!!selected?.find((s) => s.row === row && s.seat === seat)}
              booked={!!bookings[row][seat]}
              onClick={_onClick}
            />
          })}
        </div>
      ))}
    </div>
  )
}