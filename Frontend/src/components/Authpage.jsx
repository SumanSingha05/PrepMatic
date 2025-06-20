import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!CLOUD_NAME || !CLOUD_PRESET) {
      alert("Cloudinary config missing");
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
        alert("Image uploaded successfully!");
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingForm(true);

    try {
      const endpoint = isLogin
        ? "http://localhost:8000/api/auth/login"
        : "http://localhost:8000/api/auth/register";

      const response = await axios.post(endpoint, formData);
      alert(`${isLogin ? "Login" : "Signup"} successful`);

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("profileImage", response.data.user.image || "");
      navigate("/userpage");
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle,#1e3a8a_0%,#000_100%)] p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl h-[600px] items-stretch bg-slate-200 bg-opacity-30 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl text-blue-900 font-bold text-center mb-6">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-600 rounded px-4 py-2 bg-transparent text-black"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-600 rounded px-4 py-2 bg-transparent text-black"
                  required
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-600 rounded px-4 py-2 bg-transparent text-black"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-600 rounded px-4 py-2 bg-transparent text-black"
              required
            />

            {!isLogin && (
              <label className="block text-gray-700">
                Upload Profile Picture:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1"
                  disabled={loadingImage}
                />
              </label>
            )}

            <button
              type="submit"
              className="bg-blue-900 text-white w-full py-2 rounded hover:bg-black transition"
              disabled={submittingForm || loadingImage}
            >
              {submittingForm
                ? "Processing..."
                : isLogin
                ? "Login"
                : "Register"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-black mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-blue-900 underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://source.unsplash.com/600x800/?technology,login"
            alt="Login Visual"
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
