import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../components/Admin/AdminLayout";
import "../styles/premium.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  roastLevel: string;
  grind: string;
  size: string;
  image?: string;
  imageUrl?: string;
  stock: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    roastLevel: "medium",
    grind: "whole",
    size: "250g",
    image: "",
    stock: "10",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    void fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setProducts(response.data.data || response.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required.";
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    const priceNumber = parseFloat(formData.price);
    const stockNumber = parseInt(formData.stock, 10);

    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }
    if (Number.isNaN(stockNumber) || stockNumber < 0) {
      newErrors.stock = "Stock cannot be negative.";
    }
    if (!editingId && !formData.image) {
      newErrors.image = "Product image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        image: base64String,
      }));
      setImagePreview(base64String);
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    };
    reader.onerror = () => {
      alert("Error reading image file");
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      roastLevel: "medium",
      grind: "whole",
      size: "250g",
      image: "",
      stock: "10",
    });
    setShowForm(false);
    setEditingId(null);
    setErrors({});
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      };

      if (editingId) {
        await axios.put(
          `http://localhost:3000/api/products/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        alert("Product updated successfully!");
      } else {
        await axios.post("http://localhost:3000/api/products", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Product created successfully!");
      }

      resetForm();
      void fetchProducts();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to save product";
      alert(`Error: ${errorMsg}`);
      setErrors({
        submit: errorMsg,
      });
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      roastLevel: product.roastLevel,
      grind: product.grind,
      size: product.size,
      image: product.image || product.imageUrl || "",
      stock: product.stock.toString(),
    });
    setImagePreview(product.image || product.imageUrl || "");
    setEditingId(product.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Product deleted successfully!");
      void fetchProducts();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to delete product";
      alert(`Error: ${errorMsg}`);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Products" subtitle="Manage your catalog">
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">☕</div>
            <p className="text-lg text-coffee-700">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Manage Products"
      subtitle="Curate the catalog with consistent product details, pricing, and imagery."
      actions={
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          + New Product
        </button>
      }
    >
      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-[2rem] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,241,232,0.92))] p-7 shadow-[0_24px_80px_rgba(61,31,10,0.08)]">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-coffee-500">
              Catalog Overview
            </p>
            <h3 className="mt-3 font-['Cormorant_Garamond'] text-4xl font-semibold text-coffee-900">
              Build a menu that feels premium.
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-coffee-700">
              Keep descriptions clear, imagery polished, and stock levels ready
              so the storefront stays aligned with the Apo Coffee brand.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[rgba(143,91,54,0.14)] bg-white/85 p-7 shadow-[0_24px_80px_rgba(61,31,10,0.08)]">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-coffee-500">
              Total Products
            </p>
            <p className="mt-3 font-['Cormorant_Garamond'] text-6xl font-semibold leading-none text-coffee-900">
              {products.length}
            </p>
            <p className="mt-3 text-sm text-coffee-700">
              Active items currently shown in the catalog.
            </p>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(39,23,12,0.56)] p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(180deg,rgba(255,251,245,0.98),rgba(247,241,232,0.96))] shadow-[0_30px_120px_rgba(61,31,10,0.2)]">
              <div className="border-b border-[rgba(143,91,54,0.12)] px-8 py-7">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-coffee-500">
                  Product Studio
                </p>
                <h2 className="mt-3 font-['Cormorant_Garamond'] text-5xl font-semibold leading-none text-coffee-900">
                  {editingId ? "Edit Product" : "Add Product"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 p-8">
                {errors.submit && (
                  <div className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errors.submit}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`w-full rounded-[1rem] border bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 ${
                      errors.name
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-[rgba(143,91,54,0.16)] focus:border-coffee-500 focus:ring-coffee-200"
                    }`}
                    placeholder="Premium Mt. Apo Arabica"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className={`h-28 w-full rounded-[1rem] border bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 ${
                      errors.description
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-[rgba(143,91,54,0.16)] focus:border-coffee-500 focus:ring-coffee-200"
                    }`}
                    placeholder="Describe the tasting notes, body, and experience..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                      Price (₱)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      className={`w-full rounded-[1rem] border bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 ${
                        errors.price
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-[rgba(143,91,54,0.16)] focus:border-coffee-500 focus:ring-coffee-200"
                      }`}
                      placeholder="0.00"
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleFormChange}
                      inputMode="numeric"
                      step="1"
                      min="0"
                      className={`w-full rounded-[1rem] border bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 ${
                        errors.stock
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-[rgba(143,91,54,0.16)] focus:border-coffee-500 focus:ring-coffee-200"
                      }`}
                      placeholder="10"
                    />
                    {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                      Roast Level
                    </label>
                    <select
                      name="roastLevel"
                      value={formData.roastLevel}
                      onChange={handleFormChange}
                      className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    >
                      <option value="light">Light</option>
                      <option value="medium">Medium</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                      Grind Type
                    </label>
                    <select
                      name="grind"
                      value={formData.grind}
                      onChange={handleFormChange}
                      className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    >
                      <option value="whole">Whole Bean</option>
                      <option value="ground">Ground</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                      Size
                    </label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleFormChange}
                      className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 focus:border-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    >
                      <option value="250g">250g</option>
                      <option value="500g">500g</option>
                      <option value="1kg">1kg</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
                  <div>
                    <label className="mb-2 block text-[0.78rem] font-medium uppercase tracking-[0.16em] text-coffee-700">
                      Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full rounded-[1rem] border border-[rgba(143,91,54,0.16)] bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coffee-200"
                    />
                    {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                  </div>

                  <div className="rounded-[1.5rem] border border-[rgba(143,91,54,0.14)] bg-white/80 p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-coffee-500">
                      Preview
                    </p>
                    <div className="mt-3 flex aspect-square items-center justify-center overflow-hidden rounded-[1.25rem] bg-coffee-50">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-coffee-500">No image yet</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="submit" className="btn btn-primary">
                    {editingId ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <div className="rounded-[2rem] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,241,232,0.92))] p-12 text-center shadow-[0_24px_80px_rgba(61,31,10,0.08)]">
            <h3 className="font-['Cormorant_Garamond'] text-4xl font-semibold text-coffee-900">
              No Products Yet
            </h3>
            <p className="mt-3 text-sm text-coffee-700">
              Add your first coffee product to get started.
            </p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary mt-6">
              Add Product
            </button>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-[2rem] border border-[rgba(143,91,54,0.14)] bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,241,232,0.92))] shadow-[0_24px_80px_rgba(61,31,10,0.08)] transition hover:-translate-y-1"
              >
                <div className="grid h-full md:grid-cols-[220px_1fr]">
                  <div className="bg-coffee-100">
                    {product.image || product.imageUrl ? (
                      <img
                        src={product.image || product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-[220px] items-center justify-center text-coffee-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-coffee-900 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-white">
                            {product.roastLevel}
                          </span>
                          <span className="rounded-full border border-[rgba(143,91,54,0.18)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-coffee-600">
                            {product.grind}
                          </span>
                          <span className="rounded-full border border-[rgba(143,91,54,0.18)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-coffee-600">
                            {product.size}
                          </span>
                        </div>
                        <h3 className="mt-4 font-['Cormorant_Garamond'] text-4xl font-semibold leading-none text-coffee-900">
                          {product.name}
                        </h3>
                      </div>

                      <div className="text-right">
                        <p className="font-['Cormorant_Garamond'] text-4xl font-semibold leading-none text-coffee-900">
                          ₱{Number(product.price).toFixed(2)}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-coffee-500">
                          {product.stock} in stock
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 flex-1 text-sm leading-7 text-coffee-700">
                      {product.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3 border-t border-[rgba(143,91,54,0.12)] pt-5">
                      <button
                        onClick={() => handleEdit(product)}
                        className="btn btn-primary"
                      >
                        Edit Product
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-secondary"
                      >
                        Delete Product
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
