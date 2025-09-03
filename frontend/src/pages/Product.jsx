import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProduct";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../App"; // Adjust path if needed

const Product = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    currency,
    addToCart,
    token,
    user,
    incrementViewCount,
    addReview,
    deleteReview,
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [showAll, setShowAll] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  // Fetch product data whenever slug changes
  useEffect(() => {
    if (!slug) return;
    axios
      .get(`${backendUrl}/api/product/slug/${slug}`)
      .then((res) => {
        if (res.data.success) {
          setProductData(res.data.product);
          setImage(res.data.product.image?.[0] || assets.placeholderImage);
        } else {
          toast.error("Product not found");
          navigate("/collection");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error loading product");
        navigate("/collection");
      });
  }, [slug, navigate]);

  // Increment view count only once when product data is loaded for a new product
  useEffect(() => {
    if (productData?._id) {
      incrementViewCount(productData._id);
    }
    // Only run when productData._id changes
    // eslint-disable-next-line
  }, [productData?._id]);

  useEffect(() => {
    setVisibleReviews(3);
    setShowAll(false);
    setReviewSubmitted(false);
    setRating(0);
    setComment("");
    setSize("");
    setEditingReviewId(null);
    setMenuOpenId(null);
  }, [slug]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddToCart = () => {
    if (!token) {
      toast.error("Please log in to add to cart.");
      navigate("/login");
      return;
    }
    if (productData?.stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }
    if (!size) {
      toast.error("Please select a size before adding to the cart.");
      return;
    }
    addToCart(productData?._id, size);
  };

  const isReviewOwner = (reviewUserId) => {
    if (!user || !reviewUserId) return false;
    const currentUserId = user._id || user.userId;
    return String(reviewUserId) === String(currentUserId);
  };

  const hasUserReviewed = () => {
    if (!user || !productData?.reviews) return false;
    return productData.reviews.some((review) => isReviewOwner(review.user));
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Prevent multiple reviews: only allow if not reviewed or editing
    if (hasUserReviewed() && !editingReviewId) {
      toast.error(
        "You have already submitted a review. Edit or delete your existing review.",
      );
      setIsSubmitting(false);
      return;
    }

    if (!token) {
      toast.error("Please log in to submit a review.");
      setIsSubmitting(false);
      navigate("/login");
      return;
    }
    if (!rating || !comment.trim()) {
      toast.error("Please provide a rating and comment.");
      setIsSubmitting(false);
      return;
    }
    if (!user?.userId && !user?._id) {
      toast.error("User info missing. Please log in again.");
      setIsSubmitting(false);
      navigate("/login");
      return;
    }

    try {
      const reviewData = {
        rating,
        comment: comment.trim(),
        date: new Date().toISOString(),
      };

      if (editingReviewId) {
        reviewData._id = editingReviewId;
      }

      console.log("Submitting review with data:", reviewData);
      const response = await addReview(productData._id, reviewData);

      if (response.success) {
        setReviewSubmitted(true);
        // Refresh product data
        const res = await axios.get(`${backendUrl}/api/product/slug/${slug}`);
        if (updateReviewCountAndAverage(res.data.product)) {
          setProductData(res.data.product);
          setImage(res.data.product.image?.[0] || assets.placeholderImage);
        }
        // Reset form
        setRating(0);
        setComment("");
        setEditingReviewId(null);
      } else {
        // Only show error if not handled in context
        // toast.error(response.message || "Failed to submit review.");
      }
    } catch (error) {
      // Only show error if not handled in context
      // toast.error("Failed to submit review.");
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateReviewCountAndAverage = (product) => {
    if (!product || !product.reviews) return false;
    const reviewCount = product.reviews.length;
    const averageRating =
      reviewCount > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        : 0;
    product.reviewCount = reviewCount;
    product.averageRating = averageRating;
    return true;
  };

  const handleEditClick = (review) => {
    console.log("Edit clicked for review:", review._id);
    setEditingReviewId(review._id);
    setRating(review.rating);
    setComment(review.comment);
    setMenuOpenId(null);
    setActiveTab("reviews");
  };

  const handleDeleteReviewMenu = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(productData._id, reviewId);
      // No toast here; handled in context
      // Update state by removing deleted review
      const filteredReviews = productData.reviews.filter(
        (r) => r._id !== reviewId,
      );
      setProductData({
        ...productData,
        reviews: filteredReviews,
        reviewCount: filteredReviews.length,
        averageRating:
          filteredReviews.length > 0
            ? filteredReviews.reduce((acc, r) => acc + r.rating, 0) /
              filteredReviews.length
            : 0,
      });
      setMenuOpenId(null);
    } catch (error) {
      // Only show error if not handled in context
      // toast.error("Failed to delete review.");
      console.error("Delete review error:", error);
    }
  };

  const handleToggleReviews = () => {
    if (showAll) {
      setVisibleReviews(3);
      setShowAll(false);
    } else {
      setVisibleReviews(productData?.reviews?.length || 3);
      setShowAll(true);
    }
  };

  if (!productData)
    return <div className="text-center py-20">Loading product...</div>;

  return (
    <section className="product-detail-section">
      <div className="container">
        <div className="transition-opacity ease-in duration-500 opacity-100">
          <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
            <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
              <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-normal sm:w-[18.7%] w-full">
                {productData?.image?.map((item, index) => (
                  <img
                    key={index}
                    src={item}
                    className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                    alt={`Product ${index + 1}`}
                    onClick={() => setImage(item)}
                  />
                ))}
              </div>
              <div className="flex-1 flex items-center justify-center relative">
                <img
                  src={image}
                  className="max-w-full max-h-[400px] object-contain"
                  alt="Selected Product"
                />
                {productData?.stock <= 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-medium">
                {productData?.name || "Unknown Product"}
              </h1>
              <p className="text-xl font-semibold mt-4">
                {currency}
                {productData?.price || "N/A"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-gray-600">
                  {productData?.averageRating?.toFixed(1)} (
                  {productData?.reviewCount} reviews)
                </p>
              </div>
              <p className="text-gray-600 mt-2">
                {productData?.description || "No description available."}
              </p>

              {productData?.size?.length > 0 && (
                <div className="flex flex-col gap-4 my-8">
                  <p>Select Size</p>
                  <div className="flex gap-2">
                    {productData?.size?.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setSize(item)}
                        className={`border py-2 px-4 bg-gray-100 ${
                          item === size ? "border-orange-500" : ""
                        } ${
                          productData?.stock <= 0 || !token
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={productData?.stock <= 0 || !token}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className={`bg-black text-white px-8 py-3 text-sm uppercase active:bg-gray-700 ${
                  productData?.stock <= 0 || !size || !token
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                disabled={productData?.stock <= 0 || !size || !token}
                title={!token ? "Please log in to add to cart" : ""}
              >
                {productData?.stock <= 0
                  ? "Out of Stock"
                  : !token
                    ? "Login to Add to Cart"
                    : "Add to Cart"}
              </button>

              <hr className="mt-8 sm:w-4/5" />

              <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                <p>100% Original product.</p>
                <p>Cash on delivery is available on this product.</p>
                <p>Easy return and exchange policy within 7 days.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="flex">
            <button
              className={`border px-5 py-3 text-sm ${activeTab === "description" ? "bg-gray-100" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`border px-5 py-3 text-sm ${activeTab === "reviews" ? "bg-gray-100" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({productData?.reviewCount || 0})
            </button>
          </div>
          <div className="border p-6 text-sm text-gray-500">
            {activeTab === "description" && (
              <div className="flex flex-col gap-4">
                {productData?.additionalDescription && (
                  <p>{productData?.additionalDescription}</p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="flex flex-col gap-6">
                {token ? (
                  !hasUserReviewed() || editingReviewId ? (
                    <form
                      onSubmit={handleAddReview}
                      method="post"
                      className="flex flex-col gap-4"
                    >
                      <div>
                        <p className="mb-2">Your Rating</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`cursor-pointer text-2xl ${
                                star <= rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              onClick={() => setRating(star)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2">
                          {editingReviewId ? "Edit Your Review" : "Your Review"}
                        </p>
                        <textarea
                          className="w-full px-3 py-2 border rounded-lg"
                          rows="4"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Write your review here..."
                        ></textarea>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="w-32 cursor-pointer py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? "Submitting..."
                            : editingReviewId
                              ? "Update Review"
                              : "Submit Review"}
                        </button>
                        {editingReviewId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingReviewId(null);
                              setRating(0);
                              setComment("");
                            }}
                            className="w-32 cursor-pointer py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </form>
                  ) : (
                    <p className="text-gray-600">
                      You have already submitted a review. Use the three-dot
                      menu on your review to edit or delete it.
                    </p>
                  )
                ) : (
                  <p>Please log in to submit a review.</p>
                )}

                {productData?.reviews?.length > 0 ? (
                  <>
                    {productData.reviews
                      .slice(0, visibleReviews)
                      .map((review, index) => {
                        console.log(
                          "Review:",
                          review,
                          "review.user:",
                          review.user,
                          "Current user._id:",
                          user && user._id,
                          "isReviewOwner:",
                          isReviewOwner(review.user),
                        );
                        return (
                          <div
                            key={review._id || index}
                            className="border-t pt-4 relative"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{review.username}</p>
                                <p className="text-xs text-gray-400">
                                  {review.date
                                    ? new Date(review.date).toLocaleDateString()
                                    : "Unknown Date"}
                                </p>
                              </div>

                              {isReviewOwner(review.user) && (
                                <div className="relative" ref={menuRef}>
                                  <button
                                    onClick={() =>
                                      setMenuOpenId(
                                        menuOpenId === review._id
                                          ? null
                                          : review._id,
                                      )
                                    }
                                    className="text-gray-600 hover:text-gray-900"
                                    aria-label="Review actions"
                                  >
                                    ⋮
                                  </button>
                                  {menuOpenId === review._id && (
                                    <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-300 rounded shadow-md z-10">
                                      <button
                                        onClick={() => handleEditClick(review)}
                                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteReviewMenu(review._id)
                                        }
                                        className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-1 my-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-xl ${
                                    star <= review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <p>{review.comment}</p>
                          </div>
                        );
                      })}

                    {productData.reviews.length > 3 && (
                      <button
                        onClick={handleToggleReviews}
                        className="mt-4 w-32 self-center py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
                      >
                        {showAll ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </>
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {productData?.category && (
          <RelatedProduct
            category={productData.category}
            subCategory={productData?.subCategory}
            currentProductId={productData._id}
          />
        )}
      </div>
    </section>
  );
};

export default Product;
