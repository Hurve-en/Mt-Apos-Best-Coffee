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
  const [added, setAdded] = useState(false);
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
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
      setQuantity(1);
    }, 900);
  };

  const isOutOfStock = product.stock === 0;
  const imageSrc = getProductImage(product.name, product.image, product.id);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[rgba(143,91,54,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(250,249,245,0.92))] shadow-[0_18px_45px_rgba(61,31,10,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(61,31,10,0.14)]">
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-t-[28px] bg-gradient-to-br from-coffee-100 via-white to-coffee-50">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-danger text-pure-white px-3 py-1 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}
        {!isOutOfStock && product.stock < 10 && (
          <div className="absolute right-3 top-3">
            <span className="rounded-full bg-warning px-2 py-0.5 text-xs text-pure-white">
              Low Stock
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-coffee-900/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-coffee-100">
            {product.roastLevel}
          </span>
        </div>
      </div>

      <div className="mb-4 px-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-[rgba(143,91,54,0.16)] bg-coffee-50 px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-coffee-700">
            {product.grind}
          </span>
          <span className="rounded-full border border-[rgba(143,91,54,0.16)] bg-coffee-50 px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-coffee-700">
            {product.size}
          </span>
        </div>
        <h3 className="mb-2 font-['Cormorant_Garamond'] text-[2rem] font-semibold leading-none text-coffee-900">
          {product.name}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-coffee-700">
          {product.description}
        </p>

        <div className="grid grid-cols-3 gap-2 text-xs text-coffee-700">
          <div className="flex flex-col items-center text-center">
            <span className="font-semibold text-coffee-900">{product.roastLevel}</span>
            <span className="opacity-75">Roast</span>
          </div>
          <div className="flex flex-col items-center border-x border-neutral-300 text-center">
            <span className="font-semibold text-coffee-900">{product.grind}</span>
            <span className="opacity-75">Type</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-semibold text-coffee-900">{product.size}</span>
            <span className="opacity-75">Size</span>
          </div>
        </div>
      </div>

      <div className="mb-4 border-b border-[rgba(143,91,54,0.14)] px-5 pb-4">
        <p className="font-['Cormorant_Garamond'] text-[2.1rem] font-semibold leading-none text-coffee-900">
          ₱{product.price.toLocaleString()}
        </p>
        <p className="text-xs text-coffee-600 mt-1">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
      </div>

      <div className="mt-auto space-y-3 px-5 pb-6">
        <div className="h-10">
          {!isOutOfStock ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 flex-1 items-center justify-center rounded-2xl border border-[rgba(143,91,54,0.16)] bg-white/80 text-lg text-coffee-900 transition hover:bg-coffee-50"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold text-coffee-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="flex h-10 flex-1 items-center justify-center rounded-2xl border border-[rgba(143,91,54,0.16)] bg-white/80 text-lg text-coffee-900 transition hover:bg-coffee-50"
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
          className={`h-12 w-full rounded-full text-sm font-semibold tracking-[0.12em] uppercase transition ${
            isOutOfStock
              ? "cursor-not-allowed bg-neutral-300 opacity-50"
              : added
                ? "bg-emerald-700 text-pure-white"
                : "bg-coffee-700 text-pure-white hover:bg-coffee-800"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
