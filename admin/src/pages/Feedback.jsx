import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('/api/contact-messages'); // Replace with your actual API endpoint
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

  if (loading) {
    return <div className="text-center">Loading feedback...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <section className="feedback-section section-gaps">
      <div className="container">
        <table className="table text-center table-bordered">
          <thead>
            <tr>
              <th>S.no</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {feedback.length > 0 ? (
              feedback.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.subject}</td>
                  <td>{item.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No feedback available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Feedback;