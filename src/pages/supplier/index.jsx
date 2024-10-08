import { SupplierProvider } from "../../contexts/SupplierContext";
import Supplier from "./Supplier";
const index = () => {
  return (
    <SupplierProvider>
      <Supplier />
    </SupplierProvider>
  );
};

export default index;
