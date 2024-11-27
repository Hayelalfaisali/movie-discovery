import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const imageUrl = movie.poster_path || '/placeholder.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -10 }}
      className="movie-card"
    >
      <Link to={`/movie/${movie.id}`}>
        <div className="relative">
          <img
            src={imageUrl}
            alt={movie.title}
            className="w-full h-[400px] object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <h3 className="text-lg font-semibold text-white line-clamp-1">
              {movie.title}
            </h3>
            <div className="flex items-center mt-1">
              {movie.vote_average > 0 && (
                <>
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-white">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </>
              )}
              <span className="text-sm text-gray-300 ml-2">
                {movie.release_date}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
