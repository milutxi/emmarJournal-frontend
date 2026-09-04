import { TreatmentSession } from "../types";

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

export const applyTreatmenSelection = (
  session: TreatmentSession,
  treatmentId: string,
  price: number,
  duration: number,
): TreatmentSession => {
  const safePrice = normalizePriceNumber(price);
  const safeDuration = normalizePriceNumber(duration);

  return {
    ...session,
    treatmentId,
    price: safePrice,
    duration: safeDuration,
    discount: 0,
    totalPrice: safePrice,
  };
};

export const applyDiscount = (
  session: TreatmentSession,
  value: number,
): TreatmentSession => {
  const price = normalizePriceNumber(session.price);
  const discount = Math.min(normalizePriceNumber(value), price);
  const totalPrice = calculateTotalPriceFromDiscount(price, discount);

  return {
    ...session,
    discount,
    totalPrice,
  };
};

export const applyTotalPrice = (
  session: TreatmentSession,
  value: number,
): TreatmentSession => {
  const price = normalizePriceNumber(session.price);
  const totalPrice = Math.min(normalizePriceNumber(value), price);
  const discount = calculateDiscountFromTotalPrice(price, totalPrice);

  return {
    ...session,
    totalPrice,
    discount,
  };
};