import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Movie } from '@/types'

type MovieResponse = {
  data: Movie[]
  status: string
  message: string
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
      transformResponse: (response: MovieResponse): Movie[] => {
        console.log('Response from API:', response);
        if (response.status !== 'success') {
          throw new Error(response.message)
        }
        return response.data;
      }
    }),
  }),
})

export const { useGetMoviesQuery, useGetMoviesByWeekQuery } = movieApi
