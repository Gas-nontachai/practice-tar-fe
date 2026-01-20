import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductByID } from "@/services/productsService";
import type { ProductRespond } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { pathImg } from "@/utils/pathImg";
import { Image } from "@/components/ui/image";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductRespond | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parsedId = Number(id);
    if (!id || !Number.isInteger(parsedId) || parsedId <= 0) {
      setError("Invalid product id");
      setProduct(null);
      return;
    }

    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductByID(parsedId);
        if (isMounted) {
          setProduct(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to fetch product");
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <h1 className="text-xl font-semibold">Loading...</h1>;
  }

  if (error) {
    return <h1 className="text-xl font-semibold text-red-500">{error}</h1>;
  }

  if (!product) {
    return <h1 className="text-xl font-semibold">Product not found</h1>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Product Detail</h1>
        <Button asChild>
          <Link to="/products" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {product.img_path && (
            <div className="flex gap-3">
              <span>Image: </span>
              <Image
                src={pathImg(product.img_path)}
                alt={product.name}
                containerClassName="w-30 h-30"
              />
            </div>
          )}
          <p>ID: {product.id}</p>
          <p>Name: {product.name}</p>
          <p>Price: {product.price} $</p>
          <p>Description: {product.description}</p>
        </CardContent>
      </Card>
    </section>
  );
}

export default ProductDetail;
