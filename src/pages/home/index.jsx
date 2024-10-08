import Home from "./Home";
import { ProductProvider } from "../../contexts/ProductContext";

const index = () => {
  return (
    <ProductProvider>
      <Home />
    </ProductProvider>
  );
};

export default index;
