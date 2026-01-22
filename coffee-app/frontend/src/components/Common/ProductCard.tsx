import { useState } from "react";
import { useAppDispatch } from "../../hooks/useRedux";
import { addToCart } from "../../redux/slices/cartSlice";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  roastLevel: string;
  grind: string;
  size: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        roastLevel: product.roastLevel,
        grind: product.grind,
        size: product.size,
      }),
    );
    setQuantity(1);
    // Show toast notification
    alert(`Added ${product.name} to cart!`);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="card hover:shadow-xl transition-all duration-300">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 bg-cream h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="badge badge-danger">Out of Stock</span>
          </div>
        )}
        {!isOutOfStock && product.stock < 10 && (
          <div className="absolute top-4 right-4">
            <span className="badge badge-warning">Low Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-brown mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Specifications */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-secondary-brown">
          <div className="flex flex-col items-center text-center">
            <span className="font-semibold text-caramel">
              {product.roastLevel}
            </span>
            <span className="opacity-75">Roast</span>
          </div>
          <div className="flex flex-col items-center text-center border-x border-caramel/20">
            <span className="font-semibold text-caramel">{product.grind}</span>
            <span className="opacity-75">Type</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-semibold text-caramel">{product.size}</span>
            <span className="opacity-75">Size</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mb-4 pb-4 border-b border-caramel/20">
        <p className="text-2xl font-bold text-caramel">
          ₱{product.price.toLocaleString()}
        </p>
        <p className="text-xs text-muted mt-1">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {!isOutOfStock && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex-1 btn btn-secondary btn-sm"
            >
              −
            </button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="flex-1 btn btn-secondary btn-sm"
            >
              +
            </button>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full btn ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "btn-primary"}`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
