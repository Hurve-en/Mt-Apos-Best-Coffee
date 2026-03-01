import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from "../components/Common/ProductCard";
import { apiService } from "../services/api";
import "../styles/premium.css";

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

interface Filters {
  roastLevel: string[];
  grind: string[];
  size: string[];
  priceRange: [number, number];
  searchTerm: string;
}

export default function Menu() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">(
    "name",
  );

  const [filters, setFilters] = useState<Filters>({
    roastLevel: [],
    grind: [],
    size: [],
    priceRange: [0, 2000],
    searchTerm: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const products = await apiService.getProducts();
        const normalized = (products as any[]).map((product) => ({
          id: Number(product.id),
          name: String(product.name || ""),
          description: String(product.description || ""),
          price: Number(product.price || 0),
          image: String(product.image || ""),
          roastLevel: String(product.roastLevel || "Medium"),
          grind: String(product.grind || "Ground"),
          size: String(product.size || "250g"),
          stock: Number(product.stock ?? 0),
        }));
        setAllProducts(normalized);
      } catch (_err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term),
      );
    }

    if (filters.roastLevel.length > 0) {
      result = result.filter((product) =>
        filters.roastLevel
          .map((r) => r.toLowerCase())
          .includes(product.roastLevel.toLowerCase()),
      );
    }

    if (filters.grind.length > 0) {
      result = result.filter((product) =>
        filters.grind
          .map((g) => g.toLowerCase())
          .includes(product.grind.toLowerCase()),
      );
    }

    if (filters.size.length > 0) {
      result = result.filter((product) => filters.size.includes(product.size));
    }

    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1],
    );

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [allProducts, filters, sortBy]);

  const handleToggle = (
    key: "roastLevel" | "grind" | "size",
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      roastLevel: [],
      grind: [],
      size: [],
      priceRange: [0, 2000],
      searchTerm: "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-coffee-50">
        <div className="text-center animate-fade-in-up">
          <div className="w-10 h-10 border-4 border-coffee-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-coffee-900 font-semibold">Loading premium coffee menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-coffee-50">
      <section className="section-gap bg-coffee-700 text-white">
        <div className="container">
          <h1 className="text-5xl font-bold mb-2">Our Coffee Menu</h1>
          <p className="text-lg opacity-90">
            Premium Mt. Apo beans, roasted for balance and depth.
          </p>
        </div>
      </section>

      <section className="section-gap">
        <div className="container space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
                }
                placeholder="Search coffee"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="name">Sort: Name</option>
                <option value="price-asc">Sort: Price Low to High</option>
                <option value="price-desc">Sort: Price High to Low</option>
              </select>

              <button onClick={clearFilters} className="btn btn-secondary btn-sm w-full">
                Clear Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-wrap gap-2">
                {["Light", "Medium", "Dark"].map((roast) => (
                  <button
                    key={roast}
                    onClick={() => handleToggle("roastLevel", roast)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition ${
                      filters.roastLevel.includes(roast)
                        ? "bg-coffee-700 text-white border-coffee-700"
                        : "bg-white text-coffee-800 border-neutral-300 hover:border-coffee-700"
                    }`}
                  >
                    {roast}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {["Whole Beans", "Ground", "Espresso"].map((grind) => (
                  <button
                    key={grind}
                    onClick={() => handleToggle("grind", grind)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition ${
                      filters.grind.includes(grind)
                        ? "bg-coffee-700 text-white border-coffee-700"
                        : "bg-white text-coffee-800 border-neutral-300 hover:border-coffee-700"
                    }`}
                  >
                    {grind}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {["250g", "500g", "1kg"].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleToggle("size", size)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition ${
                      filters.size.includes(size)
                        ? "bg-coffee-700 text-white border-coffee-700"
                        : "bg-white text-coffee-800 border-neutral-300 hover:border-coffee-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-coffee-700 font-medium">
              {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
            </p>
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin/products")}
                className="btn btn-primary btn-sm"
              >
                Manage Products
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <h3 className="text-2xl font-bold text-coffee-900 mb-2">No products found</h3>
              <p className="text-coffee-700 mb-6">Try adjusting search or filters.</p>
              <button onClick={clearFilters} className="btn btn-secondary">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
