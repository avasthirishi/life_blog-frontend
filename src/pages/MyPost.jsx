import React, { useEffect, useState, useCallback } from "react";
import { getMyBlogs, deleteBlog } from "../../api.js";

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Enhanced fetch function with better error handling and debugging
  const fetchMyPosts = useCallback(async (showDebug = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Enhanced auth check with debugging
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your posts');
        setDebugInfo({
          issue: 'No authentication token found',
          solution: 'Please log in again',
          timestamp: new Date().toISOString()
        });
        setLoading(false);
        return;
      }

      if (showDebug) {
        setDebugInfo({
          attempting: 'Fetching posts from API',
          endpoint: 'GET /api/blogs/my',
          token: token.substring(0, 20) + '...',
          timestamp: new Date().toISOString()
        });
      }

      console.log('🔍 Debug: Attempting to fetch posts...');
      console.log('🔑 Token exists:', !!token);
      console.log('🌐 API endpoint: /api/blogs/my');
      
      const response = await getMyBlogs();
      
      console.log('📡 API Response:', response);
      
      if (response.error) {
        // Handle different types of API errors
        if (response.error.includes('401') || response.error.includes('unauthorized')) {
          setError('Session expired. Please log in again.');
          setDebugInfo({
            issue: 'Authentication failed',
            solution: 'Clear localStorage and log in again',
            action: () => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }
          });
        } else if (response.error.includes('500')) {
          setError('Server error. Our team has been notified.');
          setDebugInfo({
            issue: 'Internal Server Error (500)',
            possibleCauses: [
              'Database connection failed',
              'Server crashed',
              'Invalid JWT token format',
              'Missing middleware'
            ],
            solution: 'Check backend server logs',
            canRetry: true
          });
        } else {
          setError(response.error);
        }
      } else {
        setPosts(response.blogs || []);
        setError(null);
        setDebugInfo(null);
        setRetryCount(0);
        console.log('✅ Posts loaded successfully:', response.blogs?.length || 0);
      }
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
      
      // Enhanced error analysis
      let errorMessage = "Failed to load your posts.";
      let debugDetails = {
        error: err.message,
        timestamp: new Date().toISOString()
      };

      if (err.message.includes('fetch')) {
        errorMessage = "Cannot connect to server. Please check if the server is running.";
        debugDetails.issue = 'Network/Connection Error';
        debugDetails.possibleCauses = [
          'Backend server not running on port 5000',
          'CORS issues',
          'Network connectivity problems'
        ];
        debugDetails.solution = 'Start backend server: npm start';
      } else if (err.message.includes('500')) {
        errorMessage = "Server error. Please try again or contact support.";
        debugDetails.issue = 'Internal Server Error';
        debugDetails.canRetry = true;
      }

      setError(errorMessage);
      setDebugInfo(debugDetails);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyPosts(true); // Enable debug mode on first load
  }, [fetchMyPosts]);

  // Enhanced delete function with better UX
  const handleDelete = async (postId) => {
    // Custom confirmation dialog (better than window.confirm)
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );
    
    if (!confirmDelete) return;

    try {
      setDeleteLoading(postId);
      console.log('🗑️ Deleting post:', postId);
      
      const response = await deleteBlog(postId);
      
      if (response.error) {
        throw new Error(response.error);
      } else {
        // Optimistic update
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        
        // Show success message (better than alert)
        console.log('✅ Post deleted successfully');
        
        // You could replace this with a toast notification
        const successMsg = document.createElement('div');
        successMsg.textContent = 'Post deleted successfully!';
        successMsg.style.cssText = `
          position: fixed; top: 20px; right: 20px; z-index: 1000;
          background: #10b981; color: white; padding: 12px 20px;
          border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      }
    } catch (err) {
      console.error("❌ Error deleting post:", err);
      
      // Better error display than alert
      const errorMsg = document.createElement('div');
      errorMsg.textContent = `Failed to delete post: ${err.message}`;
      errorMsg.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        background: #ef4444; color: white; padding: 12px 20px;
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 5000);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Improved navigation (still using window.location but with better handling)
  const handleEdit = (postId) => {
    console.log('✏️ Navigating to edit post:', postId);
    // You should replace this with React Router's useNavigate
    window.location.href = `/edit-blog/${postId}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Enhanced retry function
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    console.log(`🔄 Retry attempt #${retryCount + 1}`);
    fetchMyPosts(true);
  };

  // Debug panel component
  const DebugPanel = ({ info }) => (
    <div className="mt-4 p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-yellow-400">🔍 Debug Information</span>
        <button 
          onClick={() => setDebugInfo(null)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      {Object.entries(info).map(([key, value]) => (
        <div key={key} className="mb-1">
          <span className="text-blue-400">{key}:</span> 
          {Array.isArray(value) ? (
            <ul className="ml-4 mt-1">
              {value.map((item, i) => (
                <li key={i} className="text-gray-300">• {item}</li>
              ))}
            </ul>
          ) : typeof value === 'function' ? (
            <button 
              onClick={value}
              className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            >
              Execute Fix
            </button>
          ) : (
            <span className="text-gray-300"> {String(value)}</span>
          )}
        </div>
      ))}
    </div>
  );

  // Loading state with enhanced skeleton
  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Posts</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Enhanced error state with debugging
  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Posts</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="text-red-800 flex-1">
              <h3 className="font-medium text-lg mb-2">⚠️ Unable to Load Posts</h3>
              <p className="mb-4">{error}</p>
              
              {retryCount > 0 && (
                <p className="text-sm text-red-600 mb-4">
                  Retry attempts: {retryCount}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  🔄 Try Again
                </button>
                
                <button
                  onClick={() => fetchMyPosts(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  🔍 Debug Mode
                </button>
                
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  🔑 Re-login
                </button>
              </div>
            </div>
          </div>
          
          {debugInfo && <DebugPanel info={debugInfo} />}
        </div>
      </div>
    );
  }

  // Empty state (unchanged but improved)
  if (posts.length === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Posts</h1>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-6">You haven't created any blog posts yet.</p>
          <button
            onClick={() => window.location.href = '/create-blog'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Post
          </button>
        </div>
      </div>
    );
  }

  // Main content (enhanced with better interactions)
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Posts</h1>
        <div className="flex items-center space-x-4">
          <p className="text-gray-600">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
          <button
            onClick={() => fetchMyPosts()}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {post.title}
                </h2>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(post._id)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={deleteLoading === post._id}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      deleteLoading === post._id
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {deleteLoading === post._id ? '🗑️ Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-3">
                {post.content && post.content.length > 200 
                  ? `${post.content.substring(0, 200)}...` 
                  : post.content || 'No content available'
                }
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Created: {formatDate(post.createdAt)}</span>
                  {post.updatedAt !== post.createdAt && (
                    <span>Updated: {formatDate(post.updatedAt)}</span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  {post.likes && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                      {post.likes.length}
                    </span>
                  )}
                  {post.comments && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.comments.length}
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    post.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.status || 'Published'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPost;