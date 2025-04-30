import {Outlet, useParams} from "react-router";

type Params = {
  day: string
}

export default function DayLayout() {
  const { day } = useParams<Params>();
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Day {day}
      </h1>
      <div className="text-2xl">
        <Outlet />
      </div>
    </div>
  )
}