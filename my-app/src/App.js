import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'
import Home from './pages/home/Home';
import Login from './pages/Login/Login';
import ShopContextProvider from './ShopContextProvider';
import Buyer from './pages/Buyer/Buyer';
import Cart from './pages/Cart/Cart';
import Register from './pages/Register/Register';
import Seller from './pages/Seller/Seller';
import Addnew from './pages/Addnew/Addnew';
import Sellerorder from './pages/Sellerorder/Sellerorder';
import Footer from './components/Footer/Footer';
import Rider from './pages/Rider/Rider';
import Customerorders from './pages/CustomerOrders/Customerorders';
import Riderorders from './pages/RiderOrders/Riderorders';
import SellerCompletedOrder from './pages/SellerCompletedOrder/SellerCompletedOrder';
const App = () => {
  return (
    <ShopContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/Buyer" element={<Buyer/>} />
          <Route path="/seller" element={<Seller/>} />
          <Route path="/rider" element={<Rider/>} />
          <Route path="/sellerorders" element={<Sellerorder/>} />
          <Route path="/sellercompletedorders" element={<SellerCompletedOrder/>} />
          <Route path="/Cart" element={<Cart/>} />
          <Route path="/customerorder" element={<Customerorders/>} />
          <Route path="/riderorder" element={<Riderorders/>} />
          <Route path="/addnew" element={<Addnew/>} />
        </Routes>
        <Footer/>
      </Router>
    </ShopContextProvider>
  );
};

export default App;
