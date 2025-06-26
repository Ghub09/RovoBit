import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../../utils/api";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await API.get("/news");
        setNews(response.data.news.slice(0, 3));
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 100;
    const y = (clientY / window.innerHeight) * 100;
    setGradientPosition({ x, y });
  };

  // Apply gradient only on md and larger screens
  const gradientStyle =
    window.innerWidth >= 768
      ? {
          background: `radial-gradient(at ${gradientPosition.x}% ${gradientPosition.y}%, #3b82f6, #1a1a1a)`,
          transition: "background-position 0.3s ease",
        }
      : {};

  if (loading) {
    return (
      <section className="py-16 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="container mx-auto px-4"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Loading Latest News...
          </h2>
        </motion.div>
      </section>
    );
  }

  if (!news || news.length === 0) {
    return (
      <section className="py-16 bg-black">
        <h2 className="text-white text-center text-xl">No news available</h2>
      </section>
    );
  }

  return (
    <motion.section
      style={gradientStyle}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.75, delay: 0.15 }}
      className="py-20 bg-black"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">
            Latest News
          </h2>
          <p className="text-gray-300 mt-4">
            Stay updated with the latest cryptocurrency news and market trends
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, idx) => {
            const isSelected = selectedId === item._id;
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.24 + idx * 0.09 }}
                className="rounded-2xl bg-gray-900 backdrop-blur-md overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 hover:scale-105"
                tabIndex={0}
                aria-label={item.title}
              >
                <div className="h-52 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs text-primary font-medium mb-2">
                    {formatDate(item.createdAt)}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3 text-justify">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 mb-4 font-sans text-justify">
                    {isSelected
                      ? item.description
                      : truncateText(item.description, 110)}
                    <button
                      className="text-blue-400 text-2xl ml-2"
                      onClick={() =>
                        setSelectedId((prev) =>
                          prev === item._id ? null : item._id
                        )
                      }
                    >
                      {isSelected ? "←" : "→"}
                    </button>
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default NewsSection;
