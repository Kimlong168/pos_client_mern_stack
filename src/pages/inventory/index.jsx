import { InventoryProvider } from "../../contexts/InventoryContext";
import Inventory from "./Inventory";
const index = () => {
  return (
    <InventoryProvider>
      <Inventory />
    </InventoryProvider>
  );
};

export default index;
