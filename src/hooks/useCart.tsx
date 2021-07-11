import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@BrandNewShoe:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const updatedCart = [...cart]
      const productExistsOnCart = updatedCart.find(product => product.id === productId)

      const stock = await api.get(`/stock/${productId}`)

      const stockAmount = stock.data.amount
      const currentAmount = productExistsOnCart ? productExistsOnCart.amount : 0
      const desiredAmount = currentAmount + 1


      if (desiredAmount > stockAmount) {
        toast.error('Required product amount out of stock');
        return;
      }

      if (productExistsOnCart) {
        productExistsOnCart.amount = desiredAmount
      } else {
        const product = await api.get(`/products/${productId}`)

        const newProduct = {
          ...product.data,
          amount: 1
        }
        updatedCart.push(newProduct);
      }

      setCart(updatedCart)
      localStorage.setItem('@BrandNewShoe:cart', JSON.stringify(updatedCart))
    } catch {
      toast.error(`Error: Couldn't add product`);
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const updatedCart = [...cart]
      const productIndex = updatedCart.findIndex(product => product.id === productId)

      if (productIndex >= 0) {
        updatedCart.splice(productIndex, 1)
        setCart(updatedCart)
        localStorage.setItem('@BrandNewShoe:cart', JSON.stringify(updatedCart))

      } else {
        throw Error()
      }
    } catch {
      toast.error(`Error: Couldn't remove product`);
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount < 1) {
        return
      }
      const stock = await api.get(`/stock/${productId}`)
      const stockAmount = stock.data.amount

      if (amount > stockAmount) {
        toast.error('Required product amount out of Stock');
        return
      }

      const updatedCart = [...cart]
      const productExistsOnCart = updatedCart.find(product => product.id === productId)

      if (productExistsOnCart) {
        productExistsOnCart.amount = amount
        setCart(updatedCart)
        localStorage.setItem('@BrandNewShoe:cart', JSON.stringify(updatedCart))
      } else {
        throw Error()
      }

    } catch {
      toast.error('Error changing product amount');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
