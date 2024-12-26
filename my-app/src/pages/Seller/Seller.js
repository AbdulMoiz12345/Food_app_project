import React, { useState, useEffect, useContext } from 'react';
import { Itemcontext } from '../../ShopContextProvider';
import axios from 'axios';
import SellerCard from '../../components/Sellercard/Sellercard';
import { useHistory } from 'react-router-dom';
import UpdateModal from '../UpdateModal/UpdateModal';
import './Seller.css'

const Seller = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State to control the modal
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const { sellerId, setfoodid } = useContext(Itemcontext); // Use sellerId and setFoodId from context

  useEffect(() => {
    // Fetch all food items for the seller
    const fetchFoodItems = async () => {
      try {
        console.log(sellerId);
        const response = await axios.get(`http://localhost:5000/api/seller-foods/${sellerId}`);
        setFoodItems(response.data);  // Assuming the response is an array of food items
        setLoading(false);
      } catch (error) {
        console.error('Error fetching food items:', error);
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [sellerId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete-food/${id}`);
      setFoodItems(foodItems.filter(item => item._id !== id)); // Remove deleted item from state
    } catch (error) {
      console.error('Error deleting food item:', error);
    }
  };

  const handleUpdate = (id) => {
    setfoodid(id); // Set the selected food ID in context
    setIsUpdateModalOpen(true); // Open the update modal
  };

  // Filter food items based on search term
  const filteredFoodItems = foodItems.filter((foodItem) =>
    foodItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='product_box'>
      <h1 className='product'>Your Products</h1>
      
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for a food item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="seller-products">
        {filteredFoodItems.map((foodItem) => (
          <SellerCard
            key={foodItem._id}
            foodItem={foodItem}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>

      {isUpdateModalOpen && <UpdateModal closeModal={() => setIsUpdateModalOpen(false)} />}
    </div>
  );
};

export default Seller;
