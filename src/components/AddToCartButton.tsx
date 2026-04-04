"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useCart, type CartItem } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  item: CartItem;
  size?: "sm" | "md" | "lg";
  className?: string;
  showPrice?: boolean;
}

export default function AddToCartButton({
  item,
  size = "md",
  className,
  showPrice = true,
}: AddToCartButtonProps) {
  const { addItem, removeItem, isInCart } = useCart();
  const inCart = isInCart(item.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1",
    md: "px-3.5 py-2 text-sm gap-1.5",
    lg: "px-5 py-2.5 text-sm gap-2",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center font-semibold rounded-lg transition-all duration-200",
        inCart
          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          : "bg-brand-600 text-white hover:bg-brand-700 shadow-sm dark:bg-brand-500 dark:hover:bg-brand-600",
        sizeClasses[size],
        className
      )}
    >
      {inCart ? (
        <>
          <Check className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
          In Cart
        </>
      ) : (
        <>
          <ShoppingCart className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
          {showPrice ? `$${item.price.toFixed(2)}` : "Add to Cart"}
        </>
      )}
    </button>
  );
}
