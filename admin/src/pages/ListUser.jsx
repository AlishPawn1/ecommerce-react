import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

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

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users from:', `${backendUrl}/api/user/users`);
        const response = await axios.get(`${backendUrl}/api/user/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        console.log('Response data:', response.data);
        setUsers(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch users';
        setError(errorMessage);
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${backendUrl}/api/user/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        setUsers(users.filter((user) => user._id !== userId));
        alert('User deleted successfully');
        // Reset page if current page becomes empty after deletion
        const maxPage = Math.ceil((users.length - 1) / usersPerPage);
        if (currentPage > maxPage) setCurrentPage(maxPage);
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  if (loading) {
    return (
      <section className="section-gaps list-order">
        <div className="container">
          <div className="text-center py-5">Loading users...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-gaps list-order">
        <div className="container">
          <div className="text-center py-5 text-danger">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-gaps list-order">
      <div className="container">
        {users.length === 0 ? (
          <h1 className="heading text-center">No Users Found!</h1>
        ) : (
          <>
            <h3 className="text-center heading">All Users</h3>
            <table className="table table-bordered mt-5">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>User Image</th>
                  <th>User Address</th>
                  <th>User Mobile</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr className="text-center" key={user._id}>
                    <td data-label="S. No">{indexOfFirstUser + index + 1}</td>
                    <td data-label="User Name">{user.name}</td>
                    <td data-label="User Email">{user.email}</td>
                    <td data-label="User Image">
                      <img
                        src={user.image || assets.fallback_image}
                        height="100"
                        width="100"
                        alt={user.name}
                        onError={(e) => (e.target.src = '/default-image.jpg')}
                      />
                    </td>
                    <td data-label="User Address">{user.address}</td>
                    <td data-label="User Mobile">{user.number}</td>
                    <td data-label="Delete">
                      <button onClick={() => handleDeleteUser(user._id)} className="btn btn-red">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <nav className="pagination justify-content-center mt-5" aria-label="User list pagination">
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
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#333';
                }}
                onMouseLeave={(e) => {
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
                  onMouseEnter={(e) => {
                    if (currentPage !== page) e.currentTarget.style.backgroundColor = '#ddd';
                  }}
                  onMouseLeave={(e) => {
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
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#333';
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#000';
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

export default ListUser;
