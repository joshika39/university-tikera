import {useParams} from "react-router";
import Seats from "@/components/seats.tsx";
import {getMovieScreeningById} from "@/lib/resources.ts";

type Params = {
  day?: string
  movie?: string
  screening?: string
}

export default function ScreeningPage() {
  const {movie: movieId, day, screening: screeningId} = useParams<Params>();

  if (!movieId || !day || !screeningId) {
    return <div>Select a screening</div>
  }

  const screening = getMovieScreeningById(parseInt(movieId), parseInt(screeningId));

  if (!screening) {
    return <div>Screening not found</div>
  }

  return (
    <div className="flex flex-col gap-4 border rounded-lg w-full h-full p-4">
      <Seats rows={screening.room.rows} seatsPerRow={screening.room.seatsPerRow} initBookings={screening.room.bookings}/>
    </div>
  )
}