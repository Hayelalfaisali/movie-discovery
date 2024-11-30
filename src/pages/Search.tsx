import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { searchMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import type { Movie } from '../types/movie';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  }: UseInfiniteQueryResult<
    { page: number; total_pages: number; results: Movie[] },
    Error
  > = useInfiniteQuery({
    queryKey: ['search', query],
    queryFn: ({ pageParam }) => searchMovies(query, pageParam as number),
    getNextPageParam: (lastPage: { page: number; total_pages: number }) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: !!query,
    initialPageParam: 1,
  });

  if (!query) {
    return (
      <div className="text-center text-gray-400 mt-12">
        Enter a search term to find movies
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center text-red-500">
        Error loading search results. Please try again later.
        {error instanceof Error && <div>{error.message}</div>}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const movies = data.pages.flatMap((page: { results: Movie[] }) => page.results);

  if (movies.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-12">
        No movies found for "{query}"
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Search Results for "{query}"
      </h1>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </motion.div>
      
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-accent text-white rounded-full hover:bg-accent/80 transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
