import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../Common/ProductCard";

// local product images
import img1 from "../../Images/image1.png";
import img4 from "../../Images/image4.png";
import img5 from "../../Images/image5.png";
import img6 from "../../Images/image6.png";

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/products");
        if (response.data.success) {
          // Get first 4 products as featured
          setProducts(response.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching products:", err);
                // Use mock data for now (local images imported at top)
        setProducts([
          {
            id: 1,
            name: "Mt. Apo Arabica 250g",
            description: "100% Premium Arabica from Mt. Apo",
            price: 399,
            image: img1,
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
            image: img4,
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
            image: img5,
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
            image: img6,
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
      <div className="flex justify-center items-center min-h-96 bg-coffee-50">
        <div className="text-center animate-fade-in-up">
          <div className="w-10 h-10 border-4 border-coffee-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-coffee-700">Loading our best sellers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
