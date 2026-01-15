import { useEffect, useState } from "react";
import {
  fetchAllProduct,
  fetchProductByID,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productsService";
import type { ProductRespond  } from "@/services/productsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "list" | "create" | "edit" | "view";

function Product() {
  const [products, setProducts] = useState<ProductRespond []>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductRespond  | null>(null);
  const [mode, setMode] = useState<Mode>("list");

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllProduct();
      setProducts(data);
    } catch {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const loadProductById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductByID(id);
      setSelectedProduct(data);
      setName(data.name);
      setMode("view");
    } catch {
      setError("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createProduct({ name, price, description });
    setName("");
    setPrice(0);
    setDescription("");
    setMode("list");
    loadProducts();
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    await updateProduct(selectedProduct.id, { name });
    setMode("list");
    setSelectedProduct(null);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    loadProducts();
  };

  const resetState = () => {
    setSelectedProduct(null);
    setName("");
    setMode("list");
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return <h1 className="text-xl font-semibold">Loading...</h1>;
  }

  if (error) {
    return <h1 className="text-xl font-semibold text-red-500">{error}</h1>;
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">User Management</h1>

      {mode === "list" && (
        <>
          <Button onClick={() => setMode("create")}>Create User</Button>

          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => loadProductById(product.id)}
                >
                  <p>ID: {product.id}</p>
                  <p>Name: {product.name}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedProduct(product);
                      setName(product.name);
                      setMode("edit");
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {(mode === "create" || mode === "edit") && (
        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Create User" : "Edit User"}
          </h2>

          <Input
            placeholder="User name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex gap-2">
            <Button onClick={mode === "create" ? handleCreate : handleUpdate}>
              {mode === "create" ? "Create" : "Update"}
            </Button>
            <Button variant="outline" onClick={resetState}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {mode === "view" && selectedProduct && (
        <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
          <h2 className="text-xl font-semibold">Product Detail</h2>
          <p>ID: {selectedProduct.id}</p>
          <p>Name: {selectedProduct.name}</p>

          <Button onClick={resetState}>Back</Button>
        </div>
      )}
    </section>
  );
}

export default Product;
