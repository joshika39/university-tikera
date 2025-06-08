import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {ApiResponse, Booking} from '@/types';

type Movie = {
  id: number;
  title: string;
  description: string;
  duration: number;
  genre: string;
  release_year: number;
  image_path: string;
};

export type Screening = {
  id: number;
  room: {
    rows: number;
    seatsPerRow: number;
  };
  start_time: string;
  bookings: Booking[];
};

type CreateMoviePayload = Omit<Movie, 'id'>;
type UpdateMoviePayload = Partial<CreateMoviePayload> & { id: number };

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (build) => ({
    createMovie: build.mutation<ApiResponse<Movie>, CreateMoviePayload>({
      query: (movie) => ({
        url: 'movies',
        method: 'POST',
        body: movie,
      }),
    }),
    updateMovie: build.mutation<ApiResponse<Movie>, UpdateMoviePayload>({
      query: ({ id, ...rest }) => ({
        url: `movies/${id}`,
        method: 'PUT',
        body: rest,
      }),
    }),
    deleteMovie: build.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `movies/${id}`,
        method: 'DELETE',
      }),
    }),
    createScreening: build.mutation<ApiResponse<Screening>, FormData>({
      query: (formData) => ({
        url: 'screenings',
        method: 'POST',
        body: formData,
      }),
    }),
    updateScreening: build.mutation<ApiResponse<Screening>, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `screenings/${id}`,
        method: 'PUT',
        body: formData,
      }),
    }),
    deleteScreening: build.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `screenings/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useCreateScreeningMutation,
  useUpdateScreeningMutation,
  useDeleteScreeningMutation,
} = adminApi;