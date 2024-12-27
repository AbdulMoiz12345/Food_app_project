import React from 'react';
import './Sellercard.css';
const SellerCard = ({ foodItem, onDelete, onUpdate }) => {
  const { _id, category, name, imageUrl, options, description } = foodItem;

  return (
    <div className="seller-card">
      <img src={imageUrl} alt={name} />
      <h3>{name}</h3>
      <p>Category: {category}</p>
      <p>Description: {description}</p>
      <h4>Options:</h4>
      <ul>
        {options.map((option, index) => (
          <li key={index}>
            {option.type} - Price: {option.price}rs
          </li>
        ))}
      </ul>
      <button onClick={() => onUpdate(_id)}>Update</button>
      <button onClick={() => onDelete(_id)}>Delete</button>
    </div>
  );
};

export default SellerCard;
