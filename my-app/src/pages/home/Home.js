import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom"; 
import pic1 from "../../assets/food_1.png";
import pic2 from "../../assets/food_2.png";
import pic3 from "../../assets/food_3.png";
import pic4 from "../../assets/pic1.jpeg";
import pic5 from "../../assets/pic2.jpg";
import pic6 from "../../assets/pic3.jpeg";
import pic7 from "../../assets/background.png";
const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  // Define food items and descriptions
  const foodItems = [
    {
      image:
       pic1,
      title: "Delicious Organic Food",
      description:
        "Experience the finest organic food prepared with love and care. From farm to table, we bring you the freshest ingredients.",
    },
    {
      image:
        pic2,
      title: "Tasty Vegan Dishes",
      description:
        "Our vegan dishes are made with nutritious and fresh ingredients, providing you with a healthy and flavorful experience.",
    },
    {
      image:
        pic3,
      title: "Traditional Dishes",
      description:
        "Enjoy our traditional dishes that remind you of home. Full of rich flavors and cultural authenticity.",
    },
  ];

  // Automatically change the currentIndex every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % foodItems.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Empowerment Section */}
      {/* Empowerment Section */}
      <div className="empowerment-box">
        <h1>Empowering Women Entrepreneurs</h1>
        <p>Building a sustainable future with strong women leaders!</p>
        <button
          className="login-button"
          onClick={() => navigate("/login")} // Navigate to the login page
        >
          Login
        </button>
      </div>


      <div className="food-slideshow">
      <h2 className="food">Our Delicious Foods</h2>
      <div className="food-slide-container">
        {foodItems.map((item, index) => (
          <div
            key={index}
            className={`food-slide ${index === currentIndex ? 'active' : ''}`}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.4s ease-in-out', // Smooth transition
            }}
          >
            <div className="food-image-box" style={{ flex: '1', textAlign: 'center' }}>
              <img
                src={item.image}
                alt={item.title}
                className="food-image"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%', // Rounded shape
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className="food-description" style={{ flex: '3', padding: '0 20px' }}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>




      <section id="description">
        <h2 class="description-title">Why Choose Our App</h2>
        <div class="description-grid">
         
            <div class="description-item">
                <i class="fas fa-leaf icon"></i>
                <h3>Fresh Ingredients</h3>
                <p>We source the freshest ingredients to ensure that every lunch box is filled with nutritious and wholesome food.</p>
            </div>
    
           
            <div class="description-item">
                <i class="fas fa-utensils icon"></i>
                <h3>Variety of Options</h3>
                <p>From gourmet lunch boxes to freshly baked bread and daily hot lunches, we provide a wide variety of delicious options.</p>
            </div>
    
            
            <div class="description-item">
                <i class="fas fa-heartbeat icon"></i>
                <h3>Health & Nutrition</h3>
                <p>Our meals are carefully curated to promote health and wellness, ensuring balanced nutrition for growing minds and bodies.</p>
            </div>
    
           
            <div class="description-item">
                <i class="fas fa-shipping-fast icon"></i>
                <h3>Timely Delivery</h3>
                <p>We guarantee free and timely delivery with every order, ensuring your meals arrive fresh and ready to eat.</p>
            </div>
    
           
            <div class="description-item">
                <i class="fas fa-birthday-cake icon"></i>
                <h3>Special Event Catering</h3>
                <p>We offer customizable catering packages for school trips, staff functions, and other special events with finger food platters.</p>
            </div>
        </div>
    </section>



      {/* Testimonials Section */}
      <section id="testimonials">
        <h2>What Our Clients Say</h2>
        <div className="testimonial-carousel">
          <div className="testimonial-item">
            <img
              src={pic4}
              alt="Client 1"
              className="testimonial-img"
            />
            <p className="testimonial-text">
              “The lunch boxes are fresh and delicious. Deliveries are always
              on time and sorted efficiently for students and staff.”
            </p>
          </div>
          <div className="testimonial-item">
            <img
              src={pic5}
              alt="Client 2"
              className="testimonial-img"
            />
            <p className="testimonial-text">
              “Lunch boxes offer a unique and welcoming variety. It inspired me
              to think about improving customer relations.”
            </p>
          </div>
          <div className="testimonial-item">
            <img
              src={pic6}
              alt="Client 3"
              className="testimonial-img"
            />
            <p className="testimonial-text">
              “My mother was reassured by the nutritional breakdown, helping me
              make better decisions about which lunch box to order.”
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
