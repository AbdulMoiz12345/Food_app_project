import React, { useState, useEffect, useContext } from 'react';
import { Itemcontext } from '../../ShopContextProvider';
import axios from 'axios';


const UpdateModal = ({ closeModal }) => {
  const { foodid } = useContext(Itemcontext); // Retrieve selected foodId from context
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null); // To store the uploaded image
  const [options, setOptions] = useState([]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedOption, setSelectedOption] = useState(''); // Tracks the selected radio option

  const categories = ['Rice/Biryani', 'Salad', 'Macaroni', 'Chicken', 'Beverages', 'Desserts'];
  const optionList = ['Full', 'Half', 'Quarter', '1 Bowl', '1 Cup'];

  // Fetch existing food data when the component mounts
  useEffect(() => {
    if (foodid) {
      const fetchFoodItem = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/food/${foodid}`);
          const foodItem = response.data;

          setCategory(foodItem.category);
          setName(foodItem.name);
          setOptions(foodItem.options); // Assuming options is an array of objects like [{type: 'Full', price: 500}, ...]
          setDescription(foodItem.description);
        } catch (error) {
          console.error('Error fetching food item:', error);
        }
      };

      fetchFoodItem();
    }
  }, [foodid]);

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

  const deleteOption = (index) => {
    const updatedOptions = options.filter((_, idx) => idx !== index);
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      const response = await axios.put(`http://localhost:5000/api/update-food/${foodid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Food item updated successfully!');
        closeModal(); // Close the modal after successful update
      } else {
        alert('Failed to update food item.');
      }
    } catch (error) {
      console.error('Error updating food item:', error);
      alert('An error occurred while updating the food item.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Update Food Item</h2>
        <button className="close-btn" onClick={closeModal}>X</button>
        <form onSubmit={handleSubmit}>
          <label>
            Category:
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
                {option}
                <input
                  type="radio"
                  name="foodOption"
                  value={option}
                  onChange={() => handleOptionSelect(option)}
                />
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
                  <button type="button" onClick={() => deleteOption(index)}>
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
          <button type="submit">Update Food</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
