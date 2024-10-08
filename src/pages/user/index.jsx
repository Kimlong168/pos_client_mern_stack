import { UserProvider } from "../../contexts/UserContext";
import User from "./User";
const index = () => {
  return (
    <UserProvider>
      <User />
    </UserProvider>
  );
};

export default index;
