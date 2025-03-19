import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');

      console.log(response.data.products); // Log the product list for debugging

      if (response.data.products) {
        setList(response.data.products); // Set the list state with the fetched products
      } else {
        toast.error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      toast.error(error.message || 'Error occurred while fetching products');
    }
  };

  useEffect(() => {
    fetchList(); // Fetch the product list when the component mounts
  }, []);

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);

        // Remove the deleted product from the list state without re-fetching
        setList((prevList) => prevList.filter((product) => product._id !== id)); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'Error occurred while deleting the product');
    }
  };

  return (
    <>
      <p className="text-xl font-semibold mb-4">All Product List</p>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white border-collapse shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">SubCategory</th>
              <th className="px-4 py-2 text-left">Sizes</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {list.length > 0 ? (
              list.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">
                    {product.image && product.image[0] ? (
                      <img
                        src={product.image[0]} // Assuming the image is in the first position in the array
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.description}</td>
                  <td className="px-4 py-2">{currency}{product.price}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.subCategory}</td>
                  <td className="px-4 py-2">
                    {product.size && product.size.length > 0
                      ? product.size.join(', ') // Join array of sizes into a string
                      : 'No sizes available'}
                  </td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2">
                    {/* Add your edit and delete actions here */}
                    <button className="px-3 py-1 bg-blue-500 text-white cursor-pointer rounded-md hover:bg-blue-600 transition duration-200">
                      Edit
                    </button>
                    <button 
                      onClick={() => removeProduct(product._id)}  // Use _id for the delete
                      className="px-3 py-1 bg-red-500 text-white cursor-pointer rounded-md hover:bg-red-600 transition duration-200 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-2 text-center">
                  No products available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default List;
