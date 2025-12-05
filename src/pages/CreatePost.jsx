import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { createBlog, getCurrentUser, uploadImage } from "../../api.js";

function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState('')
  const [image, setImage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imageOption, setImageOption] = useState('url') // 'url' or 'file'
  const [status, setStatus] = useState('published')
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const navigate = useNavigate()
  
  const currentUser = getCurrentUser()

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }
      
      setImageFile(file)
      setError('')
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove selected file
  const removeFile = () => {
    setImageFile(null)
    setPreviewUrl('')
    // Clear file input
    const fileInput = document.getElementById('imageFileInput')
    if (fileInput) fileInput.value = ''
  }

  // Get final image URL for preview
  const getFinalImageUrl = () => {
    if (imageOption === 'file') {
      return previewUrl
    }
    return image
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!currentUser) {
      setError('You must be logged in to create a post')
      return
    }

    setLoading(true)
    setError('')

    try {
      let finalImageUrl = null

      // Handle image upload if file is selected
      if (imageOption === 'file' && imageFile) {
        setImageUploading(true)
        try {
          const uploadResult = await uploadImage(imageFile)
          if (uploadResult.error) {
            throw new Error(uploadResult.error)
          }
          finalImageUrl = uploadResult.imageUrl
        } catch (uploadErr) {
          setError('Failed to upload image: ' + uploadErr.message)
          return
        } finally {
          setImageUploading(false)
        }
      } else if (imageOption === 'url' && image.trim()) {
        finalImageUrl = image.trim()
      }

      const blogData = {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        image: finalImageUrl,
        status
      }

      const result = await createBlog(blogData)
      
      if (result.error) {
        setError(result.error)
      } else {
        // Success - redirect to the new blog post or blog list
        navigate('/blog')
      }
    } catch (err) {
      setError('Failed to create post. Please try again.')
      console.error('Create post error:', err)
    } finally {
      setLoading(false)
      setImageUploading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Login Required</h1>
        <p className="mb-4">You need to be logged in to create a blog post.</p>
        <a href="/login" className="text-blue-600 hover:underline">
          Go to Login
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Blog Post</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div>
            <label className="block font-medium mb-2">Title *</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter an engaging title"
              maxLength={200}
            />
            <small className="text-gray-500">{title.length}/200 characters</small>
          </div>

          <div>
            <label className="block font-medium mb-2">Summary *</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              placeholder="Write a compelling summary (will appear in blog listings)"
              rows={3}
              maxLength={500}
            />
            <small className="text-gray-500">{summary.length}/500 characters</small>
          </div>

          {/* Image Section - Updated */}
          <div>
            <label className="block font-medium mb-2">Featured Image</label>
            
            {/* Image Option Toggle */}
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="url"
                  checked={imageOption === 'url'}
                  onChange={(e) => setImageOption(e.target.value)}
                  className="mr-2"
                />
                Image URL
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="file"
                  checked={imageOption === 'file'}
                  onChange={(e) => setImageOption(e.target.value)}
                  className="mr-2"
                />
                Upload Image
              </label>
            </div>

            {/* URL Input */}
            {imageOption === 'url' && (
              <input
                type="url"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            )}

            {/* File Upload */}
            {imageOption === 'file' && (
              <div>
                <input
                  type="file"
                  id="imageFileInput"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <small className="text-gray-500 block mt-1">
                  Accepted formats: JPG, PNG, GIF, WebP (Max: 5MB)
                </small>
                
                {imageFile && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center">
                    <span className="text-sm">{imageFile.name}</span>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Image Preview */}
            {getFinalImageUrl() && (
              <div className="mt-4 relative">
                <img
                  src={getFinalImageUrl()}
                  alt="Preview"
                  className="rounded-lg max-w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                {imageUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-sm">Uploading...</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-2">Tags</label>
            <input
              type="text"
              placeholder="technology, lifestyle, travel (comma separated)"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <small className="text-gray-500">Separate multiple tags with commas</small>
          </div>

          <div>
            <label className="block font-medium mb-2">Status</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">Content *</label>
            <textarea
              placeholder="Write your blog post content in markdown..."
              className="w-full p-3 border rounded h-64 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <small className="text-gray-500">Supports Markdown formatting</small>
          </div>

          <button
            type="submit"
            disabled={loading || imageUploading}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? (imageUploading ? 'Uploading Image...' : 'Creating Post...') : 
             `${status === 'published' ? 'Publish' : 'Save as Draft'}`}
          </button>
        </form>

        {/* Live Preview */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Live Preview</h2>
          
          {/* Preview Header */}
          <div className="mb-4">
            {getFinalImageUrl() && (
              <img
                src={getFinalImageUrl()}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            )}
            <h1 className="text-2xl font-bold mb-2">
              {title || 'Your blog title will appear here'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {summary || 'Your summary will appear here'}
            </p>
            {tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  >
                    #{tag.trim().toLowerCase()}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
                {currentUser?.name?.[0] || 'U'}
              </div>
              <div>
                <div className="font-medium">{currentUser?.name || 'Your Name'}</div>
                <div className="text-xs">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>
              {content || '*Your blog content will appear here as you type...*'}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost