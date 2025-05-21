import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/news/${id}`
        );
        setNews(response.data.news);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news details:", error);
        setError(
          "Failed to load news. The article might have been removed or is temporarily unavailable."
        );
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Oops!</h2>
            <p className="text-gray-400 mb-8">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#00FF7F] hover:text-white transition-colors duration-300"
            >
              <FaArrowLeft /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              News Not Found
            </h2>
            <p className="text-gray-400 mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#00FF7F] hover:text-white transition-colors duration-300"
            >
              <FaArrowLeft /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-gray-400 hover:text-[#00FF7F] transition-colors duration-300"
        >
          <FaArrowLeft /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">{news.title}</h1>
          <p className="text-gray-400 mb-8">
            Published on {formatDate(news.createdAt)}
          </p>

          <div className="mb-10 rounded-xl overflow-hidden h-[400px]">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {news.description}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsDetail;
