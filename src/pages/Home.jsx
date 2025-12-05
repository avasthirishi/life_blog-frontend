import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchBlogs, getCurrentUser } from "../../api.js";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadBlogs();
  }, [selectedTag]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 6, // Show only 6 posts on home page
        ...(selectedTag !== "all" && { tag: selectedTag })
      };
      
      const data = await fetchBlogs(params);
      
      if (data.error) {
        setError(data.error);
      } else {
        setBlogs(data.blogs || []);
        setAvailableTags(['all', ...(data.filters?.availableTags || [])]);
      }
    } catch (err) {
      setError("Failed to load blog posts");
      console.error("Load blogs error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="text-center py-20 bg-blue-700 text-white">
        <h1 className="text-5xl font-extrabold mb-4">Create a Blog Worth Sharing</h1>
        <p className="text-lg mb-6">
          Get a full suite of intuitive design features and powerful marketing tools to create a unique blog that leaves a lasting impression.
        </p>
        <Link
          to="/create"
          className="px-6 py-3 bg-white text-blue-700 rounded-full hover:bg-blue-100 transition shadow-md font-semibold"
        >
          Start Blogging →
        </Link>
        <p className="mt-4 text-sm opacity-80">
          Try it for free for an unlimited time and upgrade when you need.
        </p>
      </section>

      {/* Featured Templates Section */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-2">Blog templates that set you up for success</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Choose from 900+ free customizable templates built with everything you need.
        </p>
        <Link
          to="/blog"
          className="text-blue-600 font-semibold hover:underline"
        >
          Explore Templates →
        </Link>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 mt-8">
          <Link to="/blog?tag=news" className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-800">
            <img src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmV3c3xlbnwwfHwwfHx8MA%3D%3D" alt="News blog" className="w-full h-40 object-cover" />
            <div className="p-3 text-left">
              <span className="font-medium">News blog</span>
            </div>
          </Link>
          <Link to="/blog?tag=travel" className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-800">
            <img src="https://plus.unsplash.com/premium_photo-1683121257579-d40449389b63?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D" alt="Personal blog" className="w-full h-40 object-cover" />
            <div className="p-3 text-left">
              <span className="font-medium">Travel blog</span>
            </div>
          </Link>
          <Link to="/blog?tag=food" className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-800">
            <img src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D" alt="Food blog" className="w-full h-40 object-cover" />
            <div className="p-3 text-left">
              <span className="font-medium">Food blog</span>
            </div>
          </Link>
          <Link to="/blog?tag=lifestyle" className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-800">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlmZXN0eWxlfGVufDB8fDB8fHww" alt="Lifestyle blog" className="w-full h-40 object-cover" />
            <div className="p-3 text-left">
              <span className="font-medium">Lifestyle blog</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Recent Blog Posts</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Discover the latest stories and insights from our community
          </p>
        </div>

        {error && (
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
              {error}
            </div>
          </div>
        )}

        {/* Tag Filter */}
        {availableTags.length > 1 && (
          <div className="flex justify-center mb-8 flex-wrap gap-3 px-4">
            {availableTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
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

        {/* Blog Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {blogs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {selectedTag === "all" 
                  ? "No blog posts found. Be the first to create one!"
                  : `No blog posts found with tag "${selectedTag}"`
                }
              </p>
              <Link
                to="/create"
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
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
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300">
                      {post.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="font-medium">{post.user?.name || 'Anonymous'}</div>
                      <div className="text-xs text-gray-500">{post.user?.username}</div>
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
        </div>

        {/* View All Posts Button */}
        {blogs.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              View All Posts
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;