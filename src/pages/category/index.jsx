import { CategoryProvider } from "../../contexts/CategoryContext";
import Category from "./Category";
const index = () => {
  return (
    <CategoryProvider>
      <Category />
    </CategoryProvider>
  );
};

export default index;
