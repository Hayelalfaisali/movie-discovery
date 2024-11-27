import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon, ClockIcon } from '@heroicons/react/24/solid';
import { getMovieDetails, getMovieCredits } from '../services/api';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: movie, isLoading: isLoadingMovie } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(id!),
  });

  const { data: credits } = useQuery({
    queryKey: ['credits', id],
    queryFn: () => getMovieCredits(id!),
    enabled: !!movie,
  });

  if (isLoadingMovie) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent">
          <div className="container mx-auto h-full flex items-end pb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-64 rounded-lg shadow-xl"
              />
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                    <span>{movie.vote_average}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
                    <span>{movie.runtime} min</span>
                  </div>
                  <div className="text-gray-300">
                    {movie.release_date}
                  </div>
                </div>
                <p className="text-lg text-gray-300 mb-4">{movie.tagline}</p>
                <p className="text-gray-200">{movie.overview}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {credits && credits.cast.length > 0 && (
        <div className="container mx-auto my-8">
          <h2 className="text-2xl font-bold mb-4">Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {credits.cast.map((actor) => (
              <div key={actor.id} className="text-center">
                <div className="w-full h-48 bg-secondary rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="font-semibold">{actor.name}</h3>
                <p className="text-sm text-gray-400">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MovieDetails;
