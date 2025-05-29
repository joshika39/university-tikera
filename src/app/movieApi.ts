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
  screenings: movie.screenings.map(parseScreening)
});

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
    getMovieById: build.query<Movie | undefined, string>({
      query: (id) => `movies/${id}`,
      transformResponse: (response: ApiResponse<MovieResponse>): Movie | undefined => {
        if (response.status !== 'success') {
          throw new Error(response.message)
        }

        const movie = response.data;
        return movie ? parseMovie(movie) : undefined;
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
