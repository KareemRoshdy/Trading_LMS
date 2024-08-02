export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
  }).format(price);
};
