import { OrderProvider } from "../../contexts/OrderContext";
import Order from "./Order";
const index = () => {
  return (
    <OrderProvider>
      <Order />
    </OrderProvider>
  );
};

export default index;
