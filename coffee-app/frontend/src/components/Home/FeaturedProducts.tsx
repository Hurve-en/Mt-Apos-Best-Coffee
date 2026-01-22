import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/useRedux";
import axios from "axios";
import ProductCard from "../Common/ProductCard";

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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/products");
        if (response.data.success) {
          // Get first 4 products as featured
          setProducts(response.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        // Use mock data for now
        setProducts([
          {
            id: 1,
            name: "Mt. Apo Arabica 250g",
            description: "100% Premium Arabica from Mt. Apo",
            price: 399,
            image:
              "https://images.unsplash.com/photo-1599599810694-b5ac4dd994b5?w=400&h=400&fit=crop",
            roastLevel: "Medium",
            grind: "Whole Beans",
            size: "250g",
            stock: 50,
          },
          {
            id: 2,
            name: "Mt. Apo Arabica 500g",
            description: "100% Premium Arabica from Mt. Apo",
            price: 689,
            image:
              "https://images.unsplash.com/photo-1599599810694-b5ac4dd994b5?w=400&h=400&fit=crop",
            roastLevel: "Medium",
            grind: "Ground",
            size: "500g",
            stock: 45,
          },
          {
            id: 3,
            name: "Mt. Apo Dark Roast 250g",
            description: "Bold, rich dark roast coffee",
            price: 399,
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=400&h=400&fit=crop",
            roastLevel: "Dark",
            grind: "Espresso",
            size: "250g",
            stock: 35,
          },
          {
            id: 4,
            name: "Mt. Apo Arabica 1kg",
            description: "Premium bulk option for regular customers",
            price: 1399,
            image:
              "https://images.unsplash.com/photo-1599599810694-b5ac4dd994b5?w=400&h=400&fit=crop",
            roastLevel: "Medium",
            grind: "Whole Beans",
            size: "1kg",
            stock: 30,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-pulse text-5xl mb-4">☕</div>
          <p className="text-secondary-brown">Loading our best sellers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
