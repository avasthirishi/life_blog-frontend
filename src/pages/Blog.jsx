import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchBlogs } from  "../../api.js";

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({});
  
  // Get URL parameters
  const selectedTag = searchParams.get('tag') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    loadBlogs();
  }, [selectedTag, searchQuery, currentPage]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...(selectedTag !== "all" && { tag: selectedTag }),
        ...(searchQuery && { search: searchQuery })
      };
      
      const data = await fetchBlogs(params);
      
      if (data.error) {
        setError(data.error);
      } else {
        setBlogs(data.blogs || []);
        setPagination(data.pagination || {});
        setAvailableTags(['all', ...(data.filters?.availableTags || [])]);
      }
    } catch (err) {
      setError("Failed to load blog posts");
      console.error("Load blogs error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = (tag) => {
    const newParams = new URLSearchParams(searchParams);
    if (tag === 'all') {
      newParams.delete('tag');
    } else {
      newParams.set('tag', tag);
    }
    newParams.delete('page'); // Reset to page 1 when changing filters
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    newParams.delete('page'); // Reset to page 1 when searching
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', page.toString());
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header Section */}
      <section className="py-12 text-center bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold mb-4">Blog Posts</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Explore stories, adventures, and experiences from our community.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto px-4">
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </section>

      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            {error}
          </div>
        </div>
      )}

      {/* Tag Filter */}
      {availableTags.length > 1 && (
        <div className="flex justify-center mb-8 flex-wrap gap-3 px-4 pt-8">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-300 ${
                selectedTag === tag
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Blog Grid */}
          <section className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 pb-16">
            {blogs.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  {searchQuery 
                    ? `No blog posts found for "${searchQuery}"`
                    : selectedTag !== "all" 
                      ? `No blog posts found with tag "${selectedTag}"`
                      : "No blog posts found. Be the first to create one!"
                  }
                </p>
                <Link
                  to="/create"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Create First Post
                </Link>
              </div>
            ) : (
              blogs.map((post) => (
                <article key={post._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden flex flex-col">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">{post.summary}</p>
                    <p className="text-sm text-gray-400 mb-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300">
                        {post.user?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="font-medium">{post.user?.name || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">@{post.user?.username}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{post.views || 0} views</span>
                        <span>{post.likesCount || 0} likes</span>
                        <span>{post.commentsCount || 0} comments</span>
                      </div>
                      <Link 
                        to={`/post/${post._id}`} 
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pb-16 px-4">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                if (pageNum > pagination.totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 text-sm border rounded-lg ${
                      pagination.currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Blog;