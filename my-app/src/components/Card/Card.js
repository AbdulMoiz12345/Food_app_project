import React, { useContext, useState } from 'react';
import './Card.css';
import { Itemcontext } from '../../ShopContextProvider';

export default function Card({ item }) {
  const { cartitem, setcartitem } = useContext(Itemcontext);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(item.options[0]?.type); // Default to the first option

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity > 0 ? newQuantity : 1); // Ensure minimum quantity is 1
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleAddToCart = () => {
    const selectedOptionDetails = item.options.find((opt) => opt.type === selectedOption);

    if (!selectedOptionDetails) {
      console.error('Selected option not found');
      return;
    }

    const newItem = {
      Image:item.imageUrl,
      name: item.name,
      quantity,
      amount: selectedOption,
      sellerId: item.sellerId,
      foodId: item._id,
      price: selectedOptionDetails.price * quantity, // Calculate total price
    };

    setcartitem([...cartitem, newItem]);
    console.log(cartitem);
  };

  return (
    <div className="item">
      <img src={item.imageUrl} alt={item.name} />
      <div className='description_food'>
      <h3>{item.name}:</h3>
      <p>{item.description}</p>
      </div>
      <div className="collect">
      <label style={{ color: 'black', fontWeight: 'bold', marginLeft: '10px' ,marginTop:'20px',fontSize:'20px'}}>Quantity:</label>
        <div className="quantity">
          <br />
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            style={{ width: '80px', margin: '10px' }}
          />
        </div>
        <div className="options">
          <select className="select" value={selectedOption} onChange={handleOptionChange}>
            {item.options.map((opt, index) => (
              <option key={index} value={opt.type}>
                {opt.type}: {opt.price}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button className="btn" onClick={handleAddToCart}>
        Add To Cart
      </button>
    </div>
  );
}
