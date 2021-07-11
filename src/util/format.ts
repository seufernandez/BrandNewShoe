export const { format: formatPrice } = new Intl.NumberFormat('en-us', {
  style: 'currency',
  currency: 'USD',
});
