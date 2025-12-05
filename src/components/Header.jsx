import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGlobe, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from  "../../api.js";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, [location]);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-black dark:text-white tracking-tight">
          LifeBlog
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium hover:text-blue-600 transition ${
                location.pathname === link.path ? "text-blue-600" : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <FaGlobe className="w-5 h-5 text-gray-400" />
          
          {currentUser ? (
            <div className="relative">
              {/* User Menu Trigger */}
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {currentUser.name?.[0] || 'U'}
                </div>
                <span className="hidden sm:block">{currentUser.name}</span>
                {currentUser.role === 'admin' && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b dark:border-gray-700">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {currentUser.name}
                    </p>
                    <p className="text-sm text-gray-500">@{currentUser.username}</p>
                    <p className="text-xs text-blue-600">{currentUser.role}</p>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaUser className="w-4 h-4" />
                    Profile
                  </Link>
                  
                  <Link
                    to="/my-blogs"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Posts
                  </Link>

                  {currentUser.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-sm text-gray-700 dark:text-gray-200 hover:underline"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition text-sm"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Create Post Button (authenticated users only) */}
          {currentUser && (
            <Link
              to="/create"
              className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition text-sm"
            >
              Create Post
            </Link>
          )}
        </div>
      </nav>

      {/* Close dropdown when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}