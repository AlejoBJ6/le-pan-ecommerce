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
      
      // Tomar stock del producto (si es combo dinámico puede que no tenga stock directo, asumimos 99 si no existe)
      const stockLimit = product.stock !== undefined ? product.stock : 99;

      if (existingProductIndex >= 0) {
        const updatedCart = [...prevCart];
        const updatedItem = { ...updatedCart[existingProductIndex] };
        
        const newTotalQuantity = updatedItem.quantity + quantity;
        updatedItem.quantity = Math.min(newTotalQuantity, stockLimit);
        
        updatedCart[existingProductIndex] = updatedItem;
        return updatedCart;
      } else {
        const finalQuantity = Math.min(quantity, stockLimit);
        return [...prevCart, { ...product, quantity: finalQuantity }];
      }
    });

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
      prevCart.map(item => {
        if (getId(item) === productId) {
          const stockLimit = item.stock !== undefined ? item.stock : 99;
          return { ...item, quantity: Math.min(quantity, stockLimit) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + ((item.precio || item.precioFinal || item.price || 0) * item.quantity), 0);
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
