import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        setUsers(users.filter(user => user.user_id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
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
          <h1 className="heading text-center">No User Found!</h1>
        ) : (
          <>
            <h3 className="text-center heading">All users</h3>
            <table className="table table-bordered mt-5">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>User name</th>
                  <th>User email</th>
                  <th>User image</th>
                  <th>User address</th>
                  <th>User mobile</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr className="text-center" key={user.user_id}>
                    <td data-label="S. No">{index + 1}</td>
                    <td data-label="User name">{user.user_name}</td>
                    <td data-label="User email">{user.user_email}</td>
                    <td data-label="User image">
                      <img 
                        src={`/user_area/user_image/${user.user_image}`} 
                        height="100" 
                        width="100" 
                        alt={user.user_name}
                      />
                    </td>
                    <td data-label="User address">{user.user_address}</td>
                    <td data-label="User mobile">{user.user_mobile}</td>
                    <td data-label="Delete">
                      <button 
                        onClick={() => handleDeleteUser(user.user_id)} 
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