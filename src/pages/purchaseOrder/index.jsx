import { PurchaseOrderProvider } from "../../contexts/PurchaseOrderContext";
import PurchaseOrder from "./PurchaseOrder";
const index = () => {
  return (
    <PurchaseOrderProvider>
      <PurchaseOrder />
    </PurchaseOrderProvider>
  );
};

export default index;
