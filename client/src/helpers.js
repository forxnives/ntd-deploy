
export const priceFormat = price => (price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));