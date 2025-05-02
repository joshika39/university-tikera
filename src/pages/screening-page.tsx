import {useParams} from "react-router";
import Seats from "@/components/seats.tsx";
import {getMovieById, getMovieScreeningById} from "@/lib/resources.ts";
import {Separator} from "@/components/ui/separator.tsx";
import TicketCountSelect from "@/components/ticket-count-select.tsx";
import {useCallback, useEffect, useState} from "react";
import {Booking} from "@/types.ts";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";

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
  const [seatDiff, setSeatDiff] = useState(0);

  const {movie: movieId, day, screening: screeningId} = useParams<Params>();

  useEffect(() => {
    setSelectedSeats([]);
    setStudentTickets(0);
    setAdultTickets(0);
    setSeniorTickets(0);
  }, [movieId, day, screeningId]);

  useEffect(() => {
    const totalTickets = studentTickets + adultTickets + seniorTickets;
    setSeatDiff(totalTickets - selectedSeats.length);
  }, [studentTickets, adultTickets, seniorTickets, selectedSeats]);

  useEffect(() => {
    if (seatDiff < 0) {
      setSelectedSeats(selectedSeats.slice(seatDiff));
    }
  }, [selectedSeats, studentTickets, adultTickets, seniorTickets, seatDiff]);

  const successfulSelection = useCallback(() => {
    return selectedSeats.length === (studentTickets + adultTickets + seniorTickets) && selectedSeats.length > 0;
  }, [selectedSeats, studentTickets, adultTickets, seniorTickets]);

  if (!movieId || !day || !screeningId) {
    return <h2>Select a screening</h2>
  }

  const movie = getMovieById(parseInt(movieId), day);
  const screening = getMovieScreeningById(parseInt(movieId), parseInt(screeningId));

  if (!screening || !movie) {
    return <h2>Screening not found</h2>
  }

  const _onSeatSelect = (selected: Booking[]) => {
    if (studentTickets + adultTickets + seniorTickets <= 0) {
      return;
    }

    setSelectedSeats(selected);
  }

  return (
    <div className="flex flex-col gap-4 transition-all">
      <Card className="bg-linear-to-bl from-card via-70% via-card to-primary/10">
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>
            Select the number of tickets you want to purchase.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-8">
              <TicketCountSelect label="Student" price={2000} onChange={setStudentTickets}/>
              <TicketCountSelect label="Adult" price={2500} onChange={setAdultTickets}/>
              <TicketCountSelect label="Senior" price={1800} onChange={setSeniorTickets}/>
            </div>
            {studentTickets + adultTickets + seniorTickets > 0 && (<>
              <Separator/>
              <div className="flex flex-col gap-2">
                {seatDiff > 0 && (
                  <p className="text-sm text-accent-foreground">
                    Select {seatDiff} more seats
                  </p>
                )}
              </div>
            </>)}
          </div>
          <Seats
            className="flex-1"
            rows={screening.room.rows}
            seatsPerRow={screening.room.seatsPerRow}
            bookedSeats={screening.room.bookings}
            selected={selectedSeats}
            disabled={studentTickets + adultTickets + seniorTickets <= 0}
            setSelected={_onSeatSelect}
          />
        </CardContent>
      </Card>
      {successfulSelection() && (
        <Card className="bg-linear-to-bl from-card via-50% via-card to-primary/10">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
            <CardDescription>
              Review your booking before confirming.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-semibold">
                {movie.title}
              </h3>
              <h4 className="text-lg font-semibold">
                {screening.room.weekday} {screening.room.startTime}
              </h4>
              {studentTickets > 0 && (
                <div className="flex flex-row gap-2 justify-between">
                  <p className="text-sm text-muted-foreground">
                    {studentTickets} x Student ticket
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {studentTickets * 2000} HUF
                  </p>
                </div>
              )}
              {adultTickets > 0 && (
                <div className="flex flex-row gap-2 justify-between">
                  <p className="text-sm text-muted-foreground">
                    {adultTickets} x Adult ticket
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {adultTickets * 2500} HUF
                  </p>
                </div>
              )}
              {seniorTickets > 0 && (
                <div className="flex flex-row gap-2 justify-between">
                  <p className="text-sm text-muted-foreground">
                    {seniorTickets} x Senior ticket
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {seniorTickets * 1800} HUF
                  </p>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Total: {((studentTickets * 2000) + (adultTickets * 2500) + (seniorTickets * 1800)).toLocaleString("hu-HU", {
                style: "currency",
                currency: "HUF",
              })}
              </p>
              <Separator/>
              <div className="flex flex-row gap-2">
                <p className="text-sm text-muted-foreground">
                  Selected seats:
                </p>
                {selectedSeats.map((seat) => (
                  <p key={`${seat.row}-${seat.seat}`} className="text-sm text-muted-foreground">
                    {String.fromCharCode(65 + seat.row)}{seat.seat + 1}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => alert("Booking confirmed!")}
            >
              Confirm Booking
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}