import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Itemcontext } from '../../ShopContextProvider';
import './Addnew.css';

const Addnew = () => {
  const { sellerId } = useContext(Itemcontext); // Retrieve sellerId from context

  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null); // To store the uploaded image
  const [options, setOptions] = useState([]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedOption, setSelectedOption] = useState(''); // Tracks the selected radio option

  const categories = ['Rice/Biryani', 'Salad', 'Macaroni', 'Chicken', 'Beverages', 'Desserts'];

  const optionList = ['Full', 'Half', 'Quarter', '1 Bowl', '1 Cup'];

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the uploaded file
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const addOptionPrice = () => {
    if (selectedOption && price) {
      setOptions([...options, { type: selectedOption, price }]);
      setPrice(''); // Reset price input
    } else {
      alert('Please select an option and enter a price');
    }
  };

  const removeOption = (index) => {
    const updatedOptions = options.filter((_, idx) => idx !== index);
    setOptions(updatedOptions); // Remove the option at the clicked index
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sellerId) {
      alert('Seller ID not found. Please log in as a seller.');
      return;
    }

    if (!category || !name || !image || !description || options.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('category', category);
    formData.append('name', name);
    formData.append('image', image);
    formData.append('options', JSON.stringify(options)); // Send options as JSON string
    formData.append('description', description);
    formData.append('sellerId', sellerId);

    try {
      const response = await axios.post('http://localhost:5000/api/add-food', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Food item added successfully!');
      } else {
        alert('Failed to add food item.');
      }
    } catch (error) {
      console.error('Error adding food item:', error);
      alert('An error occurred while adding the food item.');
    }
  };

  return (
    <div className="addnew-container">
      <h2>Add New Food Item</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Category:
          <br></br>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label>
          Name of Food:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter the food name"
          />
        </label>
        <label>
          Upload Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        <div className="options-section">
          <h4>Options:</h4>
          {optionList.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                name="foodOption"
                value={option}
                onChange={() => handleOptionSelect(option)}
              />
              {option}
            </label>
          ))}
          <div className="price-input">
            <label>
              Price:
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price for the selected option"
              />
            </label>
            <button type="button" onClick={addOptionPrice}>
              Add Option
            </button>
          </div>
        </div>
        <div className="added-options">
          <h4>Added Options:</h4>
          <ul>
            {options.map((opt, index) => (
              <li key={index}>
                {opt.type}: {opt.price}
                <button type="button" onClick={() => removeOption(index)} className="remove-btn">
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description of the food"
          />
        </label>
        <button type="submit" className='add_button'>Add Food</button>
      </form>
    </div>
  );
};

export default Addnew;
