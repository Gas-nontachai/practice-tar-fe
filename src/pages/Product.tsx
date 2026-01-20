import { useEffect, useState } from "react";
import { type ChangeEvent } from "react";
import type { UploadedFile } from "@/types/upload";

import { Link } from "react-router-dom";
import {
  fetchAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productsService";
import type { ProductRespond } from "@/types";
import { Button } from "@/components/ui/button";
import { DialogAlert } from "@/components/ui/dialog-alert";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  isPositiveInteger,
  preventInvalidNumberKey,
} from "@/utils/numberInput";
import { uploadSingle } from "@/services/uploads";
import { trimmedPath } from "@/utils/trimmedPath";
import { pathImg } from "@/utils/pathImg";
type Mode = "list" | "create" | "edit";

function Product() {
  const [products, setProducts] = useState<ProductRespond[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductRespond | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<ProductRespond | null>(null);
  const [mode, setMode] = useState<Mode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [singleFile, setSingleFile] = useState<File | null>(null);

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

  const handleCreate = async () => {
    if (!name.trim()) {
      setAlertMessage("Product name is required");
      setAlertOpen(true);
      return;
    }
    if (!price.trim()) {
      setAlertMessage("Product price is required");
      setAlertOpen(true);
      return;
    }
    setError(null);
    let uploaded: UploadedFile | null = null;
    if (singleFile) {
      uploaded = await uploadSingle(singleFile);
    }
    await createProduct({
      name,
      price: Number(price),
      description,
      img_path: uploaded ? trimmedPath(uploaded?.path || "") : undefined,
    });
    setName("");
    setMode("list");
    loadProducts();
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    let uploaded: UploadedFile | null = null;
    if (singleFile) {
      uploaded = await uploadSingle(singleFile);
    }
    await updateProduct(selectedProduct.id, {
      name,
      price: Number(price),
      description,
      img_path: uploaded ? trimmedPath(uploaded?.path || "") : undefined, 
    });
    setMode("list");
    setSelectedProduct(null);
    loadProducts();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
    loadProducts();
  };

  const resetState = () => {
    setSelectedProduct(null);
    setName("");
    setPrice("");
    setDescription("");
    setMode("list");
  };

  const handleSingleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSingleFile(file);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pagedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize,
  );
  const startCount = filteredProducts.length === 0 ? 0 : startIndex + 1;
  const endCount = Math.min(startIndex + pageSize, filteredProducts.length);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  if (loading) {
    return <h1 className="text-xl font-semibold">Loading...</h1>;
  }

  if (error) {
    return <h1 className="text-xl font-semibold text-red-500">{error}</h1>;
  }

  return (
    <section className="space-y-6">
      {mode === "list" && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Product Management</h1>
            <Button onClick={() => setMode("create")}>
              <Plus className="mr-1 h-4 w-4" />
              Create Product
            </Button>
          </div>
          <div className="flex justify-start">
            <Input
              containerClassName="max-w-sm"
              placeholder="Search products"
              suffix={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {pagedProducts.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No products found.
              </div>
            ) : (
              pagedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <Link className="flex-1" to={`/products/${product.id}`}>
                    <div className="flex gap-5">
                      <div>
                        {product.img_path && (
                          <Image
                            src={pathImg(product.img_path)}
                            alt={product.name}
                            containerClassName="h-24 w-24"
                          />
                        )}
                      </div>
                      <div>
                        <p>ID: {product.id}</p>
                        <p>Name: {product.name}</p>
                        <p>Price: {product.price} $</p>
                        <p>Description: {product.description}</p>
                      </div>
                    </div>
                  </Link>

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
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteTarget(product)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalCount={filteredProducts.length}
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

          <Input
            type="file"
            onChange={handleSingleChange}
            className="file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium"
          />

          <div className="flex gap-2">
            <Button onClick={mode === "create" ? handleCreate : handleUpdate}>
              {mode === "create" ? (
                <Plus className="mr-1 h-4 w-4" />
              ) : (
                <Pencil className="mr-1 h-4 w-4" />
              )}
              {mode === "create" ? "Create" : "Update"}
            </Button>
            <Button variant="outline" onClick={resetState}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <DialogAlert
        open={deleteTarget !== null}
        title="Delete product?"
        description={
          deleteTarget
            ? `This will permanently delete ${deleteTarget.name}.`
            : undefined
        }
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <DialogAlert
        open={alertOpen}
        title="Validation error"
        description={alertMessage}
        mode="alert"
        onCancel={() => setAlertOpen(false)}
        onConfirm={() => setAlertOpen(false)}
      />
    </section>
  );
}

export default Product;
