import axios from 'axios';

const API_KEY = 'f66dafe9'; // Your personal OMDb API key
const BASE_URL = 'https://www.omdbapi.com';

export const api = axios.create({
  baseURL: BASE_URL,
});

export const getPopularMovies = async (page = 1) => {
  // Since OMDb doesn't have a popular movies endpoint, we'll search for common terms
  const searchTerms = ['movie', 'star', 'love', 'action', 'comedy'];
  const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
  const response = await api.get('/', {
    params: {
      apikey: API_KEY,
      s: randomTerm,
      type: 'movie',
      page,
    },
  });
  
  return {
    page,
    results: response.data.Search?.map((movie: any) => ({
      id: movie.imdbID,
      title: movie.Title,
      poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
      release_date: movie.Year,
      vote_average: 0, // OMDb doesn't provide ratings in search results
    })) || [],
    total_pages: Math.ceil(Number(response.data.totalResults) / 10) || 0,
  };
};

export const searchMovies = async (query: string, page = 1) => {
  const response = await api.get('/', {
    params: {
      apikey: API_KEY,
      s: query,
      type: 'movie',
      page,
    },
  });

  return {
    page,
    results: response.data.Search?.map((movie: any) => ({
      id: movie.imdbID,
      title: movie.Title,
      poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
      release_date: movie.Year,
      vote_average: 0,
    })) || [],
    total_pages: Math.ceil(Number(response.data.totalResults) / 10) || 0,
  };
};

export const getMovieDetails = async (movieId: string) => {
  const response = await api.get('/', {
    params: {
      apikey: API_KEY,
      i: movieId,
      plot: 'full',
    },
  });

  const movie = response.data;
  return {
    id: movie.imdbID,
    title: movie.Title,
    overview: movie.Plot,
    poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
    backdrop_path: movie.Poster !== 'N/A' ? movie.Poster : null,
    vote_average: Number(movie.imdbRating),
    release_date: movie.Released,
    runtime: Number(movie.Runtime.split(' ')[0]),
    tagline: movie.Genre,
    genres: movie.Genre.split(', ').map((name: string, id: number) => ({ id, name })),
  };
};

export const getMovieCredits = async (movieId: string) => {
  const response = await api.get('/', {
    params: {
      apikey: API_KEY,
      i: movieId,
    },
  });

  return {
    id: movieId,
    cast: response.data.Actors.split(', ').map((name: string, id: number) => ({
      id,
      name,
      character: 'Actor',
      profile_path: null,
    })),
  };
};

export const getMovieTrailers = async () => {
  return {
    id: 0,
    results: [],
  };
};
