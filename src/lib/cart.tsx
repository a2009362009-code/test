import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type CartProduct = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_TO_CART"; product: CartProduct }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "INCREASE_QUANTITY"; productId: string }
  | { type: "DECREASE_QUANTITY"; productId: string }
  | { type: "CLEAR_CART" };

const STORAGE_KEY = "cart";

const initialState: CartState = {
  items: [],
};

const getCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      id: String(item.id),
      name: String(item.name),
      price: Number(item.price),
      image: String(item.image),
      quantity: Number(item.quantity),
    }));
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore localStorage write failures
  }
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const product = action.product;
      const existingIndex = state.items.findIndex((item) => item.id === product.id);
      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + (product.quantity ?? 1),
        };
        return { items: updatedItems };
      }

      return {
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: product.quantity && product.quantity > 0 ? product.quantity : 1,
          },
        ],
      };
    }

    case "REMOVE_FROM_CART": {
      return {
        items: state.items.filter((item) => item.id !== action.productId),
      };
    }

    case "INCREASE_QUANTITY": {
      return {
        items: state.items.map((item) =>
          item.id === action.productId ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      };
    }

    case "DECREASE_QUANTITY": {
      return {
        items: state.items
          .map((item) =>
            item.id === action.productId ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0),
      };
    }

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
};

export type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => ({ items: getCartFromStorage() }));

  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items: state.items,
      totalItems,
      totalPrice,
      addToCart: (product) => dispatch({ type: "ADD_TO_CART", product }),
      removeFromCart: (productId) => dispatch({ type: "REMOVE_FROM_CART", productId }),
      increaseQuantity: (productId) => dispatch({ type: "INCREASE_QUANTITY", productId }),
      decreaseQuantity: (productId) => dispatch({ type: "DECREASE_QUANTITY", productId }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
