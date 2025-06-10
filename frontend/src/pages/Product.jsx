import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProduct";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
    const { productId } = useParams();
    const { products, currency, addToCart, token, user, incrementViewCount, addReview } = useContext(ShopContext);
    const [productData, setProductData] = useState(null);
    const [image, setImage] = useState("");
    const [size, setSize] = useState("");
    const [activeTab, setActiveTab] = useState("description");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false); // New state to track review submission

    useEffect(() => {
        if (products.length > 0) {
            const foundProduct = products.find((item) => item._id === productId);
            if (foundProduct) {
                setProductData(foundProduct);
                setImage(foundProduct.image?.[0] || assets.placeholderImage);
                incrementViewCount(productId);
            } else {
                console.warn(`⚠️ Product with ID ${productId} not found.`);
            }
        }
    }, [products, productId, incrementViewCount]);

    const handleAddToCart = () => {
        if (productData?.stock <= 0) {
            toast.error("This product is out of stock.");
            return;
        }
        if (!size) {
            toast.error("Please select a size before adding to the cart.");
            return;
        }
        addToCart(productData?._id, size);
        toast.success("Product added to cart!");
    };

    const handleAddReview = async (e) => {
        console.log("Form submission triggered");
        e.preventDefault(); // Prevent default form submission behavior
        if (isSubmitting) return;
        setIsSubmitting(true);
        console.log("after prevent defiult");

        if (!token) {
            toast.error("Please log in to submit a review.");
            setIsSubmitting(false);
            return;
        }

        if (!rating || !comment) {
            toast.error("Please provide a rating and comment.");
            setIsSubmitting(false);
            return;
        }

        if (!user?.userId || !user?.name) {
            toast.error("User information is missing. Please log in again.");
            setIsSubmitting(false);
            return;
        }

        try {
            const reviewData = {
                rating,
                comment,
                userId: user.userId,
                username: user.name.trim()
            };
            console.log("Review payload:", reviewData); // Debug payload
            await addReview(productId, reviewData);

            if (!reviewSubmitted) {
                toast.success("Review submitted successfully!");
                setReviewSubmitted(true); // Set the flag to prevent duplicate toasts
            }

            setRating(0);
            setComment("");

            // Optimistically update product data after review submission
            const updatedProduct = {
                ...productData,
                reviews: [...(productData.reviews || []), reviewData], // Add the new review
                reviewCount: (productData.reviewCount || 0) + 1, // Increment review count
                averageRating: calculateNewAverageRating(productData, rating), // Recalculate average rating
            };
            setProductData(updatedProduct);

        } catch (error) {
            toast.error("Failed to submit review.");
            console.error("Error submitting review:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to calculate the new average rating
    const calculateNewAverageRating = (product, newRating) => {
        const currentAverage = product.averageRating || 0;
        const currentReviewCount = product.reviewCount || 0;
        const totalRating = currentAverage * currentReviewCount;
        const newTotalRating = totalRating + newRating;
        const newReviewCount = currentReviewCount + 1;
        return newTotalRating / newReviewCount;
    };

    // Reset reviewSubmitted when the productId changes
    useEffect(() => {
        setReviewSubmitted(false);
    }, [productId]);

    return productData ? (
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
                            <h1 className="text-2xl font-medium">{productData?.name || "Unknown Product"}</h1>
                            <p className="text-xl font-semibold mt-4">
                                {currency}
                                {productData?.price || "N/A"}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <p className="text-gray-600">
                                    {productData?.averageRating?.toFixed(1)} ({productData?.reviewCount} reviews)
                                </p>
                            </div>
                            <p className="text-gray-600 mt-2">{productData?.description || "No description available."}</p>

                            {productData?.size?.length > 0 && (
                                <div className="flex flex-col gap-4 my-8">
                                    <p>Select Size</p>
                                    <div className="flex gap-2">
                                        {productData?.size?.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSize(item)}
                                                className={`border p-2 bg-gray-100 ${item === size ? "border-orange-500" : ""
                                                    } ${productData?.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                disabled={productData?.stock <= 0}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleAddToCart}
                                className={`bg-black text-white px-8 py-3 text-sm uppercase active:bg-gray-700 ${productData?.stock <= 0 || !size ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                    }`}
                                disabled={productData?.stock <= 0 || !size}
                            >
                                {productData?.stock <= 0 ? "Out of Stock" : "Add to Cart"}
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
                                <p>{productData?.description || "No description available."}</p>
                                {productData?.additionalDescription && (
                                    <p>{productData?.additionalDescription}</p>
                                )}
                            </div>
                        )}
                        {activeTab === "reviews" && (
                            <div className="flex flex-col gap-6">
                                {token ? (
                                    <form onSubmit={handleAddReview} method="post" className="flex flex-col gap-4">
                                        <div>
                                            <p className="mb-2">Your Rating</p>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                                                        onClick={() => setRating(star)}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="mb-2">Your Review</p>
                                            <textarea
                                                className="w-full px-3 py-2 border rounded-lg"
                                                rows="4"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Write your review here..."
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-32 cursor-pointer py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Submitting..." : "Submit Review"}
                                        </button>
                                    </form>
                                ) : (
                                    <p>Please log in to submit a review.</p>
                                )}

                                {productData?.reviews?.length > 0 ? (
                                    productData.reviews.map((review, index) => (
                                        <div key={index} className="border-t pt-4">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{review.username}</p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(review.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 my-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`text-xl ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <p>{review.comment}</p>
                                        </div>
                                    ))
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
                    />
                )}
            </div>
        </section>
    ) : (
        <div className="text-center py-20">Loading product...</div>
    );
};

export default Product;