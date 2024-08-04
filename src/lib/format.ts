export const formatPrice = (price: number): string => {
  // Format the number using the 'en-EG' locale and 'currency' style
  const formattedPrice = new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  // Remove the currency symbol from the formatted string
  const priceWithoutSymbol = formattedPrice.replace("EGP", "").trim();

  // Return the formatted string with the currency symbol at the end
  return `${priceWithoutSymbol} EGP`;
};
