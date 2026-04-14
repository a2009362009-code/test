import { toast } from "@/components/ui/sonner";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import type { Product } from "@/data/products";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
};

const AddToCartButton = ({ product, className = "" }: AddToCartButtonProps) => {
  const { addToCart } = useCart();
  const { tr } = useI18n();

  const handleClick = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    if (toast && typeof toast.success === "function") {
      toast.success(`${product.name} added to cart.`);
      return;
    }

    if (typeof toast === "function") {
      toast(`${product.name} added to cart.`);
      return;
    }

    console.log(`${product.name} added to cart.`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={`${tr("products.addtocart")} ${product.name}`}
    >
      {tr("products.addtocart")}
    </button>
  );
};

export default AddToCartButton;
