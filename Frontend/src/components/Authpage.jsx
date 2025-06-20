import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock, FiUser, FiPhone, FiUpload } from "react-icons/fi"; // Import React Icons

// Simple Message Modal Component (replaces alert())
const MessageModal = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
  const borderColor = type === "success" ? "border-green-700" : "border-red-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className={`${bgColor} text-white p-6 rounded-lg shadow-xl border-b-4 ${borderColor} transform transition-all duration-300 ease-out scale-100 opacity-100`}>
        <p className="text-lg font-semibold mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};


const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    image: "",
  });
  const [loadingImage, setLoadingImage] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [message, setMessage] = useState(null); // For custom messages
  const [messageType, setMessageType] = useState("info"); // success or error

  // IMPORTANT: Ensure these are set in your environment variables for Cloudinary to work.
  // For Canvas, typically environment variables are provided at runtime or through platform settings.
  const CLOUD_NAME = typeof import.meta.env.VITE_CLOUDINARY_CLOUD_NAME !== 'undefined' ? import.meta.env.VITE_CLOUDINARY_CLOUD_NAME : 'your_cloudinary_cloud_name';
  const CLOUD_PRESET = typeof import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET !== 'undefined' ? import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET : 'your_cloudinary_upload_preset';


  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000); // Hide after 5 seconds
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!CLOUD_NAME || CLOUD_NAME === 'your_cloudinary_cloud_name' || !CLOUD_PRESET || CLOUD_PRESET === 'your_cloudinary_upload_preset') {
      showMessage("Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your environment.", "error");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUD_PRESET);

    setLoadingImage(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const result = await res.json();
      if (result.secure_url) {
        setFormData((prev) => ({ ...prev, image: result.secure_url }));
        showMessage("Profile image uploaded successfully!", "success");
      } else {
        showMessage("Image upload failed. Please try again.", "error");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      showMessage("Image upload failed: " + err.message, "error");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingForm(true);

    try {
      // IMPORTANT: Ensure your backend is running at http://localhost:8000
      const endpoint = isLogin
        ? "http://localhost:8000/api/auth/login"
        : "http://localhost:8000/api/auth/register";

      const response = await axios.post(endpoint, formData);
      showMessage(`${isLogin ? "Login" : "Signup"} successful! Redirecting...`, "success");

      // Assuming your backend sends a token and user data
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("profileImage", response.data.user.image || "");

      // Navigate after a short delay to allow message to be seen
      setTimeout(() => navigate("/userpage"), 1500);

    } catch (error) {
      console.error("Auth error:", error);
      showMessage("Error: " + (error.response?.data?.message || error.message || "Something went wrong."), "error");
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen
                    bg-[radial-gradient(circle,_#0A0A2A_0%,_#000000_100%)] p-4 sm:p-6 md:p-8">

      {/* Subtle Background Glows (matching Hero/About) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl md:h-[650px]
                      bg-gray-900/70 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden
                      border border-gray-800">

        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8
                         bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-fuchsia-400">
            {isLogin ? "Welcome Back!" : "Join Us Today!"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 pl-10 bg-gray-800 text-gray-200 placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 pl-10 bg-gray-800 text-gray-200 placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors duration-200"
                    required
                  />
                </div>
              </>
            )}

            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded-lg px-4 py-3 pl-10 bg-gray-800 text-gray-200 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors duration-200"
                required
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded-lg px-4 py-3 pl-10 bg-gray-800 text-gray-200 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors duration-200"
                required
              />
            </div>

            {!isLogin && (
              <div className="mt-4">
                <label htmlFor="profile-image-upload" className="block text-gray-300 text-sm font-medium mb-2 cursor-pointer flex items-center">
                  <FiUpload className="mr-2 text-fuchsia-400" />
                  {loadingImage ? "Uploading..." : (formData.image ? "Image Uploaded!" : "Upload Profile Picture (Optional)")}
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden" // Hide the default file input
                  disabled={loadingImage}
                />
                {formData.image && !loadingImage && (
                  <img src={formData.image} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover mt-2 mx-auto md:mx-0 border-2 border-purple-500 shadow-md" />
                )}
              </div>
            )}

            <button
              type="submit"
              className="relative inline-flex items-center justify-center w-full px-6 py-3 rounded-full text-lg font-semibold tracking-wide
                         bg-gradient-to-r from-indigo-800 to-blue-800 text-white shadow-lg overflow-hidden // Softer gradient, less shadow
                         transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out
                         focus:outline-none focus:ring-4 focus:ring-blue-700/50" // Adjusted focus ring
              disabled={submittingForm || loadingImage}
            >
              {/* Removed glow effect for a more sober look */}
              <span className="relative z-10 flex items-center justify-center">
                {submittingForm ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? "Logging In..." : "Registering..."}
                  </>
                ) : (
                  isLogin ? "Login" : "Create Account"
                )}
              </span>
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-gray-400 mt-6 text-md">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-blue-300 hover:underline font-medium transition-colors duration-200 hover:text-purple-300" // Softer color, subtle hover
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login Here"}
            </button>
          </p>
        </div>

        {/* Right Section - Aesthetic Visual */}
        <div className="hidden md:flex md:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Study and Learning Visual"
            className="w-full h-full object-cover rounded-r-3xl" // Apply rounded corners to match container
          />
          {/* Optional: Dark overlay on image for consistency */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-r-3xl"></div>
          <div className="absolute bottom-8 left-0 right-0 text-white text-center p-4">
            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-fuchsia-300 mb-2">
              Your Learning Journey Starts Here
            </h3>
            <p className="text-gray-300 text-md max-w-sm mx-auto">
              Transform your notes into knowledge with smart, interactive quizzes.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Message Modal */}
      <MessageModal message={message} type={messageType} onClose={() => setMessage(null)} />
    </div>
  );
};

export default AuthPage;
