import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

const Subscriptions = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const subsPerPage = 10;

  useEffect(() => {
    const fetchSubs = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        try {
          res = await axios.get(`${backendUrl}/api/newsletter`);
        } catch {
          res = await axios.get(`${backendUrl}/api/subscribe`);
        }
        setSubs(res.data.subscribers || res.data.subs || []);
      } catch (err) {
        setError('Failed to fetch subscriptions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  // Filtered and paginated subscriptions
  const filteredSubs = subs.filter(sub =>
    sub.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredSubs.length / subsPerPage);
  const indexOfLast = currentPage * subsPerPage;
  const indexOfFirst = indexOfLast - subsPerPage;
  const currentSubs = filteredSubs.slice(indexOfFirst, indexOfLast);

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
    <section className="max-w-3xl mx-auto my-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Newsletter Subscriptions</h2>
      <div className="mb-4 flex flex-col sm:flex-row gap-2 justify-between items-center">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />
        <span className="text-gray-500 text-sm">Total: {filteredSubs.length}</span>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white text-sm">
            <thead className="sticky top-0 z-10 bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left">#</th>
                <th className="py-3 px-4 border-b text-left">Email</th>
                <th className="py-3 px-4 border-b text-left">Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {currentSubs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">No subscriptions found.</td>
                </tr>
              ) : (
                currentSubs.map((sub, idx) => (
                  <tr
                    key={sub._id || sub.email}
                    className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="py-2 px-4 border-b">{indexOfFirst + idx + 1}</td>
                    <td className="py-2 px-4 border-b">{sub.email}</td>
                    <td className="py-2 px-4 border-b">{new Date(sub.subscribedAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="pagination justify-content-center gap-2 mt-6" aria-label="Subscriptions pagination">
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
    </section>
  );
};

export default Subscriptions; 