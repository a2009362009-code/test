import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

type CartProps = {
  isEmbedded?: boolean;
};

const Cart = ({ isEmbedded = false }: CartProps) => {
  const { tr, price } = useI18n();
  const { items, totalPrice, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();

  const emptyContent = (
    <div className="rounded-3xl border border-border bg-card p-10 text-center">
      <h1 className="text-3xl font-semibold">{tr("cart.page.title")}</h1>
      <p className="mt-4 text-muted-foreground">{tr("cart.empty")}</p>
      <Link to="/shop">
        <Button className="mt-8" variant="default">
          {tr("cart.continue")}
        </Button>
      </Link>
    </div>
  );

  if (items.length === 0) {
    return isEmbedded ? emptyContent : <div className="mx-auto max-w-7xl px-6 py-16">{emptyContent}</div>;
  }

  const content = (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{tr("cart.page.title")}</h1>
          <p className="mt-2 text-muted-foreground">{tr("cart.page.subtitle")}</p>
        </div>
        <Button variant="secondary" onClick={clearCart}>
          {tr("cart.clear")}
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-3xl border border-border bg-card p-4 sm:p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-2xl bg-secondary">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{price(item.price)} each</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:items-end">
                <div className="flex items-center gap-2 rounded-full border border-border bg-secondary p-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    -
                  </Button>
                  <span className="min-w-[2rem] text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  {tr("cart.remove")}
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">{tr("cart.itemTotal")}</p>
              <p className="text-base font-semibold">{price(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{tr("cart.total")}</p>
            <p className="mt-2 text-3xl font-semibold">{price(totalPrice)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={clearCart}>
              {tr("cart.clear")}
            </Button>
            <Button>{tr("cart.checkout")}</Button>
          </div>
        </div>
      </div>
    </>
  );

  return isEmbedded ? content : <div className="mx-auto max-w-7xl px-6 py-16">{content}</div>;
};

export default Cart;
