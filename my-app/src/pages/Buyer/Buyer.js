import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Buyer.css';
import Card from '../../components/Card/Card';

const Buyer = () => {
  const [items, setItems] = useState([]); // State to hold food items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-foods');
        setItems(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="buyer-container">
      <h1>Buyer Page</h1>
      {/* Search */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>
      <div className="items-list">
        {filteredItems.map((item) => (
          <Card key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Buyer;
