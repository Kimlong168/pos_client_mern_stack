import { ProductProvider } from "../../contexts/ProductContext";
import Product from "./Product";
const index = () => {
  return (
    <ProductProvider>
      <Product />
    </ProductProvider>
  );
};

export default index;
