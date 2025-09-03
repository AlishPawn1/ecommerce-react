import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    address: "",
    image: null,
    password: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const { navigate } = useContext(ShopContext);

  // Fetch user profile data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfile = axios.get(`${backendUrl}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const fetchOrders = axios.post(
      `${backendUrl}/api/order/userorders`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const fetchReviews = axios.get(
      `${backendUrl}/api/product/my-reviews/count`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    Promise.all([fetchProfile, fetchOrders, fetchReviews])
      .then(([profileRes, ordersRes, reviewsRes]) => {
        setUser(profileRes.data.user);
        setFormData({
          name: profileRes.data.user.name,
          number: profileRes.data.user.number,
          address: profileRes.data.user.address,
          image: null,
          password: "",
          email: profileRes.data.user.email,
        });
        if (ordersRes.data.success)
          setTotalOrders(ordersRes.data.orders.length);
        if (reviewsRes.data.success)
          setTotalReviews(reviewsRes.data.totalReviews);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load data");
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.number || !/^(9[876]\d{8})$/.test(formData.number)) {
      errors.number =
        "Phone number must be 10 digits starting with 98, 97, or 96";
    }
    if (!formData.address || formData.address.trim().split(" ").length < 2) {
      errors.address = "Address must contain at least 2 words";
    }
    if (formData.password && formData.password.length < 8) {
      errors.password =
        "Password must be at least 8 characters if you want to change it";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("number", formData.number);
      formDataToSend.append("address", formData.address);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }

      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setUser(response.data.user);
      setIsEditing(false);
      setFormErrors({});
      toast.success("Update successfully");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={user.image ? `${user.image}` : assets.fallback_image}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-indigo-200 transition-transform duration-300 hover:rotate-6"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-pink-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4">
            {user.name}
          </h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <p className="text-gray-600 text-center mt-3">
            {user.isVerified ? "Verified" : "Not Verified"}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center hover:bg-indigo-50">
            <p className="text-xs text-gray-500 uppercase">Phone</p>
            <p className="text-gray-800 font-medium">{user.number}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center hover:bg-indigo-50">
            <p className="text-xs text-gray-500 uppercase">Address</p>
            <p className="text-gray-800 font-medium">{user.address}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center hover:bg-indigo-50">
            <p className="text-xs text-gray-500 uppercase">Total Orders</p>
            <p className="text-gray-800 font-medium">{totalOrders}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center hover:bg-indigo-50">
            <p className="text-xs text-gray-500 uppercase">Total Reviews</p>
            <p className="text-gray-800 font-medium">{totalReviews}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/order")}
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-all duration-300"
          >
            View Orders
          </button>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-[#00000033] backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
              <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm">{formErrors.name}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  {formErrors.number && (
                    <p className="text-red-500 text-sm">{formErrors.number}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm">{formErrors.address}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    disabled
                    className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Password field with show/hide */}
                <div className="mb-4">
                  <label className="block text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded pr-10"
                      placeholder="Password"
                    />
                    <div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <IoEyeOffOutline size={20} />
                      ) : (
                        <IoEyeOutline size={20} />
                      )}
                    </div>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-500 text-sm">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Profile Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormErrors({});
                      setFormData({ ...formData, password: "", image: null });
                    }}
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
