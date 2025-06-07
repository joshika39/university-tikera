
export type ApiResponse<T> = {
  data: T;
  status: string;
  message: string;
};

export type Booking = {
  row: number;
  seat: number;
}

export type ScreeningResponse = {
  id: number;
  room: {
    rows: number,
    seatsPerRow: number
  },
  start_time: string,
  date: string,
  week_number: number,
  week_day: number,
  bookings: Booking[];
}

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export const weekDays: WeekDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export type Screening = {
  id: number;
  room: {
    rows: number;
    seatsPerRow: number;
    weekday: WeekDay;
    startTime: string;
    bookings: Booking[];
  }
}

export type MovieResponse = {
  id: number;
  title: string;
  description: string;
  image_path: string;
  duration: number;
  genre: string;
  release_year: number;
  screenings: ScreeningResponse[];
}

export type Movie = {
  id: number;
  title: string;
  description: string;
  image: string;
  genre: string;
  duration: number;
  releaseYear: number;
  screenings: Screening[];
}