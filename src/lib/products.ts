import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import { products as seedProducts, type Product } from "@/data/products";
import type { ApiProduct } from "@/lib/api";

const imageMap: Record<string, string> = {
  "/assets/product-1.jpg": product1,
  "/assets/product-2.jpg": product2,
  "/assets/product-3.jpg": product3,
  "/assets/product-4.jpg": product4,
};

function resolveImage(imageUrl: string | undefined, fallback: string) {
  if (!imageUrl) return fallback;
  return imageMap[imageUrl] || imageUrl;
}

export function mapApiProductsToProducts(items: ApiProduct[]): Product[] {
  if (!items.length) return [];

  return items.map((item, index) => {
    const template = seedProducts[index % seedProducts.length];
    return {
      ...template,
      id: String(item.id),
      name: item.name,
      description: item.description,
      price: Number(item.price),
      category: item.category,
      type: item.type,
      image: resolveImage(item.image_url, template.image),
    };
  });
}
