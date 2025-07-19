import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

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
        <div className="flex justify-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 cursor-pointer"
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 cursor-pointer"
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default Subscriptions; 