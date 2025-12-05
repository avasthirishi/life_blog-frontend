import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const headers = getAuthHeaders();
        
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: 'GET',
          headers: headers
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw new Error('Authentication expired. Please log in again.');
          }
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch("http://localhost:5000/api/upload/image", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok && data.imageUrl) {
        alert("Image uploaded successfully!");
        
        // Update user profile with new image
        const updateResponse = await fetch("http://localhost:5000/api/auth/profile", {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ profilePicture: data.imageUrl })
        });

        if (updateResponse.ok) {
          setUser(prev => ({ ...prev, profilePicture: data.imageUrl }));
          // Clear the preview
          setSelectedImage(null);
          setPreviewUrl("");
        }
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Upload failed. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No user data
  if (!user) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
        <p className="text-center text-gray-700">No user data found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile</h1>

      {/* Profile Image */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={previewUrl || user.profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
        <div>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleImageUpload}
            disabled={!selectedImage}
            className={`px-4 py-2 rounded transition-colors ${
              selectedImage 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Upload Image
          </button>
          {previewUrl && (
            <button
              onClick={() => {
                setSelectedImage(null);
                setPreviewUrl("");
              }}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-4 text-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Name:</strong> {user.name || 'Not provided'}</p>
            <p><strong>Username:</strong> {user.username || 'Not provided'}</p>
            <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
            <p><strong>Role:</strong> {user.role || 'user'}</p>
          </div>
          <div>
            {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
            {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
            {user.location && <p><strong>Location:</strong> {user.location}</p>}
            <p><strong>Account Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</p>
            {user.createdAt && (
              <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;