import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getPopularMovies } from '../services/api';
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

const Home = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['movies'],
    queryFn: ({ pageParam = 1 }) => getPopularMovies(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center text-red-500">
        Error loading movies. Please try again later.
        {error instanceof Error && <div>{error.message}</div>}
      </div>
    );
  }

  if (!data || !data.pages) {
    return null;
  }

  const movies = data.pages.flatMap((page) => page.results);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Popular Movies</h1>
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

export default Home;
