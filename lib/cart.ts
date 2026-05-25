export const CART_STORAGE_KEY = "apex_cart_items";
export const CART_EVENT_NAME = "apex-cart-updated";

export type CartItem = {
  id: string;
  productSlug: string;
  productName: string;
  productHref: string;
  imageSrc?: string;
  imageAlt?: string;
  variantLabel: string;
  priceLabel: string;
  quantity: number;
  referralCode?: string;
  status: "pre-order";
};

export type CartItemInput = Omit<CartItem, "id" | "quantity"> & {
  quantity?: number;
};

function canUseBrowserApis() {
  return typeof window !== "undefined";
}

export function readCartItems(): CartItem[] {
  if (!canUseBrowserApis()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCartItems(items: CartItem[]) {
  if (!canUseBrowserApis()) {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT_NAME, { detail: items }));
}

export function getCartCount(items = readCartItems()) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function addCartItem(input: CartItemInput) {
  const items = readCartItems();
  const nextQuantity = Math.max(1, input.quantity ?? 1);
  const existingIndex = items.findIndex(
    (item) => item.productSlug === input.productSlug && item.variantLabel === input.variantLabel,
  );

  if (existingIndex >= 0) {
    const existingItem = items[existingIndex];
    items[existingIndex] = {
      ...existingItem,
      quantity: existingItem.quantity + nextQuantity,
      referralCode: input.referralCode ?? existingItem.referralCode,
    };
  } else {
    items.push({
      id: `${input.productSlug}:${input.variantLabel}`,
      productSlug: input.productSlug,
      productName: input.productName,
      productHref: input.productHref,
      imageSrc: input.imageSrc,
      imageAlt: input.imageAlt,
      variantLabel: input.variantLabel,
      priceLabel: input.priceLabel,
      quantity: nextQuantity,
      referralCode: input.referralCode,
      status: "pre-order",
    });
  }

  writeCartItems(items);
  return items;
}

export function updateCartItemQuantity(id: string, quantity: number) {
  const items = readCartItems()
    .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    .filter((item) => item.quantity > 0);

  writeCartItems(items);
  return items;
}

export function removeCartItem(id: string) {
  const items = readCartItems().filter((item) => item.id !== id);
  writeCartItems(items);
  return items;
}

export function clearCartItems() {
  writeCartItems([]);
}

export function getVariantPrice(variantPriceLabel: string) {
  const numericValue = Number(variantPriceLabel.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : 0;
}
