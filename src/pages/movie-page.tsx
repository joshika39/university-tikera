import {NavLink, Outlet, useParams} from "react-router";
import {badgeVariants} from "@/components/ui/badge";
import {useGetMovieByIdQuery} from "@/app/movieApi";
import {LoaderCircle} from "lucide-react";
import {useAppSelector} from "@/app/hooks";

type Params = {
  day?: string
  movie?: string
}

export default function MoviePage() {
  const { currentWeek } = useAppSelector(state => state.app)
  const {movie: movieId, day} = useParams<Params>();

  const {data: movie, isLoading} = useGetMovieByIdQuery({id: movieId || "", week: currentWeek}, {
    skip: !movieId,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center w-full">
      <LoaderCircle className="animate-spin size-8"/>
    </div>
  }

  if (!movie) {
    return <div>Movie not found</div>
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8 rounded-lg w-full h-full py-4 md:p-4">
      <div className="flex flex-row gap-2">
        <img
          src={movie.image}
          alt={movie.title}
          className="object-cover rounded-lg w-36 md:w-48 h-52 md:h-64 shadow-lg"
        />
        <div className="flex flex-col gap-2 p-4 pb-0">
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
          <div className="flex flex-row flex-wrap gap-2 mt-auto">
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
      <Outlet/>
    </div>
  )
}