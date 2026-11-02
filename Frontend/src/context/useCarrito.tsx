import { createContext, useContext, useState, useEffect, type ReactNode,  } from 'react';
import toast from 'react-hot-toast';
import type { IProveedor } from '../features/proveedores/types/proveedores.type';

export interface CartItem extends IProveedor {
  quantity: number;
}

interface CarritoContextType {
  cart: CartItem[];
  addToCart: (item: IProveedor) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bambina_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bambina_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: IProveedor) => {
    setCart((prev) => {
      const existing = prev.find((p) => p._id === item._id);
      if (existing) {
        toast.success(`+1 ${item.marcas}`, { id: item._id });
        return prev.map((p) => p._id === item._id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      toast.success(`${item.marcas} agregado al carrito`);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
    toast.error('Producto eliminado del carrito');
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((p) => {
        if (p._id === id) {
          const newQ = p.quantity + delta;
          return newQ > 0 ? { ...p, quantity: newQ } : p;
        }
        return p;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('bambina_cart');
  };

  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.precios * item.quantity), 0);

  return (
    <CarritoContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CarritoContext);
  if (!context) throw new Error('useCart debe usarse dentro de CarritoProvider');
  return context;
};