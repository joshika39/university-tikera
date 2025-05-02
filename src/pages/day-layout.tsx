import {NavLink, Outlet, useParams} from "react-router";
import {getMoviesByDay} from "@/lib/resources.ts";
import {cn} from "@/lib/utils.ts";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area.tsx";
import {useIsMobile} from "@/hooks/use-mobile.ts";

type Params = {
  day: string;
  movie?: string;
}

export default function DayLayout() {
  const {day, movie: movieId} = useParams<Params>();

  const isMobile = useIsMobile();

  if (!day) {
    return null;
  }

  const movies = getMoviesByDay(day);

  const moviesList = (
    <ScrollArea className="w-full md:h-[calc(100vh-200px)]">
      <ul className="flex flex-row md:flex-wrap gap-4">
        {movies.map((movie) => (
          <NavLink
            to={`/${day}/${movie.id}`}
            className={({isActive}) => cn(
              "transition-all p-4 bg-accent rounded-lg shadow-md border",
              "hover:bg-accent/50 hover:border-accent/50",
              isActive && "bg-primary/20 border-primary/60 hover:border-primary/50 hover:bg-primary/30",
            )}
            key={movie.id}
          >
            <li key={movie.id} className="flex flex-col gap-2 w-36 md:w-48">
              <img
                src={`/images/${movie.image}`}
                alt={movie.title}
                className="object-cover rounded-lg w-full h-52 md:h-64 shadow-lg"
              />
              <div className="flex flex-col gap-2">
                <p className="text-sm text-accent-foreground truncate font-semibold">
                  {movie.title}
                </p>
                <div className="flex flex-row gap-2">
                  <p className="text-sm text-muted-foreground">
                    {movie.genre}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {movie.duration} min
                  </p>
                </div>
              </div>
            </li>
          </NavLink>
        ))}
      </ul>
      <ScrollBar orientation="horizontal"/>
    </ScrollArea>
  )

  const getContent = () => {
    if (movieId && isMobile) {
      return (
        <Outlet/>
      )
    }

    return (
      <>
        {moviesList}
        <Outlet/>
      </>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-primary">
        {day?.charAt(0).toUpperCase() + day?.slice(1)}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 h-full">
        {getContent()}
      </div>
    </>
  )
}