export const isItemExist = (cart, item) => {
  return cart.find((cartItem) => cartItem.product._id === item._id);
};

export const getItemQuantity = (cart, item) => {
  const cartItem = cart.find((cartItem) => cartItem.product._id === item._id);
  return cartItem ? cartItem.quantity : 0;
};

export const getTotalItems = (cart) => {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

export const getTotalPrice = (cart) => {
  return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
};
