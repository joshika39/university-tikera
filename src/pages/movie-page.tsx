import {NavLink, Outlet, useParams} from "react-router";
import {getMovieById} from "@/lib/resources.ts";
import {badgeVariants} from "@/components/ui/badge.tsx";

type Params = {
  day?: string
  movie?: string
}

export default function MoviePage() {
  const {movie: movieId, day} = useParams<Params>();

  if (!movieId) {
    return <div>Select a screening</div>
  }

  const movie = getMovieById(parseInt(movieId), day);

  if (!movie) {
    return <div>Movie not found</div>
  }

  return (
    <div className="flex flex-col gap-4 border rounded-lg w-full h-full p-4">
      <div className="flex flex-row gap-4">
        <img
          src={`/images/${movie.image}`}
          alt={movie.title}
          className="object-cover rounded-lg w-48 h-64"
        />
        <div className="flex flex-col gap-2 p-4">
          <h1 className="text-2xl font-semibold">
            {movie.title}
          </h1>
          <div className="flex flex-row gap-2">
            <p className="text-sm text-muted-foreground">
              {movie.genre}
            </p>
            <p className="text-sm text-muted-foreground">
              {movie.releaseYear}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {movie.description}
          </p>
          <div className="flex flex-row gap-2 p-4">
            {movie.screenings.map((screening) => (
              <NavLink
                to={`/${day}/${movie.id}/${screening.id}`}
                className={({isActive}) => badgeVariants({variant: isActive ? "secondary" : "default"})}
                key={screening.id}
              >
                {screening.room.startTime}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <div className="text-2xl">
        <Outlet/>
      </div>
    </div>
  )
}