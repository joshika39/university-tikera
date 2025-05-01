import {useParams} from "react-router";

type Params = {
  day?: string
  movie?: string
  screening?: string
}

export default function ScreeningPage() {
  const {movie: movieId, day, screening} = useParams<Params>();

  return (
    <div className="flex flex-col gap-4 border rounded-lg w-full h-full p-4">
      <h1 className="text-3xl font-bold underline">
        {day} - {movieId} - {screening}
      </h1>
    </div>
  )
}