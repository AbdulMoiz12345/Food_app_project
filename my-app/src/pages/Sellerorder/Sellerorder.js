import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import './Sellerorder.css';
import { Itemcontext } from '../../ShopContextProvider';
const Sellerorder = () => {
  const [orders, setOrders] = useState([]);
  const { sellerId } = useContext(Itemcontext);

  // Fetch seller orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/seller-orders', { sellerId });
        setOrders(response.data.orders);
        console.log(orders)
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [sellerId]);

  // Mark an order as complete
  const handleComplete = async (orderId) => {
    try {
      // Call the backend API to complete the order
      const response = await axios.patch(`http://localhost:5000/api/orders/${orderId}/complete`);
      
      if (response.status === 200) {
        // Remove the completed order from the UI
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        alert('Order marked as complete successfully!');
      }
    } catch (error) {
      console.error('Error marking order as complete:', error);
      alert('Failed to mark the order as complete. Please try again.');
    }
  };

  return (
    <div className="seller-orders">
      <h2>Seller Orders</h2>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Buyer ID</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Ordered At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.name}</td>
                <td>{order.buyerId}</td>
                <td>{order.quantity}</td>
                <td>${order.price.toFixed(2)}</td>
                <td>{new Date(order.orderedAt).toLocaleString()}</td>
                <td>
                  <button className="complete-btn" onClick={() => handleComplete(order._id)}>
                    Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Sellerorder;
