import {Route, Routes} from "react-router";
import {RootLayout} from "@/layouts/root-layout";
import {RedirectToToday} from "@/components/redirect-to-today";
import DayLayout from "@/pages/day-layout";
import MoviePage from "@/pages/movie-page";
import ScreeningPage from "@/pages/screening-page";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout/>}>
        <Route index element={<RedirectToToday/>}/>
        <Route path=":day" element={<DayLayout />}>
          <Route path=":movie?" element={<MoviePage />}>
            <Route path=":screening?" element={<ScreeningPage />}/>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}