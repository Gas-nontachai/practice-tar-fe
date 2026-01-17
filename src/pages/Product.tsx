import { useEffect, useState } from "react";
import {
  fetchAllProduct,
  fetchProductByID,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productsService";
import type { ProductRespond } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { isPositiveInteger, preventInvalidNumberKey } from "@/utils/numberInput";

type Mode = "list" | "create" | "edit" | "view";

function Product() {
  const [products, setProducts] = useState<ProductRespond[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductRespond | null>(
    null
  );
  const [mode, setMode] = useState<Mode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllProduct();
      setProducts(data);
      setCurrentPage(1);
    } catch {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const loadProductById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductByID(id);

      setSelectedProduct(data);
      setName(data.name);
      setPrice(String(data.price));
      setDescription(data.description);

      setMode("view");
    } catch {
      setError("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createProduct({
      name,
      price: Number(price),
      description,
    });
    setName("");
    setMode("list");
    loadProducts();
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    await updateProduct(selectedProduct.id, {
      name,
      price: Number(price),
      description,
    });
    setMode("list");
    setSelectedProduct(null);
    loadProducts();
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    loadProducts();
  };

  const resetState = () => {
    setSelectedProduct(null);
    setName("");
    setPrice("");
    setDescription("");
    setMode("list");
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pagedProducts = products.slice(startIndex, startIndex + pageSize);
  const startCount = products.length === 0 ? 0 : startIndex + 1;
  const endCount = Math.min(startIndex + pageSize, products.length);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  if (loading) {
    return <h1 className="text-xl font-semibold">Loading...</h1>;
  }

  if (error) {
    return <h1 className="text-xl font-semibold text-red-500">{error}</h1>;
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Product Management</h1>

      {mode === "list" && (
        <>
          <Button onClick={() => setMode("create")}>Create Product</Button>
          <div className="space-y-3">
            {pagedProducts.map((product) => (
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
                  <p>Price: {product.price}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedProduct(product);
                      setName(product.name);
                      setPrice(String(product.price));
                      setDescription(product.description);
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

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalCount={products.length}
            startCount={startCount}
            endCount={endCount}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {(mode === "create" || mode === "edit") && (
        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Create Product" : "Edit Product"}
          </h2>

          <Input
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="text"
            inputMode="numeric"
            placeholder="Price"
            value={price}
            onChange={(e) => {
              if (isPositiveInteger(e.target.value)) {
                setPrice(e.target.value);
              }
            }}
            onKeyDown={preventInvalidNumberKey}
          />

          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          <p>Price: {selectedProduct.price}</p>
          <p>Description: {selectedProduct.description}</p>

          <Button onClick={resetState}>Back</Button>
        </div>
      )}
    </section>
  );
}

export default Product;
