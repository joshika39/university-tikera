import {Route, Routes} from "react-router";
import {RootLayout} from "@/layouts/root-layout.tsx";
import {RedirectToToday} from "@/components/redirect-to-today.tsx";
import DayLayout from "@/pages/day-layout.tsx";
import MoviePage from "@/pages/movie-page.tsx";
import ScreeningPage from "@/pages/screening-page.tsx";

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