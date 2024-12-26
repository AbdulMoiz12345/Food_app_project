import React, { createContext, useState } from 'react';

export const Itemcontext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [cartitem, setcartitem] = useState([]);
  const [buyerId, setBuyerId] = useState(null); // ID for the buyer
  const [sellerId, setSellerId] = useState(null); // ID for the seller
  const [userState, setUserState] = useState(null); // Can be "buyer" or "seller"
  const [riderId,setRiderId]=useState(null)
  const [foodid, setfoodid] = useState(null);
  const[Address_Buyer,setAddress_Buyer]=useState(null);
  const[Address_Seller,setAddress_Seller]=useState(null)
  return (
    <Itemcontext.Provider
      value={{
        cartitem,
        setcartitem,
        buyerId,
        setBuyerId,
        sellerId,
        setSellerId,
        riderId,
        setRiderId,
        userState,
        setUserState,
        foodid,
        setfoodid,
        Address_Buyer,
        setAddress_Buyer,
        Address_Seller,
        setAddress_Seller
      }}
    >
      {children}
    </Itemcontext.Provider>
  );
};

export default ShopContextProvider;
