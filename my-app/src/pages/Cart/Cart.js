import React, { useContext } from 'react';
import { Itemcontext } from '../../ShopContextProvider';
import axios from 'axios';
import './Cart.css';
import Cartitem from '../../components/Cartitem/Cartitem';

export default function Cart() {
  const { cartitem, setcartitem, buyerId } = useContext(Itemcontext);
  const total = cartitem.reduce((acc, currentItem) => acc + currentItem.price, 0);

  const handleCheckout = async () => {
    const endpoint = 'http://localhost:5000/api/orders'; // Replace with your backend URL

    try {
      for (const item of cartitem) {
        const orderData = {
          sellerId: item.sellerId,
          buyerId: buyerId,
          foodId: item.foodId, // Assuming 'amount' holds the food ID
          name: item.name,
          amount: item.amount,
          quantity: item.quantity,
          price: item.price,
          orderedAt: new Date().toISOString(), // Add timestamp
        };
        console.log(cartitem);
        console.log(orderData);

        // Send each item to the backend
        await axios.post(endpoint, orderData);
      }

      // Clear the cart after successful order
      setcartitem([]); // Reset the cart to an empty array
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div>
      {cartitem.length === 0 ? (
        <p className='nothing'>Nothing in cart</p>
      ) : (
        <div>
          <table style={{ color: 'white' }} className='table_cart'>
            <thead>
              <tr>
                <th className='th'>Image</th>
                <th className='th'>Name</th>
                <th className='th'>Quantity</th>
                <th className='th'>Amount</th>
                <th className='th'>Price</th>
                <th className='th'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {cartitem.map((singleItem, index) => (
                <Cartitem key={index} item={singleItem} />
              ))}
            </tbody>
          </table>
          <div className='check'>
            <p>Total: {total}</p>
            <button onClick={handleCheckout}>Check Out</button>
          </div>
        </div>
      )}
    </div>
  );
}
