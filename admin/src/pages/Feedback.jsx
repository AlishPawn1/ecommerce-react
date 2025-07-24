import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const feedbackPerPage = 10;

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('/api/contact-messages');
        setFeedback(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch feedback');
        setLoading(false);
        console.error('Error fetching feedback:', err);
      }
    };

    fetchFeedback();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(feedback.length / feedbackPerPage);
  const indexOfLast = currentPage * feedbackPerPage;
  const indexOfFirst = indexOfLast - feedbackPerPage;
  const currentFeedback = feedback.slice(indexOfFirst, indexOfLast);

  if (loading) return <div className="text-center">Loading feedback...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  const paginationBtnStyle = {
    height: '25px',
    width: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    transition: 'background-color 0.3s',
    borderRadius: '5px',
  };

  return (
    <section className="feedback-section section-gaps">
      <div className="container">
        <table className="table text-center table-bordered">
          <thead>
            <tr>
              <th>S.no</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {currentFeedback.length > 0 ? (
              currentFeedback.map((item, index) => (
                <tr key={item._id || index}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No feedback available</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav className="pagination justify-content-center gap-2 mt-6" aria-label="Feedback pagination">
            <button
              style={{
                ...paginationBtnStyle,
                backgroundColor: currentPage === 1 ? '#e0e0e0' : '#000',
                color: currentPage === 1 ? '#888' : '#fff',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              onMouseEnter={e => {
                if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#333';
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#000';
              }}
            >
              <AiOutlineLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                style={{
                  ...paginationBtnStyle,
                  backgroundColor: currentPage === page ? '#000' : '#fff',
                  color: currentPage === page ? '#fff' : '#000',
                  cursor: 'pointer',
                }}
                onClick={() => setCurrentPage(page)}
                onMouseEnter={e => {
                  if (currentPage !== page) e.currentTarget.style.backgroundColor = '#ddd';
                }}
                onMouseLeave={e => {
                  if (currentPage !== page) e.currentTarget.style.backgroundColor = '#fff';
                }}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            ))}
            <button
              style={{
                ...paginationBtnStyle,
                backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#000',
                color: currentPage === totalPages ? '#888' : '#fff',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              onMouseEnter={e => {
                if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#333';
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#000';
              }}
            >
              <AiOutlineRight />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
};

export default Feedback;
