import {useParams} from "react-router";
import Seats from "@/components/seats.tsx";
import {getMovieScreeningById} from "@/lib/resources.ts";
import {Separator} from "@/components/ui/separator.tsx";
import TicketCountSelect from "@/components/ticket-count-select.tsx";
import {useState} from "react";
import {Booking} from "@/types.ts";

type Params = {
  day?: string
  movie?: string
  screening?: string
}

export default function ScreeningPage() {
  const [selectedSeats, setSelectedSeats] = useState<Booking[]>([]);

  const [studentTickets, setStudentTickets] = useState(0);
  const [adultTickets, setAdultTickets] = useState(0);
  const [seniorTickets, setSeniorTickets] = useState(0);

  const {movie: movieId, day, screening: screeningId} = useParams<Params>();

  if (!movieId || !day || !screeningId) {
    return <div>Select a screening</div>
  }

  const screening = getMovieScreeningById(parseInt(movieId), parseInt(screeningId));

  if (!screening) {
    return <div>Screening not found</div>
  }

  const _onSeatSelect = (row: number, seat: number) => {
    const seatIndex = selectedSeats.findIndex((s) => s.row === row && s.seat === seat);
    if (seatIndex > -1) {
      setSelectedSeats(selectedSeats.filter((_, index) => index !== seatIndex));
    } else {
      setSelectedSeats([...selectedSeats, {row, seat}]);
    }
  }

  const seatDiff = () => {
    const totalSeats = studentTickets + adultTickets + seniorTickets;
    const selectedSeatsCount = selectedSeats.length;
    return totalSeats - selectedSeatsCount;
  }

  return (
    <div className="flex flex-row gap-4 border rounded-lg w-full h-full p-4">
      <div className="flex flex-col gap-8 flex-1">
        <TicketCountSelect label="Student" price={2000} onChange={setStudentTickets}/>
        <TicketCountSelect label="Adult" price={2500} onChange={setAdultTickets}/>
        <TicketCountSelect label="Senior" price={1800} onChange={setSeniorTickets}/>
        <Separator/>
        <div className="flex flex-col gap-2">
          {seatDiff() > 0 && (
            <p className="text-sm text-accent-foreground">
              Select {seatDiff()} more seats
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Total: {((studentTickets * 2000) + (adultTickets * 2500) + (seniorTickets * 1800)).toLocaleString("hu-HU", {
            style: "currency",
            currency: "HUF",
          })}
          </p>
        </div>
      </div>
      <Separator orientation="vertical" className="hidden md:block flex-none"/>
      <Seats
        onClick={_onSeatSelect}
        className="flex-1"
        rows={screening.room.rows}
        seatsPerRow={screening.room.seatsPerRow}
        initBookings={screening.room.bookings}
      />
    </div>
  )
}