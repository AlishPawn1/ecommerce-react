import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users from:', `${backendUrl}/api/user/users`);
        const response = await axios.get(`${backendUrl}/api/user/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`, // Assuming admin token is stored in localStorage
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
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`, // Include admin token
          },
        });
        setUsers(users.filter(user => user._id !== userId));
        alert('User deleted successfully');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
      }
    }
  };

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
                {users.map((user, index) => (
                  <tr className="text-center" key={user._id}>
                    <td data-label="S. No">{index + 1}</td>
                    <td data-label="User Name">{user.name}</td>
                    <td data-label="User Email">{user.email}</td>
                    <td data-label="User Image">
                      <img
                        src={user.image || '/default-image.jpg'}
                        height="100"
                        width="100"
                        alt={user.name}
                        onError={(e) => (e.target.src = '/default-image.jpg')} // Fallback if image fails to load
                      />
                    </td>
                    <td data-label="User Address">{user.address}</td>
                    <td data-label="User Mobile">{user.number}</td>
                    <td data-label="Delete">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
};

export default ListUser;