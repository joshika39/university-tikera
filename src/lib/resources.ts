import {Movie} from '@/types';

export const getMoviesByDay = (day: string, movies: Movie[]) => {
  if (!day || !movies || movies.length === 0) {
    return [];
  }
  return movies.filter(movie => {
    return movie.screenings.some(screening => screening.room.weekday.toLowerCase() === day);
  });
}