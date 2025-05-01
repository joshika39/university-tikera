import {Booking} from "@/types.ts";
import Seat from "@/components/seat.tsx";
import {cn} from "@/lib/utils.ts";

type SeatsProps = {
  rows: number;
  seatsPerRow: number;
  initBookings: Booking[];
  className?: string;
  onClick?: (row: number, seat: number) => void;
}

const convertBookings = (bookings: Booking[], rows: number, seatsPerRow: number): Booking[][] => {
  const convertedBookings: Booking[][] = Array.from({length: rows}, () => Array(seatsPerRow).fill(null));
  bookings.forEach(booking => {
    convertedBookings[booking.row - 1][booking.seat - 1] = booking;
  });
  return convertedBookings;
}

export default function Seats({rows, seatsPerRow, initBookings, className, onClick}: SeatsProps) {
  const bookings = convertBookings(initBookings, rows, seatsPerRow);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({length: rows}).map((_, row) => (
        <div key={row} className="flex flex-row gap-2">
          {Array.from({length: seatsPerRow}).map((_, seat) => (
            <Seat
              key={seat}
              row={row}
              seat={seat}
              booked={!!bookings[row][seat]}
              onClick={onClick}
            />
          ))}
        </div>
      ))}
    </div>
  )
}