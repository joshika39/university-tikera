import {NavLink, Outlet, useParams} from "react-router";
import {getMoviesByDay} from "@/lib/resources.ts";
import {cn} from "@/lib/utils.ts";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

type Params = {
  day: string
}

export default function DayLayout() {
  const {day} = useParams<Params>();

  if (!day) {
    return null;
  }

  const movies = getMoviesByDay(day);

  return (
    <>
      <h1 className="text-3xl font-bold text-primary">
        {day?.charAt(0).toUpperCase() + day?.slice(1)}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <ul className="flex flex-wrap gap-4 mt-4">
              {movies.map((movie) => (
                <NavLink
                  to={`/${day}/${movie.id}`}
                  className={({isActive}) => cn(
                    "p-4 bg-accent rounded-lg shadow-md border",
                    isActive && "bg-primary/20 border-primary/60",
                  )}
                  key={movie.id}
                >
                  <li key={movie.id} className="flex flex-col gap-2 w-48">
                    <img
                      src={`/images/${movie.image}`}
                      alt={movie.title}
                      className="object-cover rounded-lg w-full h-64"
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
          </ScrollArea>
        </div>
        <div>
          <Outlet/>
        </div>
      </div>
    </>
  )
}