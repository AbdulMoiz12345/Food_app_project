import React, { useEffect, useState, useContext } from 'react';
import { Itemcontext } from '../../ShopContextProvider';
import axios from 'axios';
import './SellerCompletedOrder.css';

const SellerCompletedOrder = () => {
  const { sellerId } = useContext(Itemcontext);
  const [completedOrders, setCompletedOrders] = useState([]);
  // Fetch orders when the component loads
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/seller-completed-orders/${sellerId}`);
        const { completedOrders } = response.data; // Assuming the API returns orders, madeOrders, and completedOrders
        setCompletedOrders(completedOrders); // Set completed orders
      } catch (error) {
        console.error('Error fetching customer orders:', error);
      }
    };

    fetchOrders();
  }, [sellerId]); // Fetch orders only when the buyerId changes
  return (
    <div className="customer-orders-container">
      <h2 className="orders-header">Your Orders</h2>
       {/* Completed Orders */}
       <div className="completed-orders-container">
        <h3 className="completed-orders-header">Completed Orders</h3>
        {completedOrders.length === 0 ? (
          <p className="no-orders-message">No completed orders.</p>
        ) : (
          <ul className="orders-list">
            {completedOrders.map((order) => (
              <li key={order.orderId} className="order-item">
                <div className="order-details">
                  <h4 className="food-name">{order.foodName}</h4>
                  <p className="order-quantity">Quantity: {order.quantity}</p>
                  <p className="order-price">Price: ${order.price.toFixed(2)}</p>
                  <p className="order-status">Status: <strong style={{color: 'green'}}>Completed</strong></p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default SellerCompletedOrder
