import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {ApiResponse} from '@/types';

type Seat = {
  row: number;
  number: number;
};

export type TicketType = {
  type: string;
  quantity: number;
};

type CreateBookingPayload = {
  screening_id: number;
  seats: Seat[];
  ticket_types: TicketType[];
};

type Booking = {
  id: number;
  screening_id: number;
  user_id: number;
  seats: Seat[];
  ticket_types: TicketType[];
  created_at: string;
  updated_at: string;
};

export type QuerySeat = {
  row: number;
  seat: number;
}

export type QueryRoom = {
  id: number;
  name: string;
  rows: number;
  seats_per_row: number;
  description: string | null;
  updated_at: string;
  created_at: string;
}

export  type QueryMovie = {
  id: number;
  title: string;
  description: string;
  image_path: string;
  duration: number;
  genre: string;
  release_year: number;
  updated_at: string;
  created_at: string;
}

export type QueryScreening = {
  id: number;
  movie_id: number;
  room_id: number;
  start_time: string;
  date: string;
  week_number: number;
  week_day: number;
  updated_at: string;
  created_at: string;
  movie: QueryMovie;
  room: QueryRoom;
}

export type QueryBooking = {
  id: number;
  user_id: number;
  screening_id: number;
  total_price: string;
  status: number;
  created_at: string;
  updated_at: string;
  seats: QuerySeat[];
  ticket_types: TicketType[];
  screening: QueryScreening;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        headers.set('Authorization', `Bearer ${parsedUser.token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (build) => ({
    createBooking: build.mutation<ApiResponse<Booking>, CreateBookingPayload>({
      query: (body) => ({
        url: 'bookings',
        method: 'POST',
        body,
      }),
    }),
    getBookings: build.query<QueryBooking[], void>({
      query: () => ({
        url: 'bookings',
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<QueryBooking[]>) => {
        if (response.status === "success") {
          return response.data.sort((b1, b2) =>
            new Date(b1.screening.start_time).getTime() - new Date(b2.screening.start_time).getTime()
          );        }

        return [];
      }
    }),
  }),
});

export const {useCreateBookingMutation, useGetBookingsQuery} = userApi;