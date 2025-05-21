import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const ManageNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    isActive: true,
  });

  // Fetch news items on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/news/admin`,
        { withCredentials: true }
      );
      setNewsList(response.data.news);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to load news items");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (news = null) => {
    if (news) {
      setCurrentNews(news);
      setFormData({
        title: news.title,
        description: news.description,
        image: news.image,
        isActive: news.isActive,
      });
    } else {
      setCurrentNews(null);
      setFormData({
        title: "",
        description: "",
        image: "",
        isActive: true,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      title: "",
      description: "",
      image: "",
      isActive: true,
    });
    setCurrentNews(null);
  };

  const handleOpenDeleteModal = (news) => {
    setCurrentNews(news);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setCurrentNews(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.title || !formData.description || !formData.image) {
      toast.error("All fields are required");
      return;
    }

    try {
      let response;

      if (currentNews) {
        // Update existing news
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/news/${currentNews._id}`,
          formData,
          { withCredentials: true }
        );
        toast.success("News updated successfully");
      } else {
        // Create new news
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/news`,
          formData,
          { withCredentials: true }
        );
        toast.success("News created successfully");
      }

      fetchNews();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving news:", error);
      toast.error("Failed to save news item");
    }
  };

  const handleDelete = async () => {
    if (!currentNews) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/news/${currentNews._id}`,
        { withCredentials: true }
      );

      toast.success("News deleted successfully");
      fetchNews();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Failed to delete news item");
    }
  };

  const handleToggleActive = async (news) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/news/${news._id}`,
        { isActive: !news.isActive },
        { withCredentials: true }
      );

      toast.success(
        `News ${news.isActive ? "deactivated" : "activated"} successfully`
      );
      fetchNews();
    } catch (error) {
      console.error("Error toggling news status:", error);
      toast.error("Failed to update news status");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-8 py-4 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">News Management</h1>
        <Button
          className="flex items-center gap-2 bg-[#00FF7F] hover:bg-[#00CC66] text-black"
          onClick={() => handleOpenModal()}
        >
          <FaPlus /> Add News
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-xl">Loading news items...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {newsList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl">
                No news items found. Create one to get started.
              </p>
            </div>
          ) : (
            newsList.map((news) => (
              <Card key={news._id} className="bg-[#242424] p-6 rounded-xl">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/4">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="w-full md:w-3/4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold mb-2">
                          {news.title}
                        </h2>
                        <div
                          className={`px-3 py-1 rounded-full text-sm ${
                            news.isActive
                              ? "bg-green-900/50 text-green-400"
                              : "bg-red-900/50 text-red-400"
                          }`}
                        >
                          {news.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">
                        Created: {formatDate(news.createdAt)}
                      </p>
                      <p className="text-gray-300">{news.description}</p>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button
                        className="flex items-center gap-2 bg-blue-500"
                        size="sm"
                        onClick={() => handleOpenModal(news)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        className="flex items-center gap-2 bg-red-500"
                        size="sm"
                        onClick={() => handleOpenDeleteModal(news)}
                      >
                        <FaTrash /> Delete
                      </Button>
                      <Button
                        className={`flex items-center gap-2 ${
                          news.isActive ? "bg-yellow-700" : "bg-green-700"
                        }`}
                        size="sm"
                        onClick={() => handleToggleActive(news)}
                      >
                        {news.isActive ? (
                          <>
                            <FaTimes /> Deactivate
                          </>
                        ) : (
                          <>
                            <FaCheck /> Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Add/Edit News Modal */}
      <Dialog open={openModal} handler={handleCloseModal} size="lg">
        <DialogHeader className="text-black">
          {currentNews ? "Edit News" : "Add News"}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody className="text-black">
            <div className="grid gap-6">
              <Input
                type="text"
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="text-black"
                required
              />

              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="text-black"
                required
              />

              <Input
                type="url"
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="text-black"
                required
              />

              {formData.image && (
                <div className="mt-2">
                  <p className="mb-2 text-sm">Image Preview:</p>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="max-h-40 rounded-md object-cover"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300x200?text=Invalid+Image+URL")
                    }
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="isActive">Active (visible on website)</label>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleCloseModal}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#00FF7F] text-black">
              {currentNews ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} handler={handleCloseDeleteModal}>
        <DialogHeader className="text-black">Confirm Deletion</DialogHeader>
        <DialogBody className="text-black">
          Are you sure you want to delete the news item "{currentNews?.title}"?
          This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue"
            onClick={handleCloseDeleteModal}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ManageNews;
