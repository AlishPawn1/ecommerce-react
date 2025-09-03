import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const REVIEWS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const indexOfFirstReview = (currentPage - 1) * REVIEWS_PER_PAGE;
  const paginatedReviews = reviews.slice(
    indexOfFirstReview,
    indexOfFirstReview + REVIEWS_PER_PAGE,
  );

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${backendUrl}/api/product/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Flatten all reviews with product info
        const allReviews = [];
        res.data.products.forEach((product) => {
          if (product.reviews && product.reviews.length > 0) {
            product.reviews.forEach((review) => {
              allReviews.push({
                ...review,
                productName: product.name,
                productId: product._id,
              });
            });
          }
        });
        setReviews(allReviews);
      } catch (err) {
        setError("Failed to fetch reviews");
        toast.error("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleDelete = async (productId, reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${backendUrl}/api/product/reviews/${productId}/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setReviews(
        reviews.filter(
          (r) => !(r.productId === productId && r._id === reviewId),
        ),
      );
      toast.success("Review deleted successfully");
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <section className="review-table">
      <div className="container">
        <div className="main-title">
          <h1 className="title">Product Reviews</h1>
        </div>
        {paginatedReviews.length === 0 ? (
          <div className="text-center py-5">No reviews found.</div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table
                className="table table-bordered"
                style={{ minWidth: "900px", width: "100%", textWrap: "nowrap" }}
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Reviewer</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReviews.map((review, idx) => (
                    <tr key={review._id}>
                      <td>{indexOfFirstReview + idx + 1}</td>
                      <td>{review.productName}</td>
                      <td>{review.username}</td>
                      <td>{review.rating}</td>
                      <td>{review.comment}</td>
                      <td>{new Date(review.date).toLocaleString()}</td>
                      <td>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() =>
                            handleDelete(review.productId, review._id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <nav
              className="pagination justify-content-center gap-2 mt-4"
              aria-label="Review pagination"
            >
              <button
                style={{
                  height: "25px",
                  width: "25px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "#000",
                  transition: "background-color 0.3s",
                  borderRadius: "5px",
                  backgroundColor: currentPage === 1 ? "#e0e0e0" : "#000",
                  color: currentPage === 1 ? "#888" : "#fff",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor = "#333";
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor = "#000";
                }}
              >
                <AiOutlineLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    style={{
                      height: "25px",
                      width: "25px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: "#000",
                      transition: "background-color 0.3s",
                      borderRadius: "5px",
                      backgroundColor: currentPage === page ? "#000" : "#fff",
                      color: currentPage === page ? "#fff" : "#000",
                      cursor: "pointer",
                    }}
                    onClick={() => handlePageChange(page)}
                    onMouseEnter={(e) => {
                      if (currentPage !== page)
                        e.currentTarget.style.backgroundColor = "#ddd";
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== page)
                        e.currentTarget.style.backgroundColor = "#fff";
                    }}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                style={{
                  height: "25px",
                  width: "25px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "#000",
                  transition: "background-color 0.3s",
                  borderRadius: "5px",
                  backgroundColor:
                    currentPage === totalPages ? "#e0e0e0" : "#000",
                  color: currentPage === totalPages ? "#888" : "#fff",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor = "#333";
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor = "#000";
                }}
              >
                <AiOutlineRight />
              </button>
            </nav>
          </>
        )}
      </div>
    </section>
  );
};

export default Review;
