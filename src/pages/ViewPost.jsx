import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { fetchBlog, toggleLike, addComment, deleteComment, getCurrentUser } from  "../../api.js";
import { FaHeart, FaRegHeart, FaComment, FaTrash, FaEye } from 'react-icons/fa'

function ViewPost() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  
  const currentUser = getCurrentUser()

  useEffect(() => {
    if (id) {
      loadBlog()
    }
  }, [id])

  const loadBlog = async () => {
    try {
      setLoading(true)
      const data = await fetchBlog(id)
      
      if (data.error) {
        setError(data.error)
      } else {
        setBlog(data)
        setLikesCount(data.likesCount || 0)
        // Check if current user liked this blog
        if (currentUser && data.likes) {
          setLiked(data.likes.includes(currentUser.id))
        }
      }
    } catch (err) {
      setError('Failed to load blog post')
      console.error('Load blog error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!currentUser) {
      alert('Please log in to like posts')
      return
    }

    try {
      const result = await toggleLike(id)
      if (result.error) {
        alert(result.error)
      } else {
        setLiked(result.liked)
        setLikesCount(result.likesCount)
      }
    } catch (err) {
      console.error('Like error:', err)
      alert('Failed to update like status')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    
    if (!currentUser) {
      alert('Please log in to comment')
      return
    }

    if (!newComment.trim()) {
      return
    }

    try {
      setSubmittingComment(true)
      const result = await addComment(id, newComment.trim())
      
      if (result.error) {
        alert(result.error)
      } else {
        // Add the new comment to the blog state
        setBlog(prev => ({
          ...prev,
          comments: [...(prev.comments || []), result.comment]
        }))
        setNewComment('')
      }
    } catch (err) {
      console.error('Add comment error:', err)
      alert('Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    try {
      const result = await deleteComment(id, commentId)
      
      if (result.error) {
        alert(result.error)
      } else {
        // Remove the comment from the blog state
        setBlog(prev => ({
          ...prev,
          comments: prev.comments.filter(comment => comment._id !== commentId)
        }))
      }
    } catch (err) {
      console.error('Delete comment error:', err)
      alert('Failed to delete comment')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/blog" className="text-blue-600 hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/blog" 
          className="inline-flex items-center text-blue-600 hover:underline mb-8"
        >
          ← Back to Blog
        </Link>

        {/* Featured Image */}
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-2xl mb-8"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {blog.title}
          </h1>
          
          {/* Author and Meta Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {blog.user?.name?.[0] || 'U'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {blog.user?.name || 'Anonymous'}
                </h3>
                <p className="text-sm text-gray-500">
                  @{blog.user?.username} • {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FaEye className="w-4 h-4" />
                <span>{blog.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaHeart className="w-4 h-4" />
                <span>{likesCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaComment className="w-4 h-4" />
                <span>{blog.comments?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${tag}`}
                  className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Summary */}
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed border-l-4 border-blue-500 pl-4 mb-8">
            {blog.summary}
          </p>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-12 pb-8 border-b dark:border-gray-700">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              liked
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {liked ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
            <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
          </button>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FaComment className="w-5 h-5" />
            <span>{blog.comments?.length || 0} {blog.comments?.length === 1 ? 'Comment' : 'Comments'}</span>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Comments ({blog.comments?.length || 0})
          </h3>

          {/* Add Comment Form */}
          {currentUser ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {currentUser.name?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                    rows={3}
                    maxLength={1000}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {newComment.length}/1000 characters
                    </span>
                    <button
                      type="submit"
                      disabled={!newComment.trim() || submittingComment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Please log in to leave a comment
              </p>
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Log in here
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {comment.user?.name?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {comment.user?.name || 'Anonymous'}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            @{comment.user?.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                          {(currentUser && (
                            currentUser.id === comment.user?._id || 
                            currentUser.id === blog.user?._id || 
                            currentUser.role === 'admin'
                          )) && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-500 hover:text-red-700 transition"
                              title="Delete comment"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FaComment className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </section>
      </article>
    </div>
  )
}

export default ViewPost