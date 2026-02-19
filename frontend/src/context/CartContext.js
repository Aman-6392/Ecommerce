import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

    // Load cart from localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart whenever cart changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Add to cart
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item._id === product._id
            );

            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    // Remove item
    const removeFromCart = (id) => {
        setCart((prevCart) =>
            prevCart.filter((item) => item._id !== id)
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    // Get total price
    const getTotal = () => {
        return cart.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                getTotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
};