import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { addToCart } from '../redux/slices/cartSlice';
import { apiService } from '../services/api';
import { Product } from '../types';

const Menu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state: any) => state.auth);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    const quantity = selectedSize[product.id] || 1;
    dispatch(
      addToCart({
        productId: product.id,
        product,
        quantity,
        price: product.price,
        customizations: '',
      })
    );
    alert(`${product.name} added to cart!`);
    setSelectedSize((prev) => ({ ...prev, [product.id]: 1 }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-coffee-900">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-coffee-50 to-white">
      {/* Header */}
      <div className="bg-coffee-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">☕ Mt. Apo's Best Coffee</h1>
          <p className="text-coffee-200">Premium 100% Arabica from Mount Apo, Davao</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 overflow-hidden animate-slideUp"
            >
              {/* Product Image */}
              <div className="bg-gradient-to-b from-coffee-200 to-coffee-100 h-64 flex items-center justify-center">
                <div className="text-9xl">☕</div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-coffee-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-3xl font-bold text-coffee-700">₱{product.price.toFixed(2)}</p>
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  {product.isAvailable ? (
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ In Stock
                    </span>
                  ) : (
                    <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <select
                    value={selectedSize[product.id] || 1}
                    onChange={(e) =>
                      setSelectedSize((prev) => ({
                        ...prev,
                        [product.id]: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.isAvailable}
                  className="w-full py-3 bg-coffee-900 text-white rounded-lg font-bold hover:bg-coffee-800 transition duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.isAvailable ? '🛒 Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-coffee-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-coffee-900 mb-6">About Mt. Apo Arabica</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              The 100% Arabica coffee, farmed and roasted at Mount Apo in Davao del Sur, is recognized as
              one of the finest specialty coffees in the Philippines.
            </p>
            <p>
              <strong>Roast Level:</strong> Medium Roast to preserve its complex, nuanced flavor profile and
              bright acidity.
            </p>
            <p>
              <strong>High Altitude:</strong> Grown at 1,200 to over 1,700 meters above sea level, allowing
              the beans to develop higher concentration of sugars, acidity, and complex flavors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;