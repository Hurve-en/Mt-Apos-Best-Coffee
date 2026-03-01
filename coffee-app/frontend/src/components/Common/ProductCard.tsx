import { useState } from "react";
import { useAppDispatch } from "../../hooks/useRedux";
import { addToCart } from "../../redux/slices/cartSlice";
import { getProductImage } from "../../utils/productImages";

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
        image: getProductImage(product.name, product.image, product.id),
        roastLevel: product.roastLevel,
        grind: product.grind,
        size: product.size,
      }),
    );
    setQuantity(1);
    alert(`Added ${product.name} to cart!`);
  };

  const isOutOfStock = product.stock === 0;
  const imageSrc = getProductImage(product.name, product.image, product.id);

  return (
    <div className="group h-full flex flex-col bg-pure-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300">
      <div className="relative overflow-hidden rounded-t-2xl mb-4 bg-neutral-100 aspect-[4/3]">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-danger text-pure-white px-3 py-1 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}
        {!isOutOfStock && product.stock < 10 && (
          <div className="absolute top-3 right-3">
            <span className="bg-warning text-pure-white px-2 py-0.5 rounded-full text-xs">
              Low Stock
            </span>
          </div>
        )}
      </div>

      <div className="px-4 mb-4">
        <h3 className="text-xl font-semibold text-coffee-900 mb-2">{product.name}</h3>
        <p className="text-sm text-coffee-700 mb-3 line-clamp-2">{product.description}</p>

        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-coffee-700">
          <div className="flex flex-col items-center text-center">
            <span className="font-semibold text-coffee-900">{product.roastLevel}</span>
            <span className="opacity-75">Roast</span>
          </div>
          <div className="flex flex-col items-center text-center border-x border-neutral-300">
            <span className="font-semibold text-coffee-900">{product.grind}</span>
            <span className="opacity-75">Type</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-semibold text-coffee-900">{product.size}</span>
            <span className="opacity-75">Size</span>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4 pb-4 border-b border-neutral-300">
        <p className="text-2xl font-bold text-coffee-900">₱{product.price.toLocaleString()}</p>
        <p className="text-xs text-coffee-600 mt-1">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
      </div>

      <div className="px-4 pb-6 mt-auto space-y-3">
        <div className="h-10">
          {!isOutOfStock ? (
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
          ) : (
            <div aria-hidden className="h-10" />
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full h-11 btn rounded-lg ${
            isOutOfStock
              ? "opacity-50 cursor-not-allowed bg-neutral-300"
              : "bg-coffee-500 text-pure-white hover:bg-coffee-600"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
