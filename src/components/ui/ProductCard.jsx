import PropTypes from "prop-types";
import { assets } from "../../assets/assets";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { isItemExist, getItemQuantity } from "../../utils/cart";
const ProductCard = ({ product }) => {
  const {
    state: cartItems,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(getItemQuantity(cartItems, product));

  useEffect(() => {
    setQuantity(getItemQuantity(cartItems, product));
  }, [cartItems, product]);

  useEffect(() => {
    setAdded(isItemExist(cartItems, product));
  }, [cartItems, product]);

  const addItemToCart = () => {
    if (quantity === 0 && !isItemExist(cartItems, product)) {
      // product.quantity = 1;
      addItem({
        product: product, // product: product,
        quantity: 1,
      });
    } else {
      increaseQuantity(product._id);
    }
    setAdded(true);
    setQuantity((prev) => prev + 1);
  };

  const removeItemFromCart = () => {
    if (quantity === 1) {
      setAdded(false);
      setQuantity(0);
      removeItem(product._id);
    } else {
      setQuantity((prev) => prev - 1);
      decreaseQuantity(product._id);
    }
  };
  return (
    <div
      onClick={() => addItemToCart()}
      className={`border border-gray-200 rounded-xl overflow-hidden shadow-md`}
    >
      <div className="relative">
        <div className="overflow-hidden ">
          <img
            className="w-full object-cover h-[200px] 2xl:h-[300px]"
            src={product.image}
            alt="product_iamge"
          />
        </div>
        <div className="absolute bottom-4 right-4">
          {added ? (
            <>
              <div className="flex items-center justify-end gap-1 bg-white rounded-full">
                <img
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent click when removing item
                    removeItemFromCart();
                  }}
                  className="w-9 h-9 cursor-pointer"
                  src={assets.remove_icon_red}
                  alt="remove_icon_red"
                />
                {quantity}
                <img
                  className="w-9 h-9 cursor-pointer"
                  src={assets.add_icon_green}
                  alt="add_icon_green"
                />
              </div>
            </>
          ) : (
            <img
              className="w-9 h-9 rounded-full  border border-orange-500 cursor-pointer"
              src={assets.add_icon_white}
              alt="add_icon_white"
            />
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between ">
          <h3 className="font-semibold">{product.name}</h3>
        </div>
        {/* <p className="text-xs my-2">{product.description}</p> */}
        <p className="font-bold text-orange-500">${product.price}</p>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;
