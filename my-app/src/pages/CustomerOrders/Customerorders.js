import React, { useEffect, useState, useContext } from 'react';
import { Itemcontext } from '../../ShopContextProvider';
import axios from 'axios';
import './Customerorders.css';

const Customerorders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [onTheWayOrders, setOnTheWayOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const { buyerId } = useContext(Itemcontext);

  // Fetch orders when the component loads
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/customer-orders/${buyerId}`);
        const { orders, madeOrders, completedOrders } = response.data; // Assuming the API returns orders, madeOrders, and completedOrders

        setPendingOrders(orders); // Set pending orders
        setOnTheWayOrders(madeOrders); // Set "on the way" orders
        setCompletedOrders(completedOrders); // Set completed orders
      } catch (error) {
        console.error('Error fetching customer orders:', error);
      }
    };

    fetchOrders();
  }, [buyerId]); // Fetch orders only when the buyerId changes

  return (
    <div className="customer-orders-container">
      <h2 className="orders-header">Your Orders</h2>

      {/* Pending Orders */}
      <div className="pending-orders-container">
        <h3 className="pending-orders-header">Pending Orders</h3>
        {pendingOrders.length === 0 ? (
          <p className="no-orders-message">No pending orders.</p>
        ) : (
          <ul className="orders-list">
            {pendingOrders.map((order) => (
              <li key={order.orderId} className="order-item">
                <div className="order-details">
                  <h4 className="food-name">{order.name}</h4>
                  <p className="order-quantity">Quantity: {order.quantity}</p>
                  <p className="order-price">Price: ${order.price.toFixed(2)}</p>
                  <p className="order-status">Status: <strong>Pending</strong></p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* On The Way Orders */}
      <div className="on-the-way-orders-container">
        <h3 className="on-the-way-orders-header">On The Way</h3>
        {onTheWayOrders.length === 0 ? (
          <p className="no-orders-message">No orders on the way.</p>
        ) : (
          <ul className="orders-list">
            {onTheWayOrders.map((order) => (
              <li key={order.orderId} className="order-item">
                <div className="order-details">
                  <h4 className="food-name">{order.foodName}</h4>
                  <p className="order-quantity">Quantity: {order.quantity}</p>
                  <p className="order-price">Price: ${order.price.toFixed(2)}</p>
                  <p className="order-status">Status: <strong style={{color: '#2196F3'}}>On The Way</strong></p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

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
  );
};

export default Customerorders;
