import data from '@/assets/movies.json';
import {Booking, Movie, Screening} from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseBooking = (booking: any): Booking => {
  return {
    row: booking.row,
    seat: booking.seat
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseScreening = (screening: any): Screening => {
  return {
    id: screening.id,
    room: {
      rows: screening.room.rows,
      seatsPerRow: screening.room.seatsPerRow,
      weekday: screening.weekday,
      startTime: screening.start_time,
      bookings: screening.bookings.map(parseBooking)
    }
  }
}

const sortScreenings = (a: Screening, b: Screening) => {
  const aDate = new Date(`2023-10-01T${a.room.startTime}`);
  const bDate = new Date(`2023-10-01T${b.room.startTime}`);
  return aDate.getTime() - bDate.getTime();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseMovie = (movie: any): Movie => {
  return {
    id: movie.id,
    title: movie.title,
    description: movie.description,
    image: movie.image,
    genre: movie.genre,
    duration: movie.duration,
    releaseYear: movie.release_year,
    screenings: (movie.screenings.map(parseScreening)).sort(sortScreenings)
  }
}

/**
 * Parses the data from the @/assets/movies.json file and returns an array of movies.
 */
export const getMovies = () => {
  const movies: Movie[] = [];
  for (const movie of data) {
    movies.push(parseMovie(movie));
  }
  return movies;
}

export const getMoviesByDay = (day: string) => {
  const movies = getMovies();
  return movies.filter(movie => {
    return movie.screenings.some(screening => screening.room.weekday.toLowerCase() === day);
  });
}

export const getMovieById = (id: number, weekday?: string) => {
  const movies = getMovies();
  const movie = movies.find(movie => movie.id === id);
  if (!movie) {
    return null;
  }

  if (weekday) {
    movie.screenings = movie.screenings.filter(screening => screening.room.weekday.toLowerCase() === weekday);
  }

  return movie;
}

export const getMovieScreeningById = (movieId: number, screeningId: number) => {
  const movie = getMovieById(movieId);
  if (!movie) {
    return null;
  }

  const screening = movie.screenings.find(screening => screening.id === screeningId);
  if (!screening) {
    return null;
  }

  return screening;
}