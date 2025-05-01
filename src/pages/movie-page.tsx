import {useParams} from "react-router";

type Params = {
  screening?: string
}

export default function ScreeningPage() {
  const {screening} = useParams<Params>();

  if (!screening) {
    return <div>Select a screening</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Screening {screening}
      </h1>
      <div className="text-2xl">
        {/* Add your screening details here */}
      </div>
    </div>
  )
}