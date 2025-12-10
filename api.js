// // api.js - Fixed version with proper error handling and token management

const API_BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

// ========== UTILITY FUNCTIONS ==========

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const isExpired = currentTime >= expirationTime;
    
    if (isExpired) {
      console.log('Token has expired');
    }
    
    return isExpired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('Auth data cleared');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  // Check if token exists and is not expired
  if (token && isTokenExpired(token)) {
    console.log('Token expired, clearing auth data');
    clearAuthData();
    return {
      'Content-Type': 'application/json'
    };
  }
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  try {
    // Handle 401 Unauthorized - Token expired or invalid
    if (response.status === 401) {
      console.log('Unauthorized - Token expired or invalid');
      clearAuthData();
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      throw new Error('Session expired. Please login again.');
    }
    
    // Handle 403 Forbidden - CORS or permission issue
    if (response.status === 403) {
      console.error('Access forbidden - CORS or permission issue');
      throw new Error('Access forbidden. Please check your permissions.');
    }
    
    // Handle 404 Not Found
    if (response.status === 404) {
      throw new Error('Resource not found');
    }
    
    // Try to parse JSON response
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON response from server');
      throw new Error('Invalid response from server');
    }
    throw error;
  }
};

// Helper function for authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Check if token is expired before making request
  if (token && isTokenExpired(token)) {
    console.log('Token expired before request, clearing auth data');
    clearAuthData();
    
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    
    throw new Error('Session expired. Please login again.');
  }
  
  return fetch(url, options);
};

// ========== AUTH ==========

export const login = async (credentials) => {
  try {
    console.log('Attempting login...');
    console.log('Using API URL:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await handleResponse(response);

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Login successful');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return { error: error.message };
  }
};

export const register = async (userData) => {
  try {
    console.log('Attempting registration...');
    console.log('Using API URL:', API_BASE_URL);
    console.log('Registration data received:', userData);
    
    // Handle both 'name' and 'username' fields for backward compatibility
    const username = userData.username || userData.name;
    
    // Validate required fields
    if (!userData || !username || !userData.email || !userData.password) {
      console.error('Missing required fields:', {
        hasUserData: !!userData,
        hasName: !!(userData && userData.name),
        hasUsername: !!(userData && (userData.username || userData.name)),
        hasEmail: !!(userData && userData.email),
        hasPassword: !!(userData && userData.password)
      });
      throw new Error('Username, email, and password are required');
    }
    
    // Normalize the data to always send 'username'
    const normalizedData = {
      name: userData.name || userData.username,
      username: username,
      email: userData.email,
      password: userData.password
    };

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizedData)
    });

    console.log('Registration response status:', response.status);

    const data = await handleResponse(response);

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Registration successful');
    }

    return data;
  } catch (error) {
    console.error('Register error:', error);
    return { error: error.message };
  }
};

export const logout = () => {
  clearAuthData();
  console.log('User logged out');
  
  // Redirect to home page
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
};

export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    
    // Check if token is expired
    if (token && isTokenExpired(token)) {
      console.log('Token expired, clearing user data');
      clearAuthData();
      return null;
    }
    
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    clearAuthData(); // Clear corrupted data
    return null;
  }
};

export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const user = getCurrentUser();
  
  // If token exists but is expired, clear everything
  if (token && isTokenExpired(token)) {
    clearAuthData();
    return {
      isAuthenticated: false,
      user: null,
      token: null
    };
  }
  
  return {
    isAuthenticated: !!(token && user),
    user,
    token
  };
};

// ========== UPLOADS ==========

export const uploadImage = async (imageFile) => {
  try {
    if (!imageFile) throw new Error('No image file provided');
    if (!imageFile.type.startsWith('image/')) throw new Error('Please select a valid image file');
    if (imageFile.size > 5 * 1024 * 1024) throw new Error('Image size should be less than 5MB');

    const formData = new FormData();
    formData.append('image', imageFile);

    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      clearAuthData();
      throw new Error('Session expired. Please login again.');
    }

    console.log('Uploading image...');

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Image uploaded successfully:', result);
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    return { error: error.message };
  }
};

export const testUploadEndpoint = async () => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/uploads/test`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Test upload endpoint error:', error);
    return { error: error.message };
  }
};

// ========== BLOGS ==========

export const createBlog = async (blogData) => {
  try {
    if (!blogData.title || !blogData.content) {
      throw new Error('Title and content are required');
    }

    console.log('Creating blog...');

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(blogData)
    });

    const result = await handleResponse(response);
    console.log('Blog created successfully');
    return result;
  } catch (error) {
    console.error('Create blog error:', error);
    return { error: error.message };
  }
};

export const getBlogs = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/blogs${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Get blogs error:', error);
    return { error: error.message };
  }
};

export const getBlog = async (id) => {
  try {
    if (!id) throw new Error('Blog ID is required');

    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Get blog error:', error);
    return { error: error.message };
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    if (!id) throw new Error('Blog ID is required');
    if (!blogData.title || !blogData.content) {
      throw new Error('Title and content are required');
    }

    console.log('Updating blog...');

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(blogData)
    });

    const result = await handleResponse(response);
    console.log('Blog updated successfully');
    return result;
  } catch (error) {
    console.error('Update blog error:', error);
    return { error: error.message };
  }
};

export const deleteBlog = async (id) => {
  try {
    if (!id) throw new Error('Blog ID is required');

    console.log('Deleting blog...');

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const result = await handleResponse(response);
    console.log('Blog deleted successfully');
    return result;
  } catch (error) {
    console.error('Delete blog error:', error);
    return { error: error.message };
  }
};

export const getMyBlogs = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/blogs/my${queryString ? `?${queryString}` : ''}`;

    const response = await makeAuthenticatedRequest(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Get my blogs error:', error);
    return { error: error.message };
  }
};

export const toggleLike = async (blogId) => {
  try {
    if (!blogId) throw new Error('Blog ID is required');

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs/${blogId}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Toggle like error:', error);
    return { error: error.message };
  }
};

export const addComment = async (blogId, content) => {
  try {
    if (!blogId) throw new Error('Blog ID is required');
    if (!content || !content.trim()) throw new Error('Comment content is required');

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs/${blogId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content: content.trim() })
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Add comment error:', error);
    return { error: error.message };
  }
};

export const deleteComment = async (blogId, commentId) => {
  try {
    if (!blogId) throw new Error('Blog ID is required');
    if (!commentId) throw new Error('Comment ID is required');

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs/${blogId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Delete comment error:', error);
    return { error: error.message };
  }
};

export const getBlogStats = async () => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Get blog stats error:', error);
    return { error: error.message };
  }
};

// ========== CONTACT / MISC ==========

export const submitContact = async (contactData) => {
  try {
    if (!contactData.name || !contactData.email || !contactData.message) {
      throw new Error('Name, email, and message are required');
    }

    console.log('Submitting contact form...');

    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });

    const result = await handleResponse(response);
    console.log('Contact form submitted successfully');
    return result;
  } catch (error) {
    console.error('Submit contact error:', error);
    return { error: error.message };
  }
};

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Health check error:', error);
    return { error: error.message };
  }
};

// ===== Aliases for backward compatibility =====
export const fetchBlogs = getBlogs;
export const fetchBlog = getBlog;
export const signup = register;

// ===== Default export for convenience =====
export default {
  // Auth
  login,
  register,
  signup: register,
  logout,
  getCurrentUser,
  checkAuthStatus,
  isTokenExpired,
  clearAuthData,
  
  // Uploads
  uploadImage,
  testUploadEndpoint,
  
  // Blogs
  createBlog,
  getBlogs,
  fetchBlogs: getBlogs,
  getBlog,
  fetchBlog: getBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
  toggleLike,
  addComment,
  deleteComment,
  getBlogStats,
  
  // Contact
  submitContact,
  healthCheck,
  
  // Config
  API_BASE_URL
};