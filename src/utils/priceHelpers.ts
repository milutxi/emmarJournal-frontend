export const normalizePriceNumber = (value: string | number | undefined) => {
  const numberValue = Number(value);

  if(Number.isNaN(numberValue) || numberValue < 0) {
    return 0;
  }

  return numberValue;
};

export const calculateTotalPriceFromDiscount = (
  price: number,
  discount: number,
) => {
  const safePrice = normalizePriceNumber(price);
  const safeDiscount = Math.min(normalizePriceNumber(discount), safePrice);

  return safePrice - safeDiscount;
};

export const calculateDiscountFromTotalPrice = (
  price: number,
  totalPrice: number,
) => {
  const safePrice = normalizePriceNumber(price);
  const safeTotalPrice = Math.min(normalizePriceNumber(totalPrice), safePrice);

  return safePrice - safeTotalPrice;
};