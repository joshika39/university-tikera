import {NavLink, Outlet, useParams} from "react-router";
import {badgeVariants} from "@/components/ui/badge";
import {useGetMovieByIdQuery, useGetMoviesByWeekQuery} from "@/app/movieApi";
import {LoaderCircle} from "lucide-react";
import {useAppSelector} from "@/app/hooks";
import {EditMovieDialog} from "@/components/forms/EditMovieDialog";
import {Movie} from "@/types";
import {useAuth} from "@/hooks/use-auth";

type Params = {
  day?: string
  movie?: string
}

const getPayload = (movie: Movie) => {
  return {
    id: movie.id,
    title: movie.title,
    description: movie.description,
    image_path: movie.image,
    genre: movie.genre,
    duration: movie.duration,
    release_year: movie.releaseYear,
  }
}

export default function MoviePage() {
  const {isAdmin} = useAuth();
  const {currentWeek} = useAppSelector(state => state.app)
  const {movie: movieId, day} = useParams<Params>();

  const payload = {
    id: movieId || "",
    week: currentWeek,
    day: day || "",
  }

  const {data: movie, isLoading, refetch} = useGetMovieByIdQuery(payload, {
    skip: !movieId,
  });

  const {refetch: refetchAll} = useGetMoviesByWeekQuery(currentWeek);

  if (isLoading) {
    return <div className="flex items-center justify-center w-full">
      <LoaderCircle className="animate-spin size-8"/>
    </div>
  }

  if(!movieId) {
    return <div>
      Select a movie from the list to view details.
    </div>
  }

  if (!movie || !movieId) {
    return <div>Movie not found</div>
  }

  const _refetch = () => {
    refetch();
    refetchAll();
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8 rounded-lg w-full h-full py-4 md:p-4">
      {isAdmin && <EditMovieDialog movie={getPayload(movie)} onClose={_refetch}/>}
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