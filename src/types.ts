
export type Booking = {
  row: number;
  seat: number;
}

export type Screening = {
  id: number;
  room: {
    rows: number;
    seatsPerRow: number;
    weekday: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    startTime: string;
    bookings: Booking[];
  }
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