import React, { useState } from "react";

const ProductDetails = () => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []
  );
  return <div>{cartItems}</div>;
};

export default ProductDetails;
