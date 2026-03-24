import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Si el producto no tiene _id pero tiene id, lo normalizamos
  const getId = (item) => item._id || item.id;

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const productId = getId(product);
      const existingProductIndex = prevCart.findIndex(item => getId(item) === productId);
      
      if (existingProductIndex >= 0) {
        const updatedCart = [...prevCart];
        const updatedItem = { ...updatedCart[existingProductIndex] };
        updatedItem.quantity += quantity;
        updatedCart[existingProductIndex] = updatedItem;
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });

    // Despachar el evento para la animación (ya existente en la UI)
    window.dispatchEvent(new CustomEvent('cart-added'));
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => getId(item) !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) => 
      prevCart.map(item => 
        getId(item) === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + ((item.precio || item.price || 0) * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
