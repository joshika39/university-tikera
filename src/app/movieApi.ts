import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {ApiResponse, Movie, MovieResponse, Screening, ScreeningResponse} from '@/types'
import { weekDays } from '@/types'

const parseScreening = (screening: ScreeningResponse): Screening => ({
  id: screening.id,
  room: {
    rows: screening.room.rows,
    seatsPerRow: screening.room.seatsPerRow,
    weekday: weekDays[screening.week_day - 1],
    startTime: screening.start_time,
    bookings: screening.bookings.map((booking) => ({
      row: booking.row,
      seat: booking.seat,
    })),
  },
});

const parseMovie = (movie: MovieResponse): Movie => ({
  id: movie.id,
  title: movie.title,
  description: movie.description,
  image: movie.image_path,
  genre: movie.genre,
  duration: movie.duration,
  releaseYear: movie.release_year,
  screenings: movie.screenings.map(parseScreening).sort((s1, s2) => {
    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
    return toMinutes(s1.room.startTime) - toMinutes(s2.room.startTime);
  }),
});

const dayMap: Record<string, number> = {
  "sunday": 7,
  "monday": 1,
  "tuesday": 2,
  "wednesday": 3,
  "thursday": 4,
  "friday": 5,
  "saturday": 6,
}

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (build) => ({
    getMovies: build.query<Movie[], void>({
      query: () => `movies`,
    }),
    getMoviesByWeek: build.query<Movie[], string>({
      query: (week) => `movies/week?week_number=${week}`,
      transformResponse: (response: ApiResponse<MovieResponse[]>): Movie[] => {
        if (response.status !== 'success') {
          throw new Error(response.message)
        }
        return response.data.map(parseMovie);
      }
    }),
    getMovieById: build.query<Movie | undefined, {id: string, week: string, day: string}>({
      query: ({id}) => `movies/${id}`,
      transformResponse: (response: ApiResponse<MovieResponse>, _, arg): Movie | undefined => {
        if (response.status !== 'success') {
          throw new Error(response.message)
        }

        const movie = response.data;

        movie.screenings = movie.screenings.filter(
          (screening) => (
            screening.week_number === parseInt(arg.week) &&
              screening.week_day === dayMap[arg.day]
          )
        );

        return parseMovie(movie);
      }
    }),
    getScreeningById: build.query<Screening | undefined, string>({
      query: (id) => `screenings/${id}`,
      transformResponse: (response: ApiResponse<ScreeningResponse>): Screening | undefined => {
        if (response.status !== 'success') {
          throw new Error(response.message)
        }

        const screening = response.data;
        return screening ? parseScreening(screening) : undefined;
      }
    }),
  }),
})

export const { useGetMoviesQuery, useGetMoviesByWeekQuery, useGetMovieByIdQuery, useGetScreeningByIdQuery } = movieApi
