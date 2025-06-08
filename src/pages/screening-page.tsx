import {Link, useParams} from "react-router";
import Seats from "@/components/seats";
import {Separator} from "@/components/ui/separator";
import TicketCountSelect from "@/components/ticket-count-select";
import {useCallback, useEffect, useState} from "react";
import {Booking} from "@/types";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {toast} from "sonner";
import {useGetMovieByIdQuery} from "@/app/movieApi";
import {LoaderCircle} from "lucide-react";
import {useAuth} from "@/hooks/use-auth";
import {TicketType, useCreateBookingMutation, useGetBookingsQuery} from "@/app/userApi";
import {useAppSelector} from "@/app/hooks";

type Params = {
  day?: string
  movie?: string
  screening?: string
}

export default function ScreeningPage() {
  const {isLoggedIn} = useAuth();
  const { currentWeek } = useAppSelector(state => state.app);
  const [selectedSeats, setSelectedSeats] = useState<Booking[]>([]);
  const [studentTickets, setStudentTickets] = useState(0);
  const [adultTickets, setAdultTickets] = useState(0);
  const [seniorTickets, setSeniorTickets] = useState(0);
  const [seatDiff, setSeatDiff] = useState(0);

  const [createBooking, {isLoading}] = useCreateBookingMutation();
  const { refetch: bookingRefetch } = useGetBookingsQuery();

  const {screening: screeningId, movie: movieId, day} = useParams<Params>();

  useEffect(() => {
    setSelectedSeats([]);
    setStudentTickets(0);
    setAdultTickets(0);
    setSeniorTickets(0);
  }, [screeningId]);

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
  const payload = {
    id: movieId || "",
    week: currentWeek,
    day: day || "",
  }
  const {data: movie, isLoading: isMovieLoading, refetch} = useGetMovieByIdQuery(payload, {
    skip: !movieId,
  });

  const screening = movie?.screenings?.filter((s) => s.id.toString() === screeningId)?.[0];

  if (!screening) {
    return <h2>Screening not found</h2>
  }

  const _onSeatSelect = (selected: Booking[]) => {
    if (studentTickets + adultTickets + seniorTickets <= 0) {
      return;
    }
    setSelectedSeats(selected);
  }

  if (isMovieLoading) {
    return <div className="flex items-center justify-center w-full">
      <LoaderCircle className="animate-spin size-8"/>
    </div>
  }

  const book = async () => {
    if (!screeningId) {
      return;
    }

    const ticketTypes: TicketType[] = [];
    if (studentTickets > 0) {
      ticketTypes.push({
        type: "student",
        quantity: studentTickets,
      })
    }
    if (adultTickets > 0) {
      ticketTypes.push({
        type: "normal",
        quantity: adultTickets,
      })
    }
    if (seniorTickets > 0) {
      ticketTypes.push({
        type: "senior",
        quantity: seniorTickets,
      })
    }

    const seats = selectedSeats.map(s => ({
      row: s.row + 1,
      number: s.seat,
    }));

    try {
      await createBooking({
        screening_id: parseInt(screeningId),
        seats: seats,
        ticket_types: ticketTypes,
      }).unwrap();

      toast.success("Booking successfully created!");

      refetch();
      bookingRefetch();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      if (error?.data?.message) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        toast.error(error?.data?.message);
      } else {
        console.error(error);
      }
    }
  }

  const confirmContent = !isLoggedIn ? (
    <>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
        <CardDescription>
          Review your booking before confirming.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center w-full">
          <Link to="/login" className={buttonVariants()}>
            You need to log in
          </Link>
        </div>
      </CardContent>
    </>
  ) : (
    <>
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
        <Button onClick={book} disabled={isLoading}>
          Confirm Booking
        </Button>
      </CardFooter>
    </>
  )

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
              <TicketCountSelect label="Student" price={2000} value={studentTickets} onChange={setStudentTickets}/>
              <TicketCountSelect label="Adult" price={2500} value={adultTickets} onChange={setAdultTickets}/>
              <TicketCountSelect label="Senior" price={1800} value={seniorTickets} onChange={setSeniorTickets}/>
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
          {confirmContent}
        </Card>
      )}
    </div>
  )
}