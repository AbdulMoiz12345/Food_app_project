import React, { useContext } from 'react';
import { Itemcontext } from '../../ShopContextProvider';
import './Cartitem.css';
export default function Cartitem({ item }) {
  const { cartitem, setcartitem } = useContext(Itemcontext);

  const handleDelete = () => {
    // Use foodId as the unique identifier for deletion
    const updatedCart = cartitem.filter((cartItem) => cartItem.foodId !== item.foodId);
    console.log(item.foodId)
    setcartitem(updatedCart);
  };
  

  return (
    <tr>
      <th className='th1'><img src={item.Image} alt={item.name} /></th>
      <th className='th1'>{item.name}</th>
      <th className='th1'>{item.quantity}</th>
      <th className='th1'>{item.amount}</th>
      <th className='th1'>{item.price}</th>
      <th className='th1'>
        <button className='delete' onClick={handleDelete}>
          Delete
        </button>
      </th>
    </tr>
  );
}
